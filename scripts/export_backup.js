const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://kgdesstrvhrkounqqruk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZGVzc3Rydmhya291bnFxcnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDA1NjUsImV4cCI6MjEwMTQ3NjU2NX0.fML9JKsx72oexrjC-cAS1u-mHdYYA6dTorL2J8k1khU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const tables = [
  "departments",
  "profiles",
  "metrics",
  "metric_values",
  "todos",
  "issues",
  "headlines",
  "history_logs"
];

function escapeSqlValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number" || typeof val === "boolean") return val.toString();
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${val.toString().replace(/'/g, "''")}'`;
}

async function runBackup() {
  console.log("📦 Generating full database backup...");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(__dirname, "..", "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const sqlFilePath = path.join(backupDir, `backup_nasigerilya_${timestamp}.sql`);
  const txtFilePath = path.join(backupDir, `backup_nasigerilya_${timestamp}.txt`);

  let sqlOutput = `-- SCOREBOARD NASI GERILYA FULL DATABASE BACKUP\n-- Generated At: ${new Date().toISOString()}\n\n`;
  let txtOutput = `====================================================\nSCOREBOARD NASI GERILYA - FULL DATA BACKUP DUMP\nGenerated At: ${new Date().toISOString()}\n====================================================\n\n`;

  for (const table of tables) {
    try {
      console.log(`📥 Fetching table: [${table}]...`);
      const { data, error } = await supabase.from(table).select("*");
      if (error) {
        console.error(`❌ Error fetching [${table}]:`, error.message);
        continue;
      }

      const rows = data || [];

      // SQL Dump
      sqlOutput += `-- Table: public.${table} (${rows.length} rows)\n`;
      if (rows.length > 0) {
        rows.forEach(row => {
          const keys = Object.keys(row);
          const cols = keys.map(k => `"${k}"`).join(", ");
          const vals = keys.map(k => escapeSqlValue(row[k])).join(", ");
          sqlOutput += `INSERT INTO public.${table} (${cols}) VALUES (${vals}) ON CONFLICT (id) DO NOTHING;\n`;
        });
      }
      sqlOutput += "\n";

      // TXT Dump
      txtOutput += `\n[TABLE: ${table.toUpperCase()}] (${rows.length} records)\n`;
      txtOutput += `-`.repeat(60) + "\n";
      txtOutput += JSON.stringify(rows, null, 2) + "\n\n";

    } catch (err) {
      console.error(`💥 Failed to backup [${table}]:`, err);
    }
  }

  fs.writeFileSync(sqlFilePath, sqlOutput, "utf-8");
  fs.writeFileSync(txtFilePath, txtOutput, "utf-8");

  console.log(`\n🎉 Backup Completed Successfully!`);
  console.log(`📄 SQL File: ${sqlFilePath}`);
  console.log(`📄 TXT File: ${txtFilePath}`);
}

runBackup();

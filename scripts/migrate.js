const { createClient } = require("@supabase/supabase-js");

const SOURCE_URL = "https://kgdesstrvhrkounqqruk.supabase.co";
const SOURCE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZGVzc3Rydmhya291bnFxcnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDA1NjUsImV4cCI6MjEwMTQ3NjU2NX0.fML9JKsx72oexrjC-cAS1u-mHdYYA6dTorL2J8k1khU";

const TARGET_URL = "https://shdeembzgcdckrdycjrq.supabase.co";
const TARGET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZGVlbWJ6Z2NkY2tyZHljanJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDAzMzMsImV4cCI6MjEwMTUxNjMzM30.ZUWPhp0AelWViwkMo_nR8Cs5DYNeyd2edvN-z-bHXIA";

const sourceSupabase = createClient(SOURCE_URL, SOURCE_KEY);
const targetSupabase = createClient(TARGET_URL, TARGET_KEY);

const tables = [
  "departments",
  "profiles",
  "metrics",
  "metric_values",
  "todos",
  "issues",
  "headlines",
  "history_logs",
  "system_settings"
];

async function migrate() {
  console.log("🚀 Starting database migration from Source to Target...");

  for (const table of tables) {
    try {
      console.log(`\n📦 Migrating table: [${table}]...`);
      const { data, error } = await sourceSupabase.from(table).select("*");
      if (error) {
        console.error(`❌ Source fetch error for [${table}]:`, error.message);
        continue;
      }

      if (!data || data.length === 0) {
        console.log(`ℹ️ Table [${table}] has 0 rows. Skipping.`);
        continue;
      }

      console.log(`📥 Read ${data.length} rows from Source [${table}]. Writing to Target...`);

      // Upsert data to target
      const { error: insertErr } = await targetSupabase.from(table).upsert(data);
      if (insertErr) {
        console.log(`⚠️ Batch upsert error for [${table}]: ${insertErr.message}. Retrying row-by-row...`);
        let successCount = 0;
        for (const row of data) {
          const cleanRow = { ...row };
          let { error: singleErr } = await targetSupabase.from(table).upsert(cleanRow);
          if (singleErr && singleErr.message.includes("column")) {
            const match = singleErr.message.match(/'([^']+)'/);
            if (match && match[1]) {
              delete cleanRow[match[1]];
              const retry = await targetSupabase.from(table).upsert(cleanRow);
              singleErr = retry.error;
            }
          }
          if (!singleErr) {
            successCount++;
          } else {
            console.error(`   Single row fail in [${table}] ID ${row.id || row.key}:`, singleErr.message);
          }
        }
        console.log(`✅ Migrated ${successCount}/${data.length} rows for [${table}].`);
      } else {
        console.log(`✅ Successfully migrated all ${data.length} rows for [${table}]!`);
      }
    } catch (err) {
      console.error(`💥 Unexpected error migrating [${table}]:`, err);
    }
  }

  console.log("\n🎉 Database migration finished!");
}

migrate();

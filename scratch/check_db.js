const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://wmtxuhyavvlygawchqaa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdHh1aHlhdnZseWdhd2NocWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTc2OTIsImV4cCI6MjA2MTYzMzY5Mn0.SgAUp2W_E9m_5d-Y15hJ_82J_H6c0D1r_R4b7m3R9xI";

// Initialize using environment variables if present in process.env
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey;

const supabase = createClient(url, key);

async function checkData() {
  console.log("--- CHECKING SUPABASE DATA ---");
  
  const { data: issues, error: issuesErr } = await supabase.from("issues").select("*");
  console.log("Issues Count:", issues ? issues.length : 0, "Error:", issuesErr);
  if (issues && issues.length > 0) {
    console.log("Sample Issues:", issues.map(i => ({ id: i.id, title: i.title, status: i.status, department_id: i.department_id })));
  }

  const { data: headlines, error: headlinesErr } = await supabase.from("headlines").select("*");
  console.log("Headlines Count:", headlines ? headlines.length : 0, "Error:", headlinesErr);
  if (headlines && headlines.length > 0) {
    console.log("Sample Headlines:", headlines.map(h => ({ id: h.id, title: h.title, category: h.category, department_id: h.department_id })));
  }
}

checkData();

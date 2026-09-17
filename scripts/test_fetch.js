const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://kgdesstrvhrkounqqruk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZGVzc3Rydmhya291bnFxcnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDA1NjUsImV4cCI6MjEwMTQ3NjU2NX0.fML9JKsx72oexrjC-cAS1u-mHdYYA6dTorL2J8k1khU";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testFetch() {
  console.log("🔍 Testing Supabase fetch on kgdesstrvhrkounqqruk...");
  const { data: metrics, error: err1 } = await supabase.from("metrics").select("*");
  console.log("Metrics count:", metrics ? metrics.length : 0, "Error:", err1 ? err1.message : "None");

  const { data: profiles, error: err2 } = await supabase.from("profiles").select("*");
  console.log("Profiles count:", profiles ? profiles.length : 0, "Error:", err2 ? err2.message : "None");

  const { data: todos, error: err3 } = await supabase.from("todos").select("*");
  console.log("Todos count:", todos ? todos.length : 0, "Error:", err3 ? err3.message : "None");

  const { data: issues, error: err4 } = await supabase.from("issues").select("*");
  console.log("Issues count:", issues ? issues.length : 0, "Error:", err4 ? err4.message : "None");
}

testFetch();

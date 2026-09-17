import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Toggle to connect to Supabase database.
// When false, the website runs 100% locally with zero database network requests.
export const ENABLE_DATABASE = process.env.NEXT_PUBLIC_ENABLE_DATABASE === "true";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://local-offline.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.offline";

// Strongly-typed client instance. When ENABLE_DATABASE is false, AppContext and services bypass all database calls.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

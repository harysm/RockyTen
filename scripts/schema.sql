-- Complete DDL Schema for Scoreboard Nasi Gerilya
-- Paste this script into Supabase SQL Editor: https://supabase.com/dashboard/project/kgdesstrvhrkounqqruk/sql/new

-- 1. Create Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department_id TEXT,
  avatar_url TEXT,
  email TEXT,
  password TEXT
);

-- 3. Create Metrics Table
CREATE TABLE IF NOT EXISTS public.metrics (
  id TEXT PRIMARY KEY,
  department_id TEXT,
  name TEXT NOT NULL,
  target NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  target_type TEXT NOT NULL,
  pic_id TEXT,
  pic_name TEXT,
  keterangan TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  cycle_type TEXT DEFAULT 'monthly',
  duration_days INT DEFAULT 7,
  deadline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Metric Values Table
CREATE TABLE IF NOT EXISTS public.metric_values (
  id TEXT PRIMARY KEY,
  metric_id TEXT,
  year INT NOT NULL,
  month INT NOT NULL,
  week INT NOT NULL,
  value NUMERIC,
  inputted_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  daily_values JSONB
);

-- 5. Create Todos Table
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  department_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  deadline TEXT,
  status TEXT DEFAULT 'pending',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_to_metric_id TEXT,
  attachments JSONB
);

-- 6. Create Issues Table
CREATE TABLE IF NOT EXISTS public.issues (
  id TEXT PRIMARY KEY,
  department_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  pic_id TEXT,
  pic_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  attachment_name TEXT,
  attachment_size NUMERIC,
  attachment_type TEXT,
  attachment_data_url TEXT,
  attachments JSONB
);

-- 7. Create Headlines Table
CREATE TABLE IF NOT EXISTS public.headlines (
  id TEXT PRIMARY KEY,
  department_id TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'announcement',
  author_id TEXT,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  attachment_name TEXT,
  attachment_size NUMERIC,
  attachment_type TEXT,
  attachment_data_url TEXT,
  attachments JSONB
);

-- 8. Create History Logs Table
CREATE TABLE IF NOT EXISTS public.history_logs (
  id TEXT PRIMARY KEY,
  profile_id TEXT,
  profile_name TEXT,
  department_id TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alter tables if already created to ensure columns match
ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.metrics ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Disable Row Level Security (RLS) for all tables so API keys can read/write freely
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_values DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.headlines DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings DISABLE ROW LEVEL SECURITY;

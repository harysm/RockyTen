-- Complete DDL Schema for Scoreboard Nasi Gerilya
-- Paste this script into Supabase SQL Editor: https://supabase.com/dashboard/project/pmnswfpwwsylqlttjzvd/sql/new

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO public.departments (id, name) VALUES
('dept-kitchen', 'Kitchen'),
('dept-service', 'Service / Floor'),
('dept-it', 'IT'),
('dept-finance', 'Finance'),
('dept-marketing', 'Marketing')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'pic', 'developer')),
  department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
  avatar_url TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL DEFAULT '123456'
);

INSERT INTO public.profiles (id, name, role, department_id, email, password, avatar_url) VALUES
('prof-dev', 'Developer', 'developer', NULL, 'developer@ng.com', 'pbkdf2$50000$def51ee1826bddea3e704271d09072bf$aa7975e69f2eba3b3961d061c37211befa8f1ec8879a39ec135028ae8e03fb96', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'),
('prof-owner', 'Owner', 'owner', NULL, 'owner@ng.com', 'pbkdf2$50000$c09a74e6017733df6932a95a4df51189$42859ddf9cd3d0df8a4e15d2a95d6cde2376958e739c0fc050f2056a6c1961f6', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'),
('prof-kim', 'Owner (Kim)', 'owner', NULL, 'kim@ng.com', 'pbkdf2$50000$e9394055b2bd0b3bea0051eac8387dd0$cb8a45b0f04965798c1e367baa2cc5980b8e4a399d06bd70788271335fa96107', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'),
('prof-pic-it', 'IT', 'pic', 'dept-it', 'it@ng.com', 'pbkdf2$50000$757901a5bb6edb4d45ded406b7921243$b6dcbceb53bec2a33511a6451e501bc4d2c20e48356059d62504df969d7a7f3e', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'),
('prof-pic-finance', 'Finance', 'pic', 'dept-finance', 'finance@ng.com', 'pbkdf2$50000$88e7e1d3e8a6a539c68a041d77d77851$3e6284216b95468309a2303566aaca2c567810b21e931ae16603409351cd0635', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80'),
('prof-pic-kitchen', 'Kitchen', 'pic', 'dept-kitchen', 'kitchen@ng.com', 'pbkdf2$50000$b2d8a4bf4f4be271f9d14b17b722d92a$457b7c670770b03a95386c03aa51458cd0413e0ecbb3514ba9a5bde5c0888cd5', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=250&q=80'),
('prof-pic-service', 'Service', 'pic', 'dept-service', 'service@ng.com', 'pbkdf2$50000$1b132df75aab260284ab0669629cda2a$1c22ec0ccae1f4d0fa019d4550e74825bf2cfde425202d986389fc44be587eb0', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80'),
('prof-pic-marketing', 'Marketing', 'pic', 'dept-marketing', 'marketing@ng.com', 'pbkdf2$50000$7ece4dd5d7429816b5139279d8c0a6e1$69dd3cc748e4d12ec2abaa2bad1c571310da8665524c07bb5dd92629341aa27f', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department_id = EXCLUDED.department_id,
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    avatar_url = EXCLUDED.avatar_url;

-- 3. Rocks Table
CREATE TABLE IF NOT EXISTS public.rocks (
  id TEXT PRIMARY KEY,
  department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  quarter TEXT DEFAULT 'Q3',
  year INTEGER DEFAULT 2026,
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'off_track', 'done', 'dropped')),
  pic_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  pic_name TEXT,
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Metrics Table
CREATE TABLE IF NOT EXISTS public.metrics (
  id TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target NUMERIC NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('number', 'percentage', 'currency', 'boolean')),
  target_type TEXT NOT NULL CHECK (target_type IN ('higher_better', 'lower_better')),
  pic_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pic_name TEXT NOT NULL,
  keterangan TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  cycle_type TEXT NOT NULL DEFAULT 'monthly' CHECK (cycle_type IN ('monthly', 'special')),
  duration_days INTEGER DEFAULT 7 NOT NULL,
  deadline TEXT,
  accumulation_mode TEXT DEFAULT 'sum' CHECK (accumulation_mode IN ('sum', 'average')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Metric Values Table
CREATE TABLE IF NOT EXISTS public.metric_values (
  id TEXT PRIMARY KEY,
  metric_id TEXT NOT NULL REFERENCES public.metrics(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  week INTEGER NOT NULL,
  value NUMERIC,
  inputted_by TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  daily_values JSONB DEFAULT '[]'::jsonb NOT NULL,
  CONSTRAINT unique_metric_week UNIQUE (metric_id, year, month, week)
);

-- 6. Todos Table
CREATE TABLE IF NOT EXISTS public.todos (
  id TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancel')),
  created_by TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  converted_to_metric_id TEXT REFERENCES public.metrics(id) ON DELETE SET NULL,
  attachments JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Issues Table
CREATE TABLE IF NOT EXISTS public.issues (
  id TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'solved', 'closed')),
  pic_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pic_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  attachment_name TEXT,
  attachment_size INTEGER,
  attachment_type TEXT,
  attachment_data_url TEXT,
  attachments JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- 8. Headlines Table
CREATE TABLE IF NOT EXISTS public.headlines (
  id TEXT PRIMARY KEY,
  department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('good_news', 'bad_news', 'reminder', 'announcement', 'achievement')),
  author_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  attachment_name TEXT,
  attachment_size INTEGER,
  attachment_type TEXT,
  attachment_data_url TEXT,
  attachments JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- 9. History Logs Table
CREATE TABLE IF NOT EXISTS public.history_logs (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL,
  department_id TEXT REFERENCES public.departments(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.headlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('departments', 'profiles', 'rocks', 'metrics', 'metric_values', 'todos', 'issues', 'headlines', 'history_logs', 'system_settings')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow all for authenticated and anon" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Allow all for authenticated and anon" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
    END LOOP;
END $$;

-- ==========================================
-- SUPABASE SCHEMA - SCOREBOARD NASI GERILYA (FULL SETUP SQL)
-- Salin seluruh isi file ini ke Supabase Dashboard > SQL Editor, lalu klik RUN.
-- Project URL: https://jypfxxfoyuyqfnqyerzr.supabase.co
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Seed initial departments
INSERT INTO departments (id, name) VALUES
('dept-kitchen', 'Kitchen'),
('dept-floor', 'Floor'),
('dept-it', 'IT'),
('dept-finance', 'Finance'),
('dept-marketing', 'Marketing')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'pic', 'developer')),
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456'
);

-- Seed core profiles
INSERT INTO profiles (id, name, role, department_id, email, password, avatar_url) VALUES
('prof-dev', 'Developer', 'developer', NULL, 'dev@nasigerilya.com', 'dev123', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80'),
('prof-richard', 'Richard', 'owner', NULL, 'richard@gmail.com', 'owner123', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'),
('prof-kim', 'Kim', 'owner', NULL, 'kim@gmail.com', 'owner123', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department_id = EXCLUDED.department_id,
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    avatar_url = EXCLUDED.avatar_url;

-- 3. METRICS TABLE
CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target NUMERIC NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('number', 'percentage', 'currency', 'boolean')),
    target_type TEXT NOT NULL CHECK (target_type IN ('higher_better', 'lower_better')),
    pic_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pic_name TEXT NOT NULL,
    keterangan TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    cycle_type TEXT NOT NULL DEFAULT 'monthly' CHECK (cycle_type IN ('monthly', 'special')),
    duration_days INTEGER DEFAULT 7 NOT NULL,
    deadline TEXT,
    accumulation_mode TEXT DEFAULT 'sum' CHECK (accumulation_mode IN ('sum', 'average')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. METRIC VALUES TABLE
CREATE TABLE IF NOT EXISTS metric_values (
    id TEXT PRIMARY KEY,
    metric_id TEXT NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    week INTEGER NOT NULL,
    value NUMERIC,
    inputted_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    daily_values JSONB DEFAULT '[]'::jsonb NOT NULL,
    CONSTRAINT unique_metric_week UNIQUE (metric_id, year, month, week)
);

-- 5. TODOS TABLE
CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    deadline TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancel')),
    created_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    converted_to_metric_id TEXT REFERENCES metrics(id) ON DELETE SET NULL,
    attachments JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. ISSUES TABLE
CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'solved', 'closed')),
    pic_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pic_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    attachment_name TEXT,
    attachment_size INTEGER,
    attachment_type TEXT,
    attachment_data_url TEXT,
    attachments JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- 7. HEADLINES TABLE
CREATE TABLE IF NOT EXISTS headlines (
    id TEXT PRIMARY KEY,
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('good_news', 'bad_news', 'reminder', 'announcement', 'achievement')),
    author_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    attachment_name TEXT,
    attachment_size INTEGER,
    attachment_type TEXT,
    attachment_data_url TEXT,
    attachments JSONB DEFAULT '[]'::jsonb NOT NULL
);

-- 8. HISTORY LOGS TABLE
CREATE TABLE IF NOT EXISTS history_logs (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    profile_name TEXT NOT NULL,
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);


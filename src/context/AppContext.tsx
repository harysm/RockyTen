"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, ENABLE_DATABASE } from "@/lib/supabase";
import { insertMetricToDb, saveMetricValueToDb } from "@/services/metricService";
import { insertTodoToDb } from "@/services/todoService";
import { insertIssueToDb } from "@/services/issueService";
import { insertHeadlineToDb } from "@/services/headlineService";
import { insertRockToDb, updateRockInDb, deleteRockFromDb } from "@/services/rockService";
import { 
  DEPARTMENTS, 
  DEFAULT_PROFILES, 
  DEFAULT_CREDENTIALS, 
  INITIAL_ROCKS, 
  INITIAL_METRICS, 
  INITIAL_METRIC_VALUES, 
  INITIAL_TODOS, 
  INITIAL_ISSUES, 
  INITIAL_HEADLINES 
} from "@/constants";

// Import central types for local usage and re-export
import type {
  Role,
  Department,
  Profile,
  AttachmentInfo,
  Rock,
  Metric,
  MetricValue,
  Todo,
  Issue,
  Headline,
  HistoryLog,
  ToastInfo,
  ConfirmModalInfo
} from "@/types";

export type {
  Role,
  Department,
  Profile,
  AttachmentInfo,
  Rock,
  Metric,
  MetricValue,
  Todo,
  Issue,
  Headline,
  HistoryLog,
  ToastInfo,
  ConfirmModalInfo
};

export interface EmailNotifSettings {
  enabled: boolean;
  targetEmail: string;
  notifyIssues: boolean;
  notifyHeadlines: boolean;
  notifyTodos: boolean;
  timingMode: "instant" | "scheduled";
  scheduledTime: string;
}

interface AppContextType {
  // Simulator State
  currentProfile: Profile;
  setCurrentProfile: (profile: Profile) => void;
  allProfiles: Profile[];
  departments: Department[];

  // Data State
  rocks: Rock[];
  metrics: Metric[];
  metricValues: MetricValue[];
  todos: Todo[];
  issues: Issue[];
  headlines: Headline[];
  historyLogs: HistoryLog[];

  // Active date filters
  currentYear: number;
  currentMonth: number; // 1-12
  currentWeek: number;  // 1-4

  // CRUD Functions
  addRock: (rock: Omit<Rock, "id" | "createdAt">) => void;
  editRock: (rockId: string, updatedData: Partial<Rock>) => void;
  deleteRock: (rockId: string) => void;
  toggleRockStatus: (rockId: string, status: Rock["status"]) => void;
  getRockProgress: (rockId: string) => { progress: number; totalMetrics: number; onTrackMetrics: number };
  addMetric: (metric: Omit<Metric, "id" | "createdAt" | "isActive">) => void;
  editMetric: (metricId: string, updatedData: Partial<Metric>) => void;
  deleteMetric: (metricId: string) => void;
  updateMetricValue: (metricId: string, week: number, value: number | null) => void;
  updateMetricDailyValues: (metricId: string, week: number, values: (number | null)[]) => void;
  completeMetric: (metricId: string) => void;
  reactivateMetric: (metricId: string) => void;
  addTodo: (todo: Omit<Todo, "id" | "createdBy"> & { createdBy?: string }) => Promise<void>;
  editTodo: (todoId: string, updatedData: Partial<Todo>) => void;
  deleteTodo: (todoId: string) => void;
  updateTodoStatus: (id: string, status: Todo["status"]) => void;
  convertTodoToMetric: (todoId: string, metricData: Omit<Metric, "id" | "createdAt" | "isActive">) => void;
  addIssue: (issue: Omit<Issue, "id" | "createdAt" | "picId" | "picName"> & { picId?: string; picName?: string }) => void;
  editIssue: (issueId: string, updatedData: Partial<Issue>) => void;
  deleteIssue: (issueId: string) => void;
  updateIssueStatus: (id: string, status: Issue["status"]) => void;
  updateIssuePriority: (id: string, priority: Issue["priority"]) => void;
  addHeadline: (headline: Omit<Headline, "id" | "createdAt" | "authorId" | "authorName"> & { authorId?: string; authorName?: string }) => void;
  editHeadline: (headlineId: string, updatedData: Partial<Headline>) => void;
  deleteHeadline: (headlineId: string) => void;
  addHistoryLog: (action: string, details: string, deptId?: string | null) => void;
  archiveOldLogsNow: () => Promise<void>;
  sendEmailNotification: (payload: {
    categoryKey?: "issues" | "headlines" | "todos" | "test";
    to?: string | string[];
    subject: string;
    title: string;
    category: string;
    departmentName?: string;
    authorName?: string;
    details?: string;
    actionUrl?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  
  // Helper Calculations
  getMetricActiveWeek: (metric: Metric) => number;
  getWeekString: (date: Date) => number;
  getFilteredData: () => {
    metrics: Metric[];
    todos: Todo[];
    issues: Issue[];
    headlines: Headline[];
    historyLogs: HistoryLog[];
    rocks: Rock[];
  };
  getHealthScore: (deptId: string | null) => {
    score: number;
    rating: "Excellent" | "Good" | "Need Improvement" | "Critical";
    colorClass: string;
    completionScore: number;
    achievementScore: number;
    issueClosedScore: number;
  };
  // Settings & Theme
  language: "id" | "en";
  updateLanguage: (lang: "id" | "en") => void;
  theme: "light" | "dark";
  updateTheme: (theme: "light" | "dark") => void;
  // Accessibility Settings
  fontSize: "normal" | "large" | "xlarge";
  updateFontSize: (size: "normal" | "large" | "xlarge") => void;
  uiDensity: "compact" | "normal" | "comfortable";
  updateUiDensity: (density: "compact" | "normal" | "comfortable") => void;
  highContrast: boolean;
  updateHighContrast: (enabled: boolean) => void;
  reduceMotion: boolean;
  updateReduceMotion: (enabled: boolean) => void;
  // Email Notifications Settings
  emailNotifSettings: EmailNotifSettings;
  updateEmailNotifSettings: (newSettings: Partial<EmailNotifSettings>) => void;
  // Toast Notification
  toast: ToastInfo | null;
  showToast: (message: string, type?: ToastInfo["type"]) => void;
  hideToast: () => void;
  // Confirm Modal
  confirmModal: ConfirmModalInfo | null;
  showConfirm: (info: ConfirmModalInfo) => void;
  hideConfirm: () => void;
  // Loading State
  isLoading: boolean;
  // Auth & Profile
  isLoggedIn: boolean;
  credentials: Record<string, { password: string; profileId: string }>;
  loginProfile: (email: string, password: string) => { success: boolean; error?: string };
  logoutProfile: () => void;
  addProfile: (profile: Omit<Profile, "id">, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfileAndSave: (profile: Profile, newEmail?: string, newPassword?: string) => void;
  resetToDummyData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_LOGS: HistoryLog[] = [
  {
    id: "log-1",
    profileId: "prof-pic-it",
    profileName: "Devin Satria",
    departmentId: "dept-it",
    action: "Update Metric",
    details: "Mengisi capaian Server Uptime W3: 99.7%",
    createdAt: "18/07 10:15"
  },
  {
    id: "log-2",
    profileId: "prof-pic-marketing",
    profileName: "Dewi Lestari",
    departmentId: "dept-marketing",
    action: "Add Issue",
    details: "Mencatat issue konversi leads B2B Q3 turun",
    createdAt: "18/07 09:30"
  },
  {
    id: "log-3",
    profileId: "prof-pic-kitchen",
    profileName: "Chef Budi Santoso",
    departmentId: "dept-kitchen",
    action: "Update Rock",
    details: "Memperbarui progres Rock Standardisasi Resep & Reduksi Food Waste",
    createdAt: "17/07 14:00"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Default logged in to allow immediate preview
  const [allProfiles, setAllProfiles] = useState<Profile[]>(DEFAULT_PROFILES);
  const [credentials, setCredentials] = useState<Record<string, { password: string; profileId: string }>>(DEFAULT_CREDENTIALS);

  // Current active profile simulator (default: Richard - Owner / Direktur for full global access)
  const [currentProfile, setCurrentProfile] = useState<Profile>(DEFAULT_PROFILES[1]);
  const [rocks, setRocks] = useState<Rock[]>(INITIAL_ROCKS);
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);
  const [metricValues, setMetricValues] = useState<MetricValue[]>(INITIAL_METRIC_VALUES);
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [headlines, setHeadlines] = useState<Headline[]>(INITIAL_HEADLINES);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>(INITIAL_LOGS);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [uiDensity, setUiDensity] = useState<"compact" | "normal" | "comfortable">("normal");
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const showConfirm = (info: ConfirmModalInfo) => {
    setConfirmModal(info);
  };

  const hideConfirm = () => {
    setConfirmModal(null);
  };

  const updateFontSize = (size: "normal" | "large" | "xlarge") => {
    setFontSize(size);
    saveState("fontSize", size);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-font-size", size);
    }
  };

  const updateUiDensity = (density: "compact" | "normal" | "comfortable") => {
    setUiDensity(density);
    saveState("uiDensity", density);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-density", density);
    }
  };

  const updateHighContrast = (enabled: boolean) => {
    setHighContrast(enabled);
    saveState("highContrast", enabled);
    if (typeof document !== "undefined") {
      if (enabled) document.documentElement.setAttribute("data-high-contrast", "true");
      else document.documentElement.removeAttribute("data-high-contrast");
    }
  };

  const updateReduceMotion = (enabled: boolean) => {
    setReduceMotion(enabled);
    saveState("reduceMotion", enabled);
    if (typeof document !== "undefined") {
      if (enabled) document.documentElement.setAttribute("data-reduce-motion", "true");
      else document.documentElement.removeAttribute("data-reduce-motion");
    }
  };

  const [emailNotifSettings, setEmailNotifSettings] = useState<EmailNotifSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("emailNotifSettings");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      enabled: true,
      targetEmail: "haryswork06@gmail.com",
      notifyIssues: true,
      notifyHeadlines: true,
      notifyTodos: true,
      timingMode: "scheduled",
      scheduledTime: "12:00"
    };
  });

  const updateEmailNotifSettings = (newSettings: Partial<EmailNotifSettings>) => {
    setEmailNotifSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveState("emailNotifSettings", updated);

      if (ENABLE_DATABASE) {
        supabase.from("system_settings").upsert({
          key: "email_notif_settings",
          value: updated,
          updated_at: new Date().toISOString()
        }).then(({ error }) => {
          if (error) console.error("Supabase system_settings error:", error);
        });
      }

      return updated;
    });
  };

  const showToast = useCallback((message: string, type: ToastInfo["type"] = "info") => {
    setToast({ id: String(Date.now()), message, type });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const sanitizeForStorage = (val: any): any => {
    if (!val) return val;
    if (Array.isArray(val)) {
      return val.map(sanitizeForStorage);
    }
    if (typeof val === "object") {
      const copy: any = {};
      for (const k in val) {
        if (Object.prototype.hasOwnProperty.call(val, k)) {
          const v = val[k];
          if ((k === "dataUrl" || k === "url") && typeof v === "string" && v.length > 500) {
            copy[k] = undefined;
          } else {
            copy[k] = sanitizeForStorage(v);
          }
        }
      }
      return copy;
    }
    return val;
  };

  const saveState = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      try {
        const sanitized = sanitizeForStorage(data);
        localStorage.setItem(key, JSON.stringify(sanitized));
      } catch (e) {
        // Catch QuotaExceededError silently to prevent Next.js dev overlay crash
      }
    }
  };

  // Set fixed simulated active time to 18 July 2026 as per user screen
  const currentYear = 2026;
  const currentMonth = 7;
  const currentWeek = 3; // Date 18 is between 15-21 (Week 3)

  // Load from localstorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.alert = (message: string) => {
        let type: ToastInfo["type"] = "info";
        const lower = message.toLowerCase();
        if (lower.includes("berhasil") || lower.includes("sukses") || lower.includes("saved") || lower.includes("berhasil disimpan")) {
          type = "success";
        } else if (lower.includes("gagal") || lower.includes("tidak cocok") || lower.includes("tidak bisa") || lower.includes("tidak diperbolehkan") || lower.includes("maksimal") || lower.includes("error")) {
          type = "error";
        }
        showToast(message, type);
      };

      // Intercept browser-default HTML5 form validation balloon tooltips ("Please fill in this field")
      const handleInvalid = (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (!target) return;

        target.focus();

        // Add visual glowing red alert ring on the target element
        target.classList.add("!border-red-500", "!ring-2", "!ring-red-500/50");
        setTimeout(() => {
          target.classList.remove("!border-red-500", "!ring-2", "!ring-red-500/50");
        }, 3500);

        // Extract field label text
        let fieldLabel = "";
        const container = target.closest("div");
        if (container) {
          const labelEl = container.querySelector("label");
          if (labelEl) {
            fieldLabel = labelEl.innerText;
          }
        }
        if (!fieldLabel && "placeholder" in target && target.placeholder) {
          fieldLabel = target.placeholder;
        }

        // Clean label text
        let cleanName = fieldLabel
          .replace(/\(Opsional.*?\)/gi, "")
          .replace(/[*:]/g, "")
          .trim();

        if (cleanName && cleanName === cleanName.toUpperCase() && cleanName.length > 3) {
          cleanName = cleanName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        }

        let msg = "";
        if (cleanName) {
          msg = target.tagName === "SELECT"
            ? `Harap pilih ${cleanName} terlebih dahulu.`
            : `Harap isi ${cleanName} terlebih dahulu.`;
        } else {
          msg = target.tagName === "SELECT"
            ? "Harap pilih opsi yang wajib diisi pada formulir."
            : "Harap isi semua kolom wajib pada formulir.";
        }

        showToast(msg, "warning");
      };

      document.addEventListener("invalid", handleInvalid, true);

      // In Database Mode, purge old stale local cache keys. In Local Mode, keep localStorage intact!
      if (ENABLE_DATABASE) {
        try {
          localStorage.removeItem("metrics");
          localStorage.removeItem("metricValues");
          localStorage.removeItem("todos");
          localStorage.removeItem("issues");
          localStorage.removeItem("headlines");
          localStorage.removeItem("historyLogs");
        } catch (e) { }
      } else {
        // Local Mode: Restore persistent data from localStorage (if any non-empty data exists)
        try {
          const savedMetrics = localStorage.getItem("metrics");
          const savedMetricValues = localStorage.getItem("metricValues");
          const savedTodos = localStorage.getItem("todos");
          const savedIssues = localStorage.getItem("issues");
          const savedHeadlines = localStorage.getItem("headlines");
          const savedHistoryLogs = localStorage.getItem("historyLogs");
          const savedRocks = localStorage.getItem("rocks");

          if (savedMetrics) {
            try {
              const parsed = JSON.parse(savedMetrics);
              if (Array.isArray(parsed) && parsed.length > 0) setMetrics(parsed);
            } catch (e) { }
          }
          if (savedMetricValues) {
            try {
              const parsed = JSON.parse(savedMetricValues);
              if (Array.isArray(parsed) && parsed.length > 0) setMetricValues(parsed);
            } catch (e) { }
          }
          if (savedTodos) {
            try {
              const parsed = JSON.parse(savedTodos);
              if (Array.isArray(parsed) && parsed.length > 0) setTodos(parsed);
            } catch (e) { }
          }
          if (savedIssues) {
            try {
              const parsed = JSON.parse(savedIssues);
              if (Array.isArray(parsed) && parsed.length > 0) setIssues(parsed);
            } catch (e) { }
          }
          if (savedHeadlines) {
            try {
              const parsed = JSON.parse(savedHeadlines);
              if (Array.isArray(parsed) && parsed.length > 0) setHeadlines(parsed);
            } catch (e) { }
          }
          if (savedHistoryLogs) {
            try {
              const parsed = JSON.parse(savedHistoryLogs);
              if (Array.isArray(parsed) && parsed.length > 0) setHistoryLogs(parsed);
            } catch (e) { }
          }
          if (savedRocks) {
            try {
              const parsed = JSON.parse(savedRocks);
              if (Array.isArray(parsed) && parsed.length > 0) setRocks(parsed);
            } catch (e) { }
          }
        } catch (e) { }
      }

      const savedProfile = localStorage.getItem("currentProfile");
      const savedLang = localStorage.getItem("language");
      const savedTheme = localStorage.getItem("theme");
      const savedLoggedIn = localStorage.getItem("isLoggedIn");
      const savedProfiles = localStorage.getItem("allProfiles");
      const savedCredentials = localStorage.getItem("credentials");

      if (savedProfile) {
        try { setCurrentProfile(JSON.parse(savedProfile)); } catch (e) { }
      }
      if (savedLoggedIn) {
        try { setIsLoggedIn(JSON.parse(savedLoggedIn)); } catch (e) { }
      }
      if (savedProfiles) {
        try { setAllProfiles(JSON.parse(savedProfiles)); } catch (e) { }
      }
      if (savedCredentials) {
        try { setCredentials(JSON.parse(savedCredentials)); } catch (e) { }
      }

      if (savedLang) {
        let l: "id" | "en" = "id";
        try {
          l = JSON.parse(savedLang);
        } catch (e) {
          if (savedLang === "id" || savedLang === "en") l = savedLang;
        }
        if (l === "id" || l === "en") setLanguage(l);
      }

      if (savedTheme) {
        let t: "light" | "dark" = "light";
        try {
          t = JSON.parse(savedTheme);
        } catch (e) {
          if (savedTheme === "light" || savedTheme === "dark") t = savedTheme;
        }
        if (t === "light" || t === "dark") {
          setTheme(t);
          if (t === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      }

      const savedFontSize = localStorage.getItem("fontSize");
      const savedUiDensity = localStorage.getItem("uiDensity");
      const savedHighContrast = localStorage.getItem("highContrast");
      const savedReduceMotion = localStorage.getItem("reduceMotion");

      if (savedFontSize) {
        let fs = "normal";
        try { fs = JSON.parse(savedFontSize); } catch(e) { fs = savedFontSize; }
        if (fs === "normal" || fs === "large" || fs === "xlarge") {
          setFontSize(fs as any);
          document.documentElement.setAttribute("data-font-size", fs);
        }
      }

      if (savedUiDensity) {
        let ud = "normal";
        try { ud = JSON.parse(savedUiDensity); } catch(e) { ud = savedUiDensity; }
        if (ud === "compact" || ud === "normal" || ud === "comfortable") {
          setUiDensity(ud as any);
          document.documentElement.setAttribute("data-density", ud);
        }
      }

      if (savedHighContrast) {
        let hc = false;
        try { hc = Boolean(JSON.parse(savedHighContrast)); } catch(e) { hc = savedHighContrast === "true"; }
        setHighContrast(hc);
        if (hc) document.documentElement.setAttribute("data-high-contrast", "true");
      }

      if (savedReduceMotion) {
        let rm = false;
        try { rm = Boolean(JSON.parse(savedReduceMotion)); } catch(e) { rm = savedReduceMotion === "true"; }
        setReduceMotion(rm);
        if (rm) document.documentElement.setAttribute("data-reduce-motion", "true");
      }
      // Fetch initial live data from Supabase PostgreSQL Database (Bypassed in Local Mode)
      const fetchSupabaseData = async () => {
        if (!ENABLE_DATABASE) {
          setIsLoading(false);
          return;
        }
        // 0. Fetch Profiles
        try {
          const { data: dbProfiles } = await supabase.from("profiles").select("*");
          if (dbProfiles && dbProfiles.length > 0) {
            const mappedProfiles: Profile[] = dbProfiles.map(p => ({
              id: p.id,
              name: p.name,
              role: p.role,
              departmentId: p.department_id || null,
              avatarUrl: p.avatar_url || undefined
            }));
            setAllProfiles(mappedProfiles);
            saveState("allProfiles", mappedProfiles);

            const mappedCreds: Record<string, { password: string; profileId: string }> = {};
            dbProfiles.forEach(p => {
              if (p.email) {
                mappedCreds[p.email.toLowerCase()] = {
                  password: p.password || "",
                  profileId: p.id
                };
              }
            });
            if (Object.keys(mappedCreds).length > 0) {
              setCredentials(mappedCreds);
              saveState("credentials", mappedCreds);
            }

            // Sync active currentProfile with DB profile record
            const savedCurrent = typeof window !== "undefined" ? localStorage.getItem("currentProfile") : null;
            let targetId = currentProfile.id;
            if (savedCurrent) {
              try { targetId = JSON.parse(savedCurrent).id || currentProfile.id; } catch (e) { }
            }
            const matchCurrent = mappedProfiles.find(p => p.id === targetId || p.name.toLowerCase() === currentProfile.name.toLowerCase());
            if (matchCurrent) {
              setCurrentProfile(matchCurrent);
              saveState("currentProfile", matchCurrent);
            }
          }
        } catch (e) {
          console.error("Fetch profiles error:", e);
        }

        // Fetch Rocks
        try {
          const { data: dbRocks } = await supabase.from("rocks").select("*").order("created_at", { ascending: false });
          if (dbRocks && Array.isArray(dbRocks) && dbRocks.length > 0) {
            const mappedRocks: Rock[] = dbRocks.map((r: any) => ({
              id: r.id,
              departmentId: r.department_id,
              title: r.title,
              description: r.description || undefined,
              quarter: r.quarter || "Q3",
              year: r.year ? Number(r.year) : 2026,
              status: r.status || "on_track",
              picId: r.pic_id,
              picName: r.pic_name,
              dueDate: r.due_date || "",
              createdAt: r.created_at || new Date().toISOString()
            }));
            setRocks(mappedRocks);
            saveState("rocks", mappedRocks);
          }
        } catch (e) {
          console.error("Fetch rocks error:", e);
        }

        // 1. Fetch Metrics
        try {
          const { data: dbMetrics } = await supabase.from("metrics").select("*");
          if (dbMetrics && Array.isArray(dbMetrics)) {
            let localSaved: Metric[] = [];
            try {
              const raw = typeof window !== "undefined" ? localStorage.getItem("metrics") : null;
              if (raw) localSaved = JSON.parse(raw);
            } catch (e) {}

            const mappedMetrics: Metric[] = dbMetrics.map(m => {
              const localMatch = localSaved.find(l => l.id === m.id);
              const inferredCycleType = (m.cycle_type as "monthly" | "special")
                || localMatch?.cycleType 
                || (m.deadline || localMatch?.deadline ? "special" : "monthly");

              return {
                id: m.id,
                departmentId: m.department_id,
                rockId: m.rock_id || localMatch?.rockId || null,
                name: m.name,
                target: Number(m.target),
                unit: m.unit,
                targetType: m.target_type,
                picId: m.pic_id,
                picName: m.pic_name,
                keterangan: m.keterangan || localMatch?.keterangan || undefined,
                isActive: m.is_active,
                createdAt: m.created_at,
                cycleType: inferredCycleType,
                durationDays: m.duration_days || localMatch?.durationDays || 7,
                deadline: m.deadline || localMatch?.deadline || undefined,
                accumulationMode: m.accumulation_mode || localMatch?.accumulationMode || (m.unit === "percentage" ? "average" : "sum")
              };
            });
            setMetrics(mappedMetrics);
            saveState("metrics", mappedMetrics);
          }
        } catch (e) {
          console.error("Fetch metrics error:", e);
        }

        // 2. Fetch Metric Values
        try {
          const { data: dbValues } = await supabase.from("metric_values").select("*");
          if (dbValues && Array.isArray(dbValues)) {
            const mappedValues: MetricValue[] = dbValues.map(v => {
              let parsedDaily: (number | null)[] = [];
              if (Array.isArray(v.daily_values)) {
                parsedDaily = v.daily_values;
              } else if (typeof v.daily_values === "string") {
                try {
                  parsedDaily = JSON.parse(v.daily_values);
                } catch (e) {
                  parsedDaily = [];
                }
              }
              return {
                id: v.id,
                metricId: v.metric_id,
                year: v.year,
                month: v.month,
                week: v.week,
                value: v.value !== null ? Number(v.value) : null,
                inputtedBy: v.inputted_by,
                updatedAt: v.updated_at,
                dailyValues: parsedDaily
              };
            });
            setMetricValues(mappedValues);
            saveState("metricValues", mappedValues);
          }
        } catch (e) {
          console.error("Fetch metric_values error:", e);
        }

        // 3. Fetch Todos
        try {
          const { data: dbTodos } = await supabase.from("todos").select("*");
          if (dbTodos && Array.isArray(dbTodos)) {
            const mappedTodos: Todo[] = dbTodos.map(t => {
              let atts: AttachmentInfo[] = [];
              if (t.attachments && Array.isArray(t.attachments)) {
                atts = t.attachments;
              }
              return {
                id: t.id,
                departmentId: t.department_id,
                title: t.title,
                description: t.description || undefined,
                priority: t.priority,
                deadline: t.deadline,
                status: t.status,
                createdBy: t.created_by,
                convertedToMetricId: t.converted_to_metric_id || undefined,
                attachments: atts
              };
            });
            setTodos(mappedTodos);
            saveState("todos", mappedTodos);
          }
        } catch (e) {
          console.error("Fetch todos error:", e);
        }

        // 4. Fetch Issues (Egress Optimized: exclude base64 attachment data from initial load)
        try {
          const { data: dbIssues, error: issuesErr } = await supabase
            .from("issues")
            .select("id, department_id, title, description, priority, status, pic_id, pic_name, created_at, attachment_name, attachment_size, attachment_type");
          if (issuesErr) {
            console.error("Supabase issues query error:", issuesErr);
          }
          if (dbIssues && Array.isArray(dbIssues)) {
            const mappedIssues: Issue[] = dbIssues.map(i => {
              let atts: AttachmentInfo[] = [];
              if (i.attachment_name) {
                atts = [{
                  name: i.attachment_name,
                  size: i.attachment_size || 0,
                  type: i.attachment_type || "",
                  dataUrl: undefined
                }];
              }
              return {
                id: i.id,
                departmentId: i.department_id,
                title: i.title,
                description: i.description || undefined,
                priority: i.priority,
                status: i.status,
                picId: i.pic_id,
                picName: i.pic_name,
                createdAt: i.created_at,
                attachments: atts
              };
            });
            setIssues(mappedIssues);
            saveState("issues", mappedIssues);
          }
        } catch (e) {
          console.error("Fetch issues error:", e);
        }

        // 5. Fetch Headlines (Egress Optimized: exclude base64 attachment data from initial load)
        try {
          const { data: dbHeadlines, error: headlinesErr } = await supabase
            .from("headlines")
            .select("id, department_id, title, content, category, author_id, author_name, created_at, attachment_name, attachment_size, attachment_type");
          if (headlinesErr) {
            console.error("Supabase headlines query error:", headlinesErr);
          }
          if (dbHeadlines && Array.isArray(dbHeadlines)) {
            const mappedHeadlines: Headline[] = dbHeadlines.map(h => {
              let atts: AttachmentInfo[] = [];
              if (h.attachment_name) {
                atts = [{
                  name: h.attachment_name,
                  size: h.attachment_size || 0,
                  type: h.attachment_type || "",
                  dataUrl: undefined
                }];
              }
              return {
                id: h.id,
                departmentId: h.department_id || null,
                title: h.title,
                content: h.content,
                category: h.category,
                authorId: h.author_id,
                authorName: h.author_name,
                createdAt: h.created_at,
                attachments: atts
              };
            });
            setHeadlines(mappedHeadlines);
            saveState("headlines", mappedHeadlines);
          }
        } catch (e) {
          console.error("Fetch headlines error:", e);
        }

        // 6. Fetch Logs (Limit 50 terbaru)
        try {
          const { data: dbLogs } = await supabase.from("history_logs").select("id, profile_id, profile_name, department_id, action, details, created_at").order("created_at", { ascending: false }).limit(50);
          if (dbLogs && Array.isArray(dbLogs)) {
            const mappedLogs: HistoryLog[] = dbLogs.map(l => ({
              id: l.id,
              profileId: l.profile_id,
              profileName: l.profile_name,
              departmentId: l.department_id || null,
              action: l.action,
              details: l.details,
              createdAt: l.created_at
            }));
            setHistoryLogs(mappedLogs);
            saveState("historyLogs", mappedLogs);
          }
        } catch (e) {
          console.error("Fetch logs error:", e);
        }

        // 7. Fetch System Settings (Email Notifications Schedule)
        try {
          const { data: dbSettings } = await supabase.from("system_settings").select("value").eq("key", "email_notif_settings").maybeSingle();
          if (dbSettings && dbSettings.value) {
            setEmailNotifSettings(dbSettings.value);
            saveState("emailNotifSettings", dbSettings.value);
          }
        } catch (e) {
          console.error("Fetch system settings error:", e);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSupabaseData();

      // Enable Supabase Realtime Live Sync with 10-second throttling to prevent Egress bandwidth explosion
      let realtimeTimer: NodeJS.Timeout | null = null;
      let channel: any = null;

      if (ENABLE_DATABASE) {
        channel = supabase
          .channel("realtime-app-sync")
          .on(
            "postgres_changes",
            { event: "*", schema: "public" },
            () => {
              if (realtimeTimer) clearTimeout(realtimeTimer);
              realtimeTimer = setTimeout(() => {
                fetchSupabaseData();
              }, 10000);
            }
          )
          .subscribe();
      }

      return () => {
        if (realtimeTimer) clearTimeout(realtimeTimer);
        document.removeEventListener("invalid", handleInvalid, true);
        if (channel && typeof supabase?.removeChannel === "function") {
          supabase.removeChannel(channel);
        }
      };
    }
  }, []);

  // Auth functions
  const loginProfile = (email: string, password: string): { success: boolean; error?: string } => {
    const cred = credentials[email.toLowerCase()];
    if (!cred) return { success: false, error: "Email tidak ditemukan." };
    if (cred.password !== password) return { success: false, error: "Password salah." };
    const profile = allProfiles.find(p => p.id === cred.profileId);
    if (!profile) return { success: false, error: "Profil tidak ditemukan." };
    setCurrentProfile(profile);
    setIsLoggedIn(true);
    saveState("currentProfile", profile);
    saveState("isLoggedIn", true);
    return { success: true };
  };

  const logoutProfile = () => {
    setIsLoggedIn(false);
    saveState("isLoggedIn", false);
  };

  const resetToDummyData = () => {
    try {
      localStorage.removeItem("metrics");
      localStorage.removeItem("metricValues");
      localStorage.removeItem("todos");
      localStorage.removeItem("issues");
      localStorage.removeItem("headlines");
      localStorage.removeItem("historyLogs");
      localStorage.removeItem("rocks");
      localStorage.removeItem("allProfiles");
      localStorage.removeItem("credentials");
    } catch (e) { }

    setMetrics(INITIAL_METRICS);
    setMetricValues(INITIAL_METRIC_VALUES);
    setTodos(INITIAL_TODOS);
    setIssues(INITIAL_ISSUES);
    setHeadlines(INITIAL_HEADLINES);
    setRocks(INITIAL_ROCKS);
    setHistoryLogs(INITIAL_LOGS);
    setAllProfiles(DEFAULT_PROFILES);
    setCredentials(DEFAULT_CREDENTIALS);
    setCurrentProfile(DEFAULT_PROFILES[1]);
    setIsLoggedIn(true);

    showToast("Semua data berhasil direset ke data dummy bawaan!", "success");
  };

  const addProfile = async (
    profileData: Omit<Profile, "id">,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const emailLower = email.toLowerCase().trim();

    if (credentials[emailLower]) {
      return { success: false, error: "Email ini sudah terdaftar." };
    }

    const userId = `prof-${Date.now()}`;
    const newProfile: Profile = { ...profileData, id: userId };

    if (ENABLE_DATABASE) {
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: newProfile.id,
        name: newProfile.name,
        role: newProfile.role,
        department_id: newProfile.departmentId || null,
        avatar_url: newProfile.avatarUrl || null,
        email: emailLower,
        password: password
      });

      if (dbError) {
        console.error("Supabase profiles table error:", dbError);
        return { success: false, error: `Database Error (${dbError.code}): ${dbError.message}` };
      }
    }

    const newProfiles = [...allProfiles.filter(p => p.id !== newProfile.id), newProfile];
    const newCredentials = { ...credentials, [emailLower]: { password, profileId: newProfile.id } };
    setAllProfiles(newProfiles);
    setCredentials(newCredentials);
    setCurrentProfile(newProfile);
    setIsLoggedIn(true);
    saveState("allProfiles", newProfiles);
    saveState("credentials", newCredentials);
    saveState("currentProfile", newProfile);
    saveState("isLoggedIn", true);

    return { success: true };
  };

  const updateProfileAndSave = (profile: Profile, newEmail?: string, newPassword?: string) => {
    setCurrentProfile(profile);
    saveState("currentProfile", profile);

    setAllProfiles(prev => {
      const updated = prev.map(p => p.id === profile.id ? profile : p);
      saveState("allProfiles", updated);
      return updated;
    });

    let targetEmail = newEmail;
    let targetPass = newPassword;

    setCredentials(prev => {
      let updatedCreds = { ...prev };
      const oldEmailKey = Object.keys(prev).find(key => prev[key].profileId === profile.id);
      if (oldEmailKey) {
        const currentPass = prev[oldEmailKey].password;
        targetPass = newPassword && newPassword.trim().length > 0 ? newPassword : currentPass;
        targetEmail = newEmail && newEmail.trim().length > 0 ? newEmail.toLowerCase().trim() : oldEmailKey;

        if (targetEmail !== oldEmailKey) {
          delete updatedCreds[oldEmailKey];
        }
        updatedCreds[targetEmail] = {
          password: targetPass,
          profileId: profile.id
        };
      }
      saveState("credentials", updatedCreds);
      return updatedCreds;
    });

    const updatePayload: Record<string, any> = {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      department_id: profile.departmentId,
      avatar_url: profile.avatarUrl || null,
    };
    if (targetEmail) updatePayload.email = targetEmail;
    if (targetPass && targetPass.trim().length > 0) updatePayload.password = targetPass;

    if (ENABLE_DATABASE) {
      supabase.from("profiles").upsert(updatePayload).then(({ error }) => { if (error) console.error("Supabase profile sync error:", error); });
    }
  };

  const updateLanguage = (lang: "id" | "en") => {
    setLanguage(lang);
    saveState("language", lang);
  };

  const updateTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    saveState("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const getMetricActiveWeek = (metric: Metric): number => {
    if (!metric.isActive) return 5;

    const createdDate = new Date(metric.createdAt);
    const currentDate = new Date();

    const diffMs = currentDate.getTime() - createdDate.getTime();
    if (diffMs < 0) return 1;

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const activeWeek = Math.floor(diffDays / 7) + 1;

    return Math.min(Math.max(activeWeek, 1), 5);
  };

  const getWeekString = (date: Date): number => {
    const day = date.getDate();
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    return 4;
  };

  const addHistoryLog = (action: string, details: string, deptId: string | null = null) => {
    const now = new Date();
    const newLog: HistoryLog = {
      id: `log-${Date.now()}`,
      profileId: currentProfile.id,
      profileName: currentProfile.name,
      departmentId: deptId || currentProfile.departmentId,
      action,
      details,
      createdAt: now.toISOString()
    };

    setHistoryLogs(prev => {
      const updated = [newLog, ...prev];
      saveState("historyLogs", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("history_logs").insert({
        id: newLog.id,
        profile_id: newLog.profileId,
        profile_name: newLog.profileName,
        department_id: newLog.departmentId || null,
        action: newLog.action,
        details: newLog.details,
        created_at: newLog.createdAt
      }).then(({ error }) => { if (error) console.error("Supabase log error:", error); });
    }
  };

  const archiveOldLogsNow = async (): Promise<void> => {
    // Placeholder for archiving logic
  };

  const sendEmailNotification = async (payload: {
    categoryKey?: "issues" | "headlines" | "todos" | "test";
    to?: string | string[];
    subject: string;
    title: string;
    category: string;
    departmentName?: string;
    authorName?: string;
    details?: string;
    actionUrl?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!emailNotifSettings.enabled) {
      console.log("Email notification skipped: Global email notifications disabled.");
      return { success: false, error: "Notifikasi email global sedang NONAKTIF (OFF)." };
    }

    // If timingMode is "scheduled", suppress real-time instant emails for todos/headlines/issues to prevent spam
    if (emailNotifSettings.timingMode === "scheduled" && payload.categoryKey !== "test") {
      console.log("Instant email skipped: Scheduled daily summary mode is active.");
      return { success: false, error: "Email instan dilewati karena modus Rangkuman Harian per hari (scheduled) sedang aktif." };
    }

    if (payload.categoryKey === "issues" && !emailNotifSettings.notifyIssues) return { success: false, error: "Notifikasi Kategori Issue sedang nonaktif." };
    if (payload.categoryKey === "headlines" && !emailNotifSettings.notifyHeadlines) return { success: false, error: "Notifikasi Kategori Headline sedang nonaktif." };
    if (payload.categoryKey === "todos" && !emailNotifSettings.notifyTodos) return { success: false, error: "Notifikasi Kategori Todo sedang nonaktif." };

    const rawTarget = emailNotifSettings.targetEmail || payload.to || "databasegerilya@gmail.com";
    let recipient: string | string[] = rawTarget;
    if (typeof rawTarget === "string" && rawTarget.includes(",")) {
      recipient = rawTarget.split(",").map(e => e.trim()).filter(Boolean);
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          to: recipient
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.warn("Failed to send email notification:", data.error);
        return { success: false, error: data.error || "Gagal mengirim email." };
      } else {
        console.log("Email notification sent successfully:", data.data);
        return { success: true };
      }
    } catch (e: any) {
      console.error("Error sending email notification:", e);
      return { success: false, error: e.message || "Kesalahan jaringan." };
    }
  };

  const addMetric = async (metricData: Omit<Metric, "id" | "createdAt" | "isActive">) => {
    const newMetric: Metric = {
      ...metricData,
      id: `met-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const success = await insertMetricToDb(newMetric);
    if (!success) {
      showToast(`⚠️ Gagal menyimpan Metrik "${newMetric.name}" ke database server! Mohon periksa koneksi.`, "error");
      return;
    }

    setMetrics(prev => {
      const updated = [newMetric, ...prev];
      saveState("metrics", updated);
      return updated;
    });

    addHistoryLog("Create Metric", `Membuat metrik baru "${newMetric.name}"`, newMetric.departmentId);
    showToast(`Metrik "${newMetric.name}" berhasil disimpan ke database!`, "success");
  };

  const updateMetricValue = (metricId: string, week: number, value: number | null) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return;

    setMetricValues(prev => {
      const existingIdx = prev.findIndex(
        v => v.metricId === metricId && v.year === currentYear && v.month === currentMonth && v.week === week
      );

      let updated = [...prev];
      if (existingIdx > -1) {
        updated[existingIdx] = {
          ...updated[existingIdx],
          value,
          inputtedBy: currentProfile.id,
          updatedAt: new Date().toISOString()
        };
      } else {
        updated.push({
          id: `val-${Date.now()}`,
          metricId,
          year: currentYear,
          month: currentMonth,
          week,
          value,
          inputtedBy: currentProfile.id,
          updatedAt: new Date().toISOString()
        });
      }

      saveState("metricValues", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("metric_values").upsert({
        id: `val-${metricId}-${week}`,
        metric_id: metricId,
        year: currentYear,
        month: currentMonth,
        week: week,
        value: value,
        inputted_by: currentProfile.id
      }).then(({ error }) => { if (error) console.error("Supabase metric value error:", error); });
    }

    addHistoryLog("Fill Metric", `Mengisi metric "${metric.name}" (W${week})`, metric.departmentId);
  };

  const updateMetricDailyValues = (metricId: string, week: number, newDaily: (number | null)[]) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return;

    setMetricValues(prev => {
      const existingIdx = prev.findIndex(v => {
        if (metric.cycleType === "special") {
          return v.metricId === metricId;
        }
        return v.metricId === metricId && v.year === currentYear && v.month === currentMonth && v.week === week;
      });

      let updated = [...prev];
      let currentValObj: MetricValue;

      if (existingIdx > -1) {
        currentValObj = { ...updated[existingIdx] };
      } else {
        const daysCount = metric.cycleType === "special" ? (metric.durationDays || 7) : 7;
        currentValObj = {
          id: `val-${metricId}-${currentYear}-${currentMonth}-${week}`,
          metricId,
          year: currentYear,
          month: currentMonth,
          week,
          value: null,
          inputtedBy: currentProfile.id,
          updatedAt: new Date().toISOString(),
          dailyValues: Array(daysCount).fill(null)
        };
      }

      // Safe Array Merge: Preserve existing indices if not updated
      const mergedDaily = currentValObj.dailyValues ? [...currentValObj.dailyValues] : [];
      while (mergedDaily.length < newDaily.length) {
        mergedDaily.push(null);
      }
      for (let i = 0; i < newDaily.length; i++) {
        mergedDaily[i] = newDaily[i];
      }

      // Recalculate weeklyVal using merged array
      const nonNullDaily = mergedDaily.filter(v => v !== null && v !== undefined && !isNaN(Number(v))).map(v => Number(v));
      let weeklyVal: number | null = null;
      if (nonNullDaily.length > 0) {
        const mode = metric.accumulationMode || (metric.unit === "percentage" ? "average" : "sum");
        if (mode === "average") {
          const sum = nonNullDaily.reduce((acc, curr) => acc + curr, 0);
          weeklyVal = Math.round((sum / nonNullDaily.length) * 10) / 10;
        } else {
          weeklyVal = nonNullDaily.reduce((acc, curr) => acc + curr, 0);
        }
      }

      currentValObj.dailyValues = mergedDaily;
      currentValObj.value = weeklyVal;
      currentValObj.inputtedBy = currentProfile.id;
      currentValObj.updatedAt = new Date().toISOString();

      if (existingIdx > -1) {
        updated[existingIdx] = currentValObj;
      } else {
        updated.push(currentValObj);
      }

      saveState("metricValues", updated);

      // Debounce Supabase upserts (500ms) with mergedDaily
      const debounceKey = `metric-${metricId}-${week}`;
      if (typeof window !== "undefined") {
        const win = window as any;
        if (!win._metricDebounceTimers) win._metricDebounceTimers = {};
        if (win._metricDebounceTimers[debounceKey]) {
          clearTimeout(win._metricDebounceTimers[debounceKey]);
        }
        win._metricDebounceTimers[debounceKey] = setTimeout(() => {
          saveMetricValueToDb({
            id: currentValObj.id,
            metricId,
            year: currentValObj.year,
            month: currentValObj.month,
            week: currentValObj.week,
            value: weeklyVal,
            inputtedBy: currentProfile.id,
            updatedAt: new Date().toISOString(),
            dailyValues: mergedDaily
          }).then((success) => {
            if (!success) {
              showToast(`⚠️ Sinyal terputus. Gagal menyimpan data mingguan W${week} ke server!`, "error");
            }
          });
        }, 500);
      }

      return updated;
    });

    addHistoryLog("Fill Daily Metrics", `Mengisi tabel mingguan W${week} untuk "${metric.name}"`, metric.departmentId);
  };

  const completeMetric = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return;

    setMetrics(prev => {
      const updated = prev.map(m => m.id === metricId ? { ...m, isActive: false } : m);
      saveState("metrics", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("metrics").update({ is_active: false }).eq("id", metricId)
        .then(({ error }) => { if (error) console.error("Supabase completeMetric error:", error); });
    }

    addHistoryLog("Complete Metric", `PIC/Owner menyelesaikan metrik "${metric.name}" secara manual`, metric.departmentId);
    showToast(`Metrik "${metric.name}" telah ditandai selesai!`, "info");
  };

  const reactivateMetric = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return;

    let newDeadline = metric.deadline;
    if (metric.cycleType === "special") {
      const duration = metric.durationDays || 3;
      const today = new Date();
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + (duration - 1));
      newDeadline = targetDate.toISOString().split("T")[0];
    }

    setMetrics(prev => {
      const updated = prev.map(m => m.id === metricId ? {
        ...m,
        isActive: true,
        deadline: newDeadline
      } : m);
      saveState("metrics", updated);
      return updated;
    });

    const updatePayload: any = { is_active: true };
    if (newDeadline) updatePayload.deadline = newDeadline;

    if (ENABLE_DATABASE) {
      supabase.from("metrics").update(updatePayload).eq("id", metricId)
        .then(({ error }) => { if (error) console.error("Supabase reactivateMetric error:", error); });
    }

    addHistoryLog("Reactivate Metric", `Mengaktifkan kembali metrik "${metric.name}"`, metric.departmentId);
    showToast(`Metrik "${metric.name}" berhasil diaktifkan kembali!`, "info");
  };

  const editMetric = async (metricId: string, updatedData: Partial<Metric>) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return;

    setMetrics(prev => {
      const updated = prev.map(m => m.id === metricId ? { ...m, ...updatedData } : m);
      saveState("metrics", updated);
      return updated;
    });

    // Re-sync metricValues state and Supabase DB if duration, cycleType, or accumulationMode changed
    setMetricValues(prev => {
      const isSpecial = (updatedData.cycleType || metric.cycleType) === "special";
      const targetWeek = isSpecial ? 1 : currentWeek;
      const idx = prev.findIndex(v => {
        if (isSpecial) return v.metricId === metricId;
        return v.metricId === metricId && v.year === currentYear && v.month === currentMonth && v.week === targetWeek;
      });

      const updatedVals = [...prev];
      let valObj: MetricValue;
      const newDuration = isSpecial ? (updatedData.durationDays || metric.durationDays || 7) : 7;

      if (idx > -1) {
        valObj = { ...updatedVals[idx] };
      } else {
        valObj = {
          id: `val-${metricId}-${currentYear}-${currentMonth}-${targetWeek}`,
          metricId,
          year: currentYear,
          month: currentMonth,
          week: targetWeek,
          value: null,
          inputtedBy: currentProfile.id,
          updatedAt: new Date().toISOString(),
          dailyValues: Array(newDuration).fill(null)
        };
      }

      let daily = valObj.dailyValues ? [...valObj.dailyValues] : [];
      while (daily.length < newDuration) {
        daily.push(null);
      }

      const effectiveUnit = updatedData.unit || metric.unit;
      const effectiveMode = updatedData.accumulationMode || metric.accumulationMode || (effectiveUnit === "percentage" ? "average" : "sum");
      const nonNull = daily.filter(v => v !== null && v !== undefined && !isNaN(Number(v))).map(v => Number(v));
      let weeklyVal: number | null = null;
      if (nonNull.length > 0) {
        if (effectiveMode === "average") {
          const sum = nonNull.reduce((acc, curr) => acc + curr, 0);
          weeklyVal = Math.round((sum / nonNull.length) * 10) / 10;
        } else {
          weeklyVal = nonNull.reduce((acc, curr) => acc + curr, 0);
        }
      }

      valObj.dailyValues = daily;
      valObj.value = weeklyVal;
      valObj.updatedAt = new Date().toISOString();

      if (idx > -1) {
        updatedVals[idx] = valObj;
      } else {
        updatedVals.push(valObj);
      }

      saveState("metricValues", updatedVals);

      // Async DB Sync
      saveMetricValueToDb(valObj);

      return updatedVals;
    });

    const updatePayload: any = {};
    if (updatedData.name !== undefined) updatePayload.name = updatedData.name;
    if (updatedData.target !== undefined) updatePayload.target = updatedData.target;
    if (updatedData.unit !== undefined) updatePayload.unit = updatedData.unit;
    if (updatedData.targetType !== undefined) updatePayload.target_type = updatedData.targetType;
    if (updatedData.picId !== undefined) updatePayload.pic_id = updatedData.picId;
    if (updatedData.picName !== undefined) updatePayload.pic_name = updatedData.picName;
    if (updatedData.keterangan !== undefined) updatePayload.keterangan = updatedData.keterangan;
    if (updatedData.departmentId !== undefined) updatePayload.department_id = updatedData.departmentId;
    if (updatedData.cycleType !== undefined) updatePayload.cycle_type = updatedData.cycleType;
    if (updatedData.durationDays !== undefined) updatePayload.duration_days = updatedData.durationDays;
    if (updatedData.deadline !== undefined) updatePayload.deadline = updatedData.deadline;
    if (updatedData.accumulationMode !== undefined) updatePayload.accumulation_mode = updatedData.accumulationMode;

    if (!ENABLE_DATABASE) {
      showToast(`Metrik "${updatedData.name || metric.name}" berhasil diperbarui!`, "success");
      addHistoryLog("Edit Metric", `Mengubah konfigurasi metrik "${updatedData.name || metric.name}"`, updatedData.departmentId || metric.departmentId);
      return;
    }

    try {
      const { error } = await supabase.from("metrics").update(updatePayload).eq("id", metricId);
      if (error) {
        console.error("Supabase editMetric initial error:", error);
        
        // Smart Column-Specific Auto-Retry:
        const sanitizedPayload = { ...updatePayload };
        let hasSanitized = false;
        if (error.message.includes("accumulation_mode")) { delete sanitizedPayload.accumulation_mode; hasSanitized = true; }
        if (error.message.includes("duration_days")) { delete sanitizedPayload.duration_days; hasSanitized = true; }
        if (error.message.includes("deadline")) { delete sanitizedPayload.deadline; hasSanitized = true; }
        if (error.message.includes("cycle_type")) { delete sanitizedPayload.cycle_type; hasSanitized = true; }

        if (hasSanitized) {
          const { error: retryErr } = await supabase.from("metrics").update(sanitizedPayload).eq("id", metricId);
          if (retryErr) {
            console.error("Supabase editMetric retry error:", retryErr);
            showToast(`⚠️ Gagal memperbarui database: ${retryErr.message}`, "error");
          } else {
            showToast(`Metrik "${updatedData.name || metric.name}" berhasil diperbarui!`, "success");
          }
        } else {
          showToast(`⚠️ Gagal memperbarui database: ${error.message}`, "error");
        }
      } else {
        showToast(`Metrik "${updatedData.name || metric.name}" berhasil diperbarui!`, "success");
      }
    } catch (err: any) {
      console.error("editMetric exception:", err);
      showToast(`⚠️ Kendala jaringan saat menyimpan: ${err.message || err}`, "error");
    }

    addHistoryLog("Edit Metric", `Mengubah metrik "${updatedData.name || metric.name}"`, updatedData.departmentId || metric.departmentId);
  };

  const deleteMetric = (metricId: string) => {
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return;

    setMetrics(prev => {
      const updated = prev.filter(m => m.id !== metricId);
      saveState("metrics", updated);
      return updated;
    });

    setMetricValues(prev => {
      const updated = prev.filter(mv => mv.metricId !== metricId);
      saveState("metricValues", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("metrics").delete().eq("id", metricId)
        .then(({ error }) => { if (error) console.error("Supabase deleteMetric error:", error); });

      supabase.from("metric_values").delete().eq("metric_id", metricId)
        .then(({ error }) => { if (error) console.error("Supabase deleteMetricValues error:", error); });
    }

    addHistoryLog("Delete Metric", `Menghapus metrik "${metric.name}"`, metric.departmentId);
    showToast(`Metrik "${metric.name}" berhasil dihapus!`, "info");
  };



  const addTodo = async (todoData: Omit<Todo, "id" | "createdBy"> & { createdBy?: string }) => {
    const newTodo: Todo = {
      ...todoData,
      id: `td-${Date.now()}`,
      createdBy: todoData.createdBy || currentProfile.name
    };

    const success = await insertTodoToDb(newTodo);
    if (!success) {
      showToast(`⚠️ Gagal menyimpan Agenda "${newTodo.title}" ke database server!`, "error");
      return;
    }

    setTodos(prev => {
      const updated = [...prev, newTodo];
      saveState("todos", updated);
      return updated;
    });

    addHistoryLog("Create Todo", `Membuat todo baru "${newTodo.title}"`, newTodo.departmentId);
    showToast(`Agenda "${newTodo.title}" berhasil disimpan!`, "success");

    const deptObj = DEPARTMENTS.find(d => d.id === newTodo.departmentId);
    sendEmailNotification({
      categoryKey: "todos",
      subject: `📋 [Todo Baru] ${newTodo.title}`,
      title: newTodo.title,
      category: `TODO LIST (${newTodo.priority.toUpperCase()})`,
      departmentName: deptObj?.name || "Global",
      authorName: currentProfile.name,
      details: `${newTodo.description || "Tugas baru ditambahkan"}\nDeadline: ${newTodo.deadline}`,
      actionUrl: typeof window !== "undefined" ? `${window.location.origin}/todos` : undefined
    });
  };

  const updateTodoStatus = (id: string, status: Todo["status"]) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setTodos(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, status } : t);
      saveState("todos", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("todos").update({ status }).eq("id", id)
        .then(({ error }) => { if (error) console.error("Supabase updateTodoStatus error:", error); });
    }

    addHistoryLog("Update Todo", `Mengubah status todo "${todo.title}" menjadi ${status}`, todo.departmentId);
  };

  const editTodo = (todoId: string, updatedData: Partial<Todo>) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    setTodos(prev => {
      const updated = prev.map(t => t.id === todoId ? { ...t, ...updatedData } : t);
      saveState("todos", updated);
      return updated;
    });

    const updatePayload: any = {};
    if (updatedData.title !== undefined) updatePayload.title = updatedData.title;
    if (updatedData.description !== undefined) updatePayload.description = updatedData.description;
    if (updatedData.priority !== undefined) updatePayload.priority = updatedData.priority;
    if (updatedData.status !== undefined) updatePayload.status = updatedData.status;
    if (updatedData.departmentId !== undefined) updatePayload.department_id = updatedData.departmentId;
    if (updatedData.attachments !== undefined) updatePayload.attachments = updatedData.attachments;

    if (ENABLE_DATABASE) {
      supabase.from("todos").update(updatePayload).eq("id", todoId)
        .then(({ error }) => { if (error) console.error("Supabase editTodo error:", error); });
    }

    addHistoryLog("Edit Todo", `Mengubah agenda todo "${updatedData.title || todo.title}"`, updatedData.departmentId || todo.departmentId);
    showToast(`Todo "${updatedData.title || todo.title}" berhasil diperbarui!`, "success");
  };

  const deleteTodo = (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    setTodos(prev => {
      const updated = prev.filter(t => t.id !== todoId);
      saveState("todos", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("todos").delete().eq("id", todoId)
        .then(({ error }) => { if (error) console.error("Supabase deleteTodo error:", error); });
    }

    addHistoryLog("Delete Todo", `Menghapus todo "${todo.title}"`, todo.departmentId);
    showToast(`Todo "${todo.title}" berhasil dihapus!`, "info");
  };

  const convertTodoToMetric = (todoId: string, metricData: Omit<Metric, "id" | "createdAt" | "isActive">) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const newMetricId = `met-${Date.now()}`;
    const newMetric: Metric = {
      ...metricData,
      id: newMetricId,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setMetrics(prev => {
      const updated = [...prev, newMetric];
      saveState("metrics", updated);
      return updated;
    });

    setTodos(prev => {
      const updated = prev.map(t => t.id === todoId ? { ...t, status: "completed" as const, convertedToMetricId: newMetricId } : t);
      saveState("todos", updated);
      return updated;
    });

    const convertPayload: any = {
      id: newMetric.id,
      department_id: newMetric.departmentId,
      name: newMetric.name,
      target: newMetric.target,
      unit: newMetric.unit,
      target_type: newMetric.targetType,
      pic_id: newMetric.picId,
      pic_name: newMetric.picName,
      keterangan: newMetric.keterangan || null,
      is_active: true,
      cycle_type: newMetric.cycleType || "monthly",
      duration_days: newMetric.durationDays || 7,
      deadline: newMetric.deadline || null,
      accumulation_mode: newMetric.accumulationMode || (newMetric.unit === "percentage" ? "average" : "sum")
    };

    if (ENABLE_DATABASE) {
      supabase.from("metrics").insert(convertPayload).then(async ({ error }) => {
        if (error && (error.message.includes("accumulation_mode") || error.code === "PGRST204")) {
          delete convertPayload.accumulation_mode;
          await supabase.from("metrics").insert(convertPayload);
        }
      });

      supabase.from("todos").update({ status: "completed", converted_to_metric_id: newMetricId }).eq("id", todoId)
        .then(({ error }) => { if (error) console.error("Supabase convert todo error:", error); });
    }

    addHistoryLog("Convert Todo", `Mengubah Todo "${todo.title}" menjadi Metrik "${newMetric.name}"`, todo.departmentId);
  };

  const addIssue = async (issueData: Omit<Issue, "id" | "createdAt" | "picId" | "picName"> & { picId?: string; picName?: string }) => {
    const now = new Date();
    const isoDate = now.toISOString();

    const newIssue: Issue = {
      ...issueData,
      id: `iss-${Date.now()}`,
      picId: issueData.picId || currentProfile.id,
      picName: issueData.picName || currentProfile.name,
      createdAt: isoDate
    };

    const success = await insertIssueToDb(newIssue);
    if (!success) {
      showToast(`⚠️ Gagal melaporkan Kendala "${newIssue.title}" ke database server!`, "error");
      return;
    }

    setIssues(prev => {
      const updated = [newIssue, ...prev];
      saveState("issues", updated);
      return updated;
    });

    addHistoryLog("Create Issue", `Melaporkan issue baru "${newIssue.title}"`, newIssue.departmentId);
    showToast(`Kendala "${newIssue.title}" berhasil dilaporkan!`, "success");

    const deptObj = DEPARTMENTS.find(d => d.id === newIssue.departmentId);
    sendEmailNotification({
      categoryKey: "issues",
      subject: `🚨 [Kendala Baru] ${newIssue.title}`,
      title: newIssue.title,
      category: `ISSUE (${newIssue.priority.toUpperCase()})`,
      departmentName: deptObj?.name || "Global",
      authorName: currentProfile.name,
      details: newIssue.description || "Kendala baru dilaporkan",
      actionUrl: typeof window !== "undefined" ? `${window.location.origin}/issues` : undefined
    });
  };

  const updateIssueStatus = (id: string, status: Issue["status"]) => {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;

    setIssues(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, status } : i);
      saveState("issues", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("issues").update({ status }).eq("id", id)
        .then(({ error }) => { if (error) console.error("Supabase updateIssueStatus error:", error); });
    }

    addHistoryLog("Update Issue", `Mengubah status issue "${issue.title}" menjadi ${status}`, issue.departmentId);
  };

  const updateIssuePriority = (id: string, priority: Issue["priority"]) => {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;

    setIssues(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, priority } : i);
      saveState("issues", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("issues").update({ priority }).eq("id", id)
        .then(({ error }) => { if (error) console.error("Supabase updateIssuePriority error:", error); });
    }

    addHistoryLog("Update Issue", `Mengubah prioritas issue "${issue.title}" menjadi ${priority}`, issue.departmentId);
  };

  const editIssue = (issueId: string, updatedData: Partial<Issue>) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    setIssues(prev => {
      const updated = prev.map(i => i.id === issueId ? { ...i, ...updatedData } : i);
      saveState("issues", updated);
      return updated;
    });

    const updatePayload: any = {};
    if (updatedData.title !== undefined) updatePayload.title = updatedData.title;
    if (updatedData.description !== undefined) updatePayload.description = updatedData.description;
    if (updatedData.priority !== undefined) updatePayload.priority = updatedData.priority;
    if (updatedData.status !== undefined) updatePayload.status = updatedData.status;
    if (updatedData.departmentId !== undefined) updatePayload.department_id = updatedData.departmentId;
    if (updatedData.picName !== undefined) updatePayload.pic_name = updatedData.picName;
    if (updatedData.attachments !== undefined) updatePayload.attachments = updatedData.attachments;

    if (ENABLE_DATABASE) {
      supabase.from("issues").update(updatePayload).eq("id", issueId)
        .then(({ error }) => { if (error) console.error("Supabase editIssue error:", error); });
    }

    addHistoryLog("Edit Issue", `Mengubah masalah issue "${updatedData.title || issue.title}"`, updatedData.departmentId || issue.departmentId);
    showToast(`Issue "${updatedData.title || issue.title}" berhasil diperbarui!`, "success");
  };

  const deleteIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    setIssues(prev => {
      const updated = prev.filter(i => i.id !== issueId);
      saveState("issues", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("issues").delete().eq("id", issueId)
        .then(({ error }) => { if (error) console.error("Supabase deleteIssue error:", error); });
    }

    addHistoryLog("Delete Issue", `Menghapus issue "${issue.title}"`, issue.departmentId);
    showToast(`Issue "${issue.title}" berhasil dihapus!`, "info");
  };

  const addHeadline = async (headlineData: Omit<Headline, "id" | "createdAt" | "authorId" | "authorName"> & { authorId?: string; authorName?: string }) => {
    const now = new Date();
    const isoDate = now.toISOString();

    const newHeadline: Headline = {
      ...headlineData,
      id: `hl-${Date.now()}`,
      authorId: headlineData.authorId || currentProfile.id,
      authorName: headlineData.authorName || currentProfile.name,
      createdAt: isoDate
    };

    const success = await insertHeadlineToDb(newHeadline);
    if (!success) {
      showToast(`⚠️ Gagal menyimpan Pengumuman "${newHeadline.title}" ke database server!`, "error");
      return;
    }

    setHeadlines(prev => {
      const updated = [newHeadline, ...prev];
      saveState("headlines", updated);
      return updated;
    });

    addHistoryLog("Create Headline", `Membuat headline baru "${newHeadline.title}"`, newHeadline.departmentId);
    showToast(`Pengumuman "${newHeadline.title}" berhasil diterbitkan!`, "success");

    const deptObj = DEPARTMENTS.find(d => d.id === newHeadline.departmentId);
    sendEmailNotification({
      categoryKey: "headlines",
      subject: `📢 [Headline Baru] ${newHeadline.title}`,
      title: newHeadline.title,
      category: `HEADLINE (${newHeadline.category.toUpperCase()})`,
      departmentName: deptObj?.name || "Global",
      authorName: newHeadline.authorName,
      details: newHeadline.content,
      actionUrl: typeof window !== "undefined" ? `${window.location.origin}/headlines` : undefined
    });
  };

  const editHeadline = (headlineId: string, updatedData: Partial<Headline>) => {
    const headline = headlines.find(h => h.id === headlineId);
    if (!headline) return;

    setHeadlines(prev => {
      const updated = prev.map(h => h.id === headlineId ? { ...h, ...updatedData } : h);
      saveState("headlines", updated);
      return updated;
    });

    const updatePayload: any = {};
    if (updatedData.title !== undefined) updatePayload.title = updatedData.title;
    if (updatedData.content !== undefined) updatePayload.content = updatedData.content;
    if (updatedData.category !== undefined) updatePayload.category = updatedData.category;
    if (updatedData.departmentId !== undefined) updatePayload.department_id = updatedData.departmentId;
    if (updatedData.attachments !== undefined) updatePayload.attachments = updatedData.attachments;

    if (ENABLE_DATABASE) {
      supabase.from("headlines").update(updatePayload).eq("id", headlineId)
        .then(({ error }) => { if (error) console.error("Supabase editHeadline error:", error); });
    }

    addHistoryLog("Edit Headline", `Mengubah berita headline "${updatedData.title || headline.title}"`, updatedData.departmentId || headline.departmentId);
    showToast(`Headline "${updatedData.title || headline.title}" berhasil diperbarui!`, "success");
  };

  const deleteHeadline = (headlineId: string) => {
    const headline = headlines.find(h => h.id === headlineId);
    if (!headline) return;

    setHeadlines(prev => {
      const updated = prev.filter(h => h.id !== headlineId);
      saveState("headlines", updated);
      return updated;
    });

    if (ENABLE_DATABASE) {
      supabase.from("headlines").delete().eq("id", headlineId)
        .then(({ error }) => { if (error) console.error("Supabase deleteHeadline error:", error); });
    }

    addHistoryLog("Delete Headline", `Menghapus headline "${headline.title}"`, headline.departmentId);
    showToast(`Headline "${headline.title}" berhasil dihapus!`, "info");
  };

  // Rocks CRUD
  const addRock = (newRockData: Omit<Rock, "id" | "createdAt">) => {
    const id = `rock-${Date.now()}`;
    const newRock: Rock = {
      ...newRockData,
      id,
      createdAt: new Date().toISOString()
    };
    setRocks(prev => {
      const updated = [newRock, ...prev];
      saveState("rocks", updated);
      return updated;
    });
    insertRockToDb(newRock).catch(err => console.error("Error inserting rock to DB:", err));
    addHistoryLog("Tambah Rock", `Menambahkan target kuartal Rock "${newRock.title}"`, newRock.departmentId);
    showToast(`Rock "${newRock.title}" berhasil ditambahkan!`, "success");
  };

  const editRock = (rockId: string, updatedData: Partial<Rock>) => {
    const rock = rocks.find(r => r.id === rockId);
    if (!rock) return;

    setRocks(prev => {
      const updated = prev.map(r => r.id === rockId ? { ...r, ...updatedData } : r);
      saveState("rocks", updated);
      return updated;
    });

    const merged = { ...rock, ...updatedData };
    updateRockInDb(merged).catch(err => console.error("Error updating rock in DB:", err));

    addHistoryLog("Edit Rock", `Memperbarui data Rock "${updatedData.title || rock.title}"`, rock.departmentId);
    showToast(`Rock "${updatedData.title || rock.title}" berhasil diperbarui!`, "success");
  };

  const deleteRock = (rockId: string) => {
    const rock = rocks.find(r => r.id === rockId);
    if (!rock) return;

    setRocks(prev => {
      const updated = prev.filter(r => r.id !== rockId);
      saveState("rocks", updated);
      return updated;
    });

    // Also unassign sub-metrics
    setMetrics(prev => {
      const updated = prev.map(m => m.rockId === rockId ? { ...m, rockId: null } : m);
      saveState("metrics", updated);
      return updated;
    });

    deleteRockFromDb(rockId).catch(err => console.error("Error deleting rock from DB:", err));

    addHistoryLog("Hapus Rock", `Menghapus Rock "${rock.title}"`, rock.departmentId);
    showToast(`Rock "${rock.title}" berhasil dihapus!`, "info");
  };

  const toggleRockStatus = (rockId: string, status: Rock["status"]) => {
    editRock(rockId, { status });
  };

  const getRockProgress = (rockId: string) => {
    const subMetrics = metrics.filter(m => m.rockId === rockId && m.isActive);
    if (subMetrics.length === 0) {
      const rock = rocks.find(r => r.id === rockId);
      return {
        progress: rock?.status === "completed" ? 100 : (rock?.status === "on_track" ? 60 : 25),
        totalMetrics: 0,
        onTrackMetrics: 0
      };
    }
    let totalPct = 0;
    let onTrackCount = 0;
    subMetrics.forEach(m => {
      const vals = metricValues.filter(v => v.metricId === m.id);
      const latestVal = vals.length > 0 ? vals[vals.length - 1].value : null;
      if (latestVal !== null && latestVal !== undefined) {
        let pct = 0;
        if (m.targetType === "higher_better") {
          pct = Math.min(100, Math.round((latestVal / m.target) * 100));
        } else {
          pct = latestVal <= m.target ? 100 : Math.max(0, Math.round((m.target / latestVal) * 100));
        }
        totalPct += pct;
        if (pct >= 90) onTrackCount++;
      }
    });
    const avgProgress = Math.round(totalPct / subMetrics.length);
    return {
      progress: avgProgress,
      totalMetrics: subMetrics.length,
      onTrackMetrics: onTrackCount
    };
  };

  // RLS Simulated Filter
  const getFilteredData = () => {
    const deptId = currentProfile.departmentId;
    const roleLower = (currentProfile.role || "").toLowerCase();
    const isUserOwnerOrDev =
      roleLower === "owner" ||
      roleLower === "developer" ||
      !deptId;

    if (isUserOwnerOrDev) {
      return {
        metrics,
        todos,
        issues,
        headlines,
        historyLogs,
        rocks
      };
    }

    return {
      metrics: metrics.filter(m => m.departmentId === deptId),
      todos: todos.filter(t => t.departmentId === deptId),
      issues: issues.filter(i => i.departmentId === deptId),
      headlines: headlines.filter(h => h.departmentId === deptId || h.departmentId === null),
      historyLogs: historyLogs.filter(l => l.departmentId === deptId),
      rocks: rocks.filter(r => r.departmentId === deptId)
    };
  };

  // Health Score Calculations
  const getHealthScore = (deptId: string | null) => {
    const isOwnerOrDev = currentProfile.role === "owner" || currentProfile.role === "developer";
    const targetDept = deptId || currentProfile.departmentId;

    const deptMetrics = (isOwnerOrDev && !deptId) ? metrics.filter(m => m.isActive) : metrics.filter(m => m.departmentId === targetDept && m.isActive);
    const deptTodos = (isOwnerOrDev && !deptId) ? todos : todos.filter(t => t.departmentId === targetDept);
    const deptIssues = (isOwnerOrDev && !deptId) ? issues : issues.filter(i => i.departmentId === targetDept);

    if (deptMetrics.length === 0) {
      return { score: 100, rating: "Excellent" as const, colorClass: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20", completionScore: 100, achievementScore: 100, issueClosedScore: 100 };
    }

    let expectedInputs = 0;
    let actualInputs = 0;

    deptMetrics.forEach(m => {
      const activeW = getMetricActiveWeek(m);
      for (let w = 1; w <= Math.min(activeW, 4); w++) {
        expectedInputs++;
        const val = metricValues.find(
          v => v.metricId === m.id && v.year === currentYear && v.month === currentMonth && v.week === w
        );
        if (val && val.value !== null) {
          actualInputs++;
        }
      }
    });

    const completionScore = expectedInputs > 0 ? (actualInputs / expectedInputs) * 100 : 100;

    let achievedCount = 0;
    let filledCount = 0;

    deptMetrics.forEach(m => {
      const activeW = getMetricActiveWeek(m);
      for (let w = 1; w <= Math.min(activeW, 4); w++) {
        const val = metricValues.find(
          v => v.metricId === m.id && v.year === currentYear && v.month === currentMonth && v.week === w
        );
        if (val && val.value !== null) {
          filledCount++;
          if (m.targetType === "higher_better") {
            if (val.value >= m.target) achievedCount++;
          } else {
            if (val.value <= m.target) achievedCount++;
          }
        }
      }
    });

    const achievementScore = filledCount > 0 ? (achievedCount / filledCount) * 100 : 100;
    const resolvedIssues = deptIssues.filter(i => i.status === "solved" || i.status === "closed").length;
    const totalIssues = deptIssues.length;
    const issueClosedScore = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 100;

    const finalScore = Math.round(
      (0.50 * completionScore) + (0.30 * achievementScore) + (0.20 * issueClosedScore)
    );

    let rating: "Excellent" | "Good" | "Need Improvement" | "Critical" = "Excellent";
    let colorClass = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50";

    if (finalScore < 50) {
      rating = "Critical";
      colorClass = "text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50";
    } else if (finalScore < 75) {
      rating = "Need Improvement";
      colorClass = "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50";
    } else if (finalScore < 90) {
      rating = "Good";
      colorClass = "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50";
    }

    return {
      score: finalScore,
      rating,
      colorClass,
      completionScore: Math.round(completionScore),
      achievementScore: Math.round(achievementScore),
      issueClosedScore: Math.round(issueClosedScore)
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentProfile,
        setCurrentProfile: updateProfileAndSave,
        allProfiles,
        departments: DEPARTMENTS,
        metrics,
        metricValues,
        todos,
        issues,
        headlines,
        historyLogs,
        currentYear,
        currentMonth,
        currentWeek,
        rocks,
        addRock,
        editRock,
        deleteRock,
        toggleRockStatus,
        getRockProgress,
        addMetric,
        editMetric,
        deleteMetric,
        updateMetricValue,
        updateMetricDailyValues,
        completeMetric,
        reactivateMetric,
        addTodo,
        editTodo,
        deleteTodo,
        updateTodoStatus,
        convertTodoToMetric,
        addIssue,
        editIssue,
        deleteIssue,
        updateIssueStatus,
        updateIssuePriority,
        addHeadline,
        editHeadline,
        deleteHeadline,
        addHistoryLog,
        archiveOldLogsNow,
        sendEmailNotification,
        emailNotifSettings,
        updateEmailNotifSettings,
        getMetricActiveWeek,
        getWeekString,
        getFilteredData,
        getHealthScore,
        language,
        updateLanguage,
        theme,
        updateTheme,
        fontSize,
        updateFontSize,
        uiDensity,
        updateUiDensity,
        highContrast,
        updateHighContrast,
        reduceMotion,
        updateReduceMotion,
        toast,
        showToast,
        hideToast,
        confirmModal,
        showConfirm,
        hideConfirm,
        isLoading,
        isLoggedIn,
        credentials,
        loginProfile,
        logoutProfile,
        addProfile,
        updateProfileAndSave,
        resetToDummyData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

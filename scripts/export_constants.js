const fs = require("fs");
const path = require("path");

const {
  ROCKS,
  METRICS,
  TODOS,
  ISSUES,
  HEADLINES,
  HISTORY_LOGS,
  createMetricValues
} = require("./seed_dummy_data");

const metricValues = createMetricValues();

// Map DB snake_case to TS CamelCase
const mappedRocks = ROCKS.map(r => ({
  id: r.id,
  departmentId: r.department_id,
  title: r.title,
  description: r.description,
  quarter: r.quarter,
  year: r.year,
  status: r.status === "done" ? "completed" : r.status,
  picId: r.pic_id,
  picName: r.pic_name,
  dueDate: r.due_date,
  createdAt: r.created_at
}));

const mappedMetrics = METRICS.map(m => ({
  id: m.id,
  departmentId: m.department_id,
  rockId: m.rock_id || null,
  name: m.name,
  target: m.target,
  unit: m.unit,
  targetType: m.target_type,
  picId: m.pic_id,
  picName: m.pic_name,
  keterangan: m.keterangan,
  isActive: m.is_active,
  cycleType: m.cycle_type,
  durationDays: m.duration_days,
  deadline: m.deadline || undefined,
  accumulationMode: m.accumulation_mode,
  createdAt: m.created_at
}));

const mappedMetricValues = metricValues.map(v => ({
  id: v.id,
  metricId: v.metric_id,
  year: v.year,
  month: v.month,
  week: v.week,
  value: v.value,
  inputtedBy: v.inputted_by,
  dailyValues: v.daily_values,
  updatedAt: v.updated_at
}));

const mappedTodos = TODOS.map(t => ({
  id: t.id,
  departmentId: t.department_id,
  title: t.title,
  description: t.description,
  priority: t.priority,
  deadline: t.deadline,
  status: t.status,
  createdBy: t.created_by,
  attachments: t.attachments
}));

const mappedIssues = ISSUES.map(i => ({
  id: i.id,
  departmentId: i.department_id,
  title: i.title,
  description: i.description,
  priority: i.priority,
  status: i.status,
  picId: i.pic_id,
  picName: i.pic_name,
  createdAt: i.created_at,
  attachments: i.attachments
}));

const mappedHeadlines = HEADLINES.map(h => ({
  id: h.id,
  departmentId: h.department_id,
  title: h.title,
  content: h.content,
  category: h.category,
  authorId: h.author_id,
  authorName: h.author_name,
  createdAt: h.created_at,
  attachments: h.attachments
}));

const mappedLogs = HISTORY_LOGS.map(l => ({
  id: l.id,
  profileId: l.profile_id,
  profileName: l.profile_name,
  departmentId: l.department_id,
  action: l.action,
  details: l.details,
  createdAt: l.created_at
}));

const constantsTsPath = path.join(__dirname, "..", "src", "constants", "index.ts");
const currentConstants = fs.readFileSync(constantsTsPath, "utf8");

// Keep the top part (DEPARTMENTS, DEFAULT_PROFILES, DEFAULT_CREDENTIALS)
const splitMarker = "// Data Operasional";
const topPart = currentConstants.split(splitMarker)[0].trim();

const newContent = `import { Department, Profile, Rock, Metric, MetricValue, Todo, Issue, Headline, HistoryLog } from "@/types";

${topPart.replace('import { Department, Profile, Rock, Metric, MetricValue, Todo, Issue, Headline } from "@/types";\n\n', '')}

// Data Operasional Bervariasi & Komprehensif (Dummy Dataset Lengkap Nasi Gerilya)
export const INITIAL_ROCKS: Rock[] = ${JSON.stringify(mappedRocks, null, 2)};

export const INITIAL_METRICS: Metric[] = ${JSON.stringify(mappedMetrics, null, 2)};

export const INITIAL_METRIC_VALUES: MetricValue[] = ${JSON.stringify(mappedMetricValues, null, 2)};

export const INITIAL_TODOS: Todo[] = ${JSON.stringify(mappedTodos, null, 2)};

export const INITIAL_ISSUES: Issue[] = ${JSON.stringify(mappedIssues, null, 2)};

export const INITIAL_HEADLINES: Headline[] = ${JSON.stringify(mappedHeadlines, null, 2)};

export const INITIAL_LOGS_DATA: HistoryLog[] = ${JSON.stringify(mappedLogs, null, 2)};
`;

fs.writeFileSync(constantsTsPath, newContent, "utf8");
console.log("✅ Successfully exported dummy dataset to src/constants/index.ts!");

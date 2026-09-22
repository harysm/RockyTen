export interface Department {
  id: string;
  name: string;
}

export type Role = "owner" | "pic" | "developer";

export interface Profile {
  id: string;
  name: string;
  role: Role;
  departmentId: string | null;
  avatarUrl?: string;
  email?: string;
  password?: string;
}

export interface AttachmentInfo {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface Rock {
  id: string;
  departmentId: string;
  title: string;
  description?: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
  status: "on_track" | "off_track" | "completed" | "dropped";
  progress?: number;
  picId: string;
  picName: string;
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Metric {
  id: string;
  departmentId: string;
  rockId?: string | null; // Nullable: if set, it's a Sub-Metric of a Rock; if null, it's an Independent Metric
  name: string;
  target: number;
  unit: "number" | "percentage" | "currency" | "boolean";
  targetType: "higher_better" | "lower_better";
  picId: string;
  picName: string;
  keterangan?: string;
  isActive: boolean;
  createdAt: string;
  cycleType?: "monthly" | "special";
  durationDays?: number;
  deadline?: string; // YYYY-MM-DD
  accumulationMode?: "sum" | "average";
}

export interface MetricValue {
  id: string;
  metricId: string;
  year: number;
  month: number;
  week: number;
  value: number | null;
  inputtedBy?: string;
  updatedAt?: string;
  dailyValues?: (number | null)[];
}

export interface Todo {
  id: string;
  departmentId: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  deadline: string; // YYYY-MM-DD
  status: "pending" | "in_progress" | "completed" | "cancel";
  createdBy: string;
  convertedToMetricId?: string;
  attachments?: AttachmentInfo[];
}

export interface Issue {
  id: string;
  departmentId: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "solved" | "closed";
  picId: string;
  picName: string;
  createdAt: string;
  attachments?: AttachmentInfo[];
}

export interface Headline {
  id: string;
  departmentId: string | null;
  title: string;
  content: string;
  category: "good_news" | "bad_news" | "reminder" | "announcement" | "achievement";
  authorId: string;
  authorName: string;
  createdAt: string;
  attachments?: AttachmentInfo[];
}

export interface HistoryLog {
  id: string;
  profileId: string;
  profileName: string;
  departmentId: string | null;
  action: string;
  details: string;
  createdAt: string;
}

export interface ToastInfo {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface ConfirmModalInfo {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
}

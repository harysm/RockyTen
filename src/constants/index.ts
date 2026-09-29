import { Department, Profile, Rock, Metric, MetricValue, Todo, Issue, Headline } from "@/types";

export const DEPARTMENTS: Department[] = [
  { id: "dept-it", name: "IT" },
  { id: "dept-finance", name: "Finance" },
  { id: "dept-kitchen", name: "Kitchen" },
  { id: "dept-service", name: "Service" },
  { id: "dept-marketing", name: "Marketing" }
];

export const DEFAULT_PROFILES: Profile[] = [
  { 
    id: "prof-dev", 
    name: "Developer", 
    role: "developer", 
    departmentId: null, 
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80", 
    email: "developer@ng.com" 
  },
  { 
    id: "prof-owner", 
    name: "Owner", 
    role: "owner", 
    departmentId: null, 
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80", 
    email: "owner@ng.com" 
  },
  { 
    id: "prof-pic-it", 
    name: "IT", 
    role: "pic", 
    departmentId: "dept-it", 
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80", 
    email: "it@ng.com" 
  },
  { 
    id: "prof-pic-finance", 
    name: "Finance", 
    role: "pic", 
    departmentId: "dept-finance", 
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80", 
    email: "finance@ng.com" 
  },
  { 
    id: "prof-pic-kitchen", 
    name: "Kitchen", 
    role: "pic", 
    departmentId: "dept-kitchen", 
    avatarUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=250&q=80", 
    email: "kitchen@ng.com" 
  },
  { 
    id: "prof-pic-service", 
    name: "Service", 
    role: "pic", 
    departmentId: "dept-service", 
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80", 
    email: "service@ng.com" 
  },
  { 
    id: "prof-pic-marketing", 
    name: "Marketing", 
    role: "pic", 
    departmentId: "dept-marketing", 
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80", 
    email: "marketing@ng.com" 
  }
];

export const DEFAULT_CREDENTIALS: Record<string, { password: string; profileId: string }> = {
  // Akun Resmi @ng.com
  "developer@ng.com": { password: "dev123", profileId: "prof-dev" },
  "dev@ng.com": { password: "dev123", profileId: "prof-dev" },
  "owner@ng.com": { password: "owner123", profileId: "prof-owner" },
  "it@ng.com": { password: "123456", profileId: "prof-pic-it" },
  "finance@ng.com": { password: "123456", profileId: "prof-pic-finance" },
  "kitchen@ng.com": { password: "123456", profileId: "prof-pic-kitchen" },
  "service@ng.com": { password: "123456", profileId: "prof-pic-service" },
  "marketing@ng.com": { password: "123456", profileId: "prof-pic-marketing" },

  // Alias kompatibilitas
  "richard@gmail.com": { password: "owner123", profileId: "prof-owner" },
  "kim@gmail.com": { password: "owner123", profileId: "prof-kim" },
  "developer@garciafood.com": { password: "dev123", profileId: "prof-dev" },
  "owner@garciafood.com": { password: "owner123", profileId: "prof-owner" },
  "it@garciafood.com": { password: "123456", profileId: "prof-pic-it" },
  "finance@garciafood.com": { password: "123456", profileId: "prof-pic-finance" },
  "kitchen@garciafood.com": { password: "123456", profileId: "prof-pic-kitchen" },
  "service@garciafood.com": { password: "123456", profileId: "prof-pic-service" },
  "marketing@garciafood.com": { password: "123456", profileId: "prof-pic-marketing" }
};

// Data Operasional Bersih (Clean Slate / Siap Input Riil)
export const INITIAL_ROCKS: Rock[] = [];
export const INITIAL_METRICS: Metric[] = [];
export const INITIAL_METRIC_VALUES: MetricValue[] = [];
export const INITIAL_TODOS: Todo[] = [];
export const INITIAL_ISSUES: Issue[] = [];
export const INITIAL_HEADLINES: Headline[] = [];

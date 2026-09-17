"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Bell,
  AlertCircle,
  CheckSquare,
  Newspaper,
  Target,
  Check,
  ChevronRight,
  Sparkles,
  X
} from "lucide-react";

export type NotificationCategory = "all" | "issues" | "todos" | "headlines" | "rocks";

interface NotificationItem {
  id: string;
  category: "issues" | "todos" | "headlines" | "rocks";
  title: string;
  subtitle: string;
  deptName: string;
  priority?: string;
  timestamp: string;
  dateObj: Date;
  href: string;
  isUrgent?: boolean;
}

export const NotificationDropdown: React.FC = () => {
  const router = useRouter();
  const { issues, todos, headlines, rocks, departments, language } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [readIds, setReadIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load read notifications from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("rockyten_read_notifications");
        if (saved) {
          setReadIds(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load read notifications", e);
      }
    }
  }, []);

  // Save read notifications to localStorage
  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("rockyten_read_notifications", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save read notifications", e);
        }
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("rockyten_read_notifications", JSON.stringify(allIds));
      } catch (e) {
        console.error("Failed to save read notifications", e);
      }
    }
  };

  // Close on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const getDeptName = (deptId: string | null) => {
    if (!deptId) return "Umum";
    const d = departments.find((dept) => dept.id === deptId);
    return d ? d.name : "Divisi";
  };

  // Build live notifications from AppContext
  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];

    // 1. Open Issues (especially critical and high)
    issues
      .filter((i) => i.status !== "solved" && i.status !== "closed")
      .forEach((issue) => {
        const isUrgent = issue.priority === "critical" || issue.priority === "high";
        const d = issue.createdAt ? new Date(issue.createdAt) : new Date();
        items.push({
          id: `issue-${issue.id}`,
          category: "issues",
          title: issue.title,
          subtitle: issue.description ? issue.description.slice(0, 80) : "Kendala operasional butuh tindak lanjut",
          deptName: getDeptName(issue.departmentId),
          priority: issue.priority,
          timestamp: issue.createdAt || "",
          dateObj: isNaN(d.getTime()) ? new Date() : d,
          href: "/issues",
          isUrgent
        });
      });

    // 2. Pending high priority Todos
    todos
      .filter((t) => t.status === "pending")
      .forEach((todo) => {
        const isUrgent = todo.priority === "high";
        items.push({
          id: `todo-${todo.id}`,
          category: "todos",
          title: todo.title,
          subtitle: todo.description ? todo.description.slice(0, 80) : "Agenda kerja perlu diselesaikan",
          deptName: getDeptName(todo.departmentId),
          priority: todo.priority,
          timestamp: todo.deadline || "",
          dateObj: todo.deadline ? new Date(todo.deadline) : new Date(),
          href: "/todos",
          isUrgent
        });
      });

    // 3. Headlines / Announcements
    headlines.forEach((h) => {
      const d = h.createdAt ? new Date(h.createdAt) : new Date();
      items.push({
        id: `headline-${h.id}`,
        category: "headlines",
        title: h.title,
        subtitle: h.content ? h.content.slice(0, 80) : "Pengumuman manajemen",
        deptName: getDeptName(h.departmentId),
        timestamp: h.createdAt || "",
        dateObj: isNaN(d.getTime()) ? new Date() : d,
        href: "/headlines",
        isUrgent: h.category === "bad_news"
      });
    });

    // 4. Off-Track Rocks
    rocks
      .filter((r) => r.status === "off_track")
      .forEach((rock) => {
        const d = rock.dueDate ? new Date(rock.dueDate) : new Date();
        items.push({
          id: `rock-${rock.id}`,
          category: "rocks",
          title: `[Off Track] ${rock.title}`,
          subtitle: `Target Kuartal ${rock.quarter} ${rock.year} - Tenggat: ${rock.dueDate}`,
          deptName: getDeptName(rock.departmentId),
          priority: "high",
          timestamp: rock.dueDate || "",
          dateObj: isNaN(d.getTime()) ? new Date() : d,
          href: "/rocks",
          isUrgent: true
        });
      });

    // Sort: Urgent first, then by date descending
    return items.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return b.dateObj.getTime() - a.dateObj.getTime();
    });
  }, [issues, todos, headlines, rocks, departments]);

  // Filtered notifications by active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  const hasUrgent = useMemo(() => {
    return notifications.some((n) => n.isUrgent && !readIds.includes(n.id));
  }, [notifications, readIds]);

  const handleItemClick = (item: NotificationItem) => {
    markAsRead(item.id);
    setIsOpen(false);
    router.push(item.href);
  };

  const getCategoryIcon = (category: NotificationItem["category"]) => {
    switch (category) {
      case "issues":
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case "todos":
        return <CheckSquare className="w-4 h-4 text-blue-500" />;
      case "headlines":
        return <Newspaper className="w-4 h-4 text-amber-500" />;
      case "rocks":
        return <Target className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title={language === "id" ? "Pusat Notifikasi" : "Notifications"}
        aria-label="Notifications"
        className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-150 cursor-pointer ${
          isOpen
            ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/80 shadow-xs"
            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 border border-transparent"
        }`}
      >
        <Bell className="w-5 h-5 shrink-0" />

        {/* Unread Badge Indicator positioned at top-right corner without overlapping bell */}
        {unreadCount > 0 && (
          <span
            className={`absolute top-0 right-0 translate-x-1 -translate-y-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black leading-none text-white rounded-full ${
              hasUrgent ? "bg-rose-500 animate-pulse" : "bg-blue-600"
            } ring-2 ring-white dark:ring-zinc-950 shadow-xs pointer-events-none z-10`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-zinc-850 bg-slate-50/70 dark:bg-zinc-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === "id" ? "Notifikasi Operasional" : "Operational Alerts"}
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                  {unreadCount} {language === "id" ? "baru" : "new"}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                {language === "id" ? "Tandai Dibaca" : "Mark all read"}
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-zinc-850 bg-white dark:bg-zinc-950 overflow-x-auto no-scrollbar">
            {(
              [
                { key: "all", label: language === "id" ? "Semua" : "All" },
                { key: "issues", label: language === "id" ? "🚨 Masalah" : "🚨 Issues" },
                { key: "todos", label: language === "id" ? "📋 Agenda" : "📋 Todos" },
                { key: "headlines", label: language === "id" ? "📢 Berita" : "📢 News" },
                { key: "rocks", label: "🎯 Rocks" }
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-850">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  {language === "id" ? "Semua Beres & Aman!" : "All clear!"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                  {language === "id"
                    ? "Tidak ada kendala atau notifikasi operasional aktif saat ini."
                    : "No pending issues or urgent alerts at the moment."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isRead = readIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer ${
                      !isRead ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 flex-shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                          {item.deptName}
                        </span>
                        {item.priority && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              item.priority === "critical"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                                : item.priority === "high"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                                : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            {item.priority.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-xs mt-0.5 truncate ${
                          !isRead
                            ? "font-bold text-slate-900 dark:text-white"
                            : "font-semibold text-slate-700 dark:text-zinc-300"
                        }`}
                      >
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    {!isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Quick Links */}
          <div className="p-2.5 border-t border-slate-100 dark:border-zinc-850 bg-slate-50/70 dark:bg-zinc-900/40 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/issues");
              }}
              className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{language === "id" ? "Buka Masalah (IDS)" : "Open Issues"}</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/todos");
              }}
              className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{language === "id" ? "Buka Agenda (Todos)" : "Open Todos"}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

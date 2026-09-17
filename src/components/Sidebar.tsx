"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Table2,
  Milestone,
  Newspaper,
  CheckSquare,
  AlertCircle,
  History,
  Archive,
  Settings,
  X
} from "lucide-react";

export interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  mobileOpen: externalMobileOpen,
  onCloseMobile
}) => {
  const pathname = usePathname();
  const { currentProfile, language } = useApp();
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const isMobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen;

  const handleClose = () => {
    if (onCloseMobile) {
      onCloseMobile();
    } else {
      setInternalMobileOpen(false);
    }
  };

  const roleLower = (currentProfile.role || "").toLowerCase();
  const isOwnerOrDev = roleLower === "developer" || roleLower === "owner" || !currentProfile.departmentId;

  const baseNavItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Scoreboard", href: "/scoreboard", icon: Table2 },
    { name: "Rocks (90 Hari)", href: "/rocks", icon: Milestone },
    { name: language === "id" ? "Headline" : "Headlines", href: "/headlines", icon: Newspaper },
    { name: language === "id" ? "To Do List" : "To-Do", href: "/todos", icon: CheckSquare },
    { name: language === "id" ? "Issue (IDS)" : "Issues", href: "/issues", icon: AlertCircle },
    { name: language === "id" ? "Histori Log" : "History", href: "/history", icon: History },
  ];

  const navItems = isOwnerOrDev
    ? [...baseNavItems, { name: language === "id" ? "Arsip" : "Archives", href: "/archives", icon: Archive }]
    : baseNavItems;

  const SidebarContent = () => (
    <>
      {/* Brand Title */}
      <div className="h-14 sm:h-16 px-5 border-b border-slate-200 dark:border-zinc-800 flex items-center">
        <Link
          href="/"
          onClick={handleClose}
          className="font-bold text-lg text-slate-900 dark:text-white tracking-tight hover:opacity-85 transition-opacity"
        >
          RockyTen
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold border border-blue-200/70 dark:border-blue-900/60 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-zinc-500"}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Link */}
      <div className="p-3 border-t border-slate-100 dark:border-zinc-850">
        <Link
          href="/settings"
          onClick={handleClose}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 ${
            pathname === "/settings"
              ? "bg-slate-100 text-slate-900 dark:bg-zinc-900 dark:text-white font-bold border border-slate-200 dark:border-zinc-800"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 border border-transparent"
          }`}
        >
          <Settings className={`w-4 h-4 flex-shrink-0 ${pathname === "/settings" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-zinc-500"}`} />
          <span>{language === "id" ? "Pengaturan & RBAC" : "Settings & RBAC"}</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-150"
          onClick={handleClose}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 z-50 flex flex-col shadow-xl transition-transform duration-200 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 rounded-md transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 flex-col h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-zinc-850 z-20">
        <SidebarContent />
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";
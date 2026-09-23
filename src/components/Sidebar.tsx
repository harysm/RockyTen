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
  HelpCircle,
  X,
  PanelLeftClose,
  PanelLeftOpen
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
  const { currentProfile, language, isSidebarCollapsed, toggleSidebarCollapsed } = useApp();
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
    { name: "Rocks", href: "/rocks", icon: Milestone },
    { name: language === "id" ? "Headline" : "Headlines", href: "/headlines", icon: Newspaper },
    { name: language === "id" ? "To Do List" : "To-Do", href: "/todos", icon: CheckSquare },
    { name: language === "id" ? "Issue" : "Issues", href: "/issues", icon: AlertCircle },
    { name: language === "id" ? "Histori Log" : "History", href: "/history", icon: History },
  ];

  const navItems = isOwnerOrDev
    ? [...baseNavItems, { name: language === "id" ? "Arsip" : "Archives", href: "/archives", icon: Archive }]
    : baseNavItems;

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <>
      {/* Brand Logo & Collapse Toggle Button */}
      <div
        className={`h-14 sm:h-16 border-b border-slate-200/80 dark:border-zinc-850 flex items-center transition-all duration-300 ${
          isCollapsed ? "px-2.5 justify-center" : "px-4 sm:px-5 justify-between"
        }`}
      >
        {!isCollapsed ? (
          <div className="flex items-center justify-between w-full">
            <Link
              href="/"
              onClick={handleClose}
              className="flex items-center group select-none transition-opacity hover:opacity-90 overflow-hidden"
            >
              <span className="font-brand font-black text-xl sm:text-[22px] tracking-tight text-slate-900 dark:text-white truncate">
                Rocky <span className="text-red-600 dark:text-red-500">ten</span>
              </span>
            </Link>

            {/* Collapse Toggle Button (Visible only on desktop) */}
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              title={language === "id" ? "Kecilkan Navbar (Icon Saja)" : "Collapse Sidebar"}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer select-none"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-1">
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              title={language === "id" ? "Buka Kembali Navbar" : "Expand Sidebar"}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all cursor-pointer group"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links (Linear / Raycast Style - Borderless with Red Left Indicator & Micro-interactions) */}
      <nav className={`flex-1 ${isCollapsed ? "px-2" : "px-2.5"} py-3 space-y-1 overflow-y-auto overflow-x-hidden`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleClose}
              title={isCollapsed ? item.name : undefined}
              className={`relative flex items-center ${
                isCollapsed
                  ? "justify-center px-2 py-2.5 rounded-xl"
                  : "gap-2.5 px-3 py-2 rounded-lg text-xs"
              } transition-all duration-150 group select-none ${
                isActive
                  ? "bg-slate-100/90 text-slate-900 dark:bg-zinc-900/90 dark:text-white font-bold"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-zinc-900/50 font-medium"
              }`}
            >
              {/* Active Indicator Bar (Red vertical accent bar on left) */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-red-600 dark:bg-red-500 shadow-xs" />
              )}

              <Icon
                className={`${isCollapsed ? "w-5 h-5" : "w-4 h-4"} flex-shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-0.5 ${
                  isActive
                    ? "text-red-600 dark:text-red-500"
                    : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300"
                }`}
              />

              {!isCollapsed && (
                <span className="truncate transition-opacity duration-200">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings & Help Links */}
      <div className={`${isCollapsed ? "p-2" : "p-2.5"} border-t border-slate-100 dark:border-zinc-850/80 space-y-1`}>
        <Link
          href="/settings"
          onClick={handleClose}
          title={isCollapsed ? (language === "id" ? "Pengaturan" : "Settings") : undefined}
          className={`relative flex items-center ${
            isCollapsed
              ? "justify-center px-2 py-2.5 rounded-xl"
              : "gap-2.5 px-3 py-2 rounded-lg text-xs"
          } transition-all duration-150 group select-none ${
            pathname === "/settings"
              ? "bg-slate-100/90 text-slate-900 dark:bg-zinc-900/90 dark:text-white font-bold"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-zinc-900/50 font-medium"
          }`}
        >
          {pathname === "/settings" && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-red-600 dark:bg-red-500 shadow-xs" />
          )}
          <Settings
            className={`${isCollapsed ? "w-5 h-5" : "w-4 h-4"} flex-shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-0.5 ${
              pathname === "/settings"
                ? "text-red-600 dark:text-red-500"
                : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300"
            }`}
          />
          {!isCollapsed && <span>{language === "id" ? "Pengaturan" : "Settings"}</span>}
        </Link>

        <Link
          href="/help"
          onClick={handleClose}
          title={isCollapsed ? (language === "id" ? "Bantuan & Sistem" : "Help & System") : undefined}
          className={`relative flex items-center ${
            isCollapsed
              ? "justify-center px-2 py-2.5 rounded-xl"
              : "gap-2.5 px-3 py-2 rounded-lg text-xs"
          } transition-all duration-150 group select-none ${
            pathname === "/help"
              ? "bg-slate-100/90 text-slate-900 dark:bg-zinc-900/90 dark:text-white font-bold"
              : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-zinc-900/50 font-medium"
          }`}
        >
          {pathname === "/help" && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-red-600 dark:bg-red-500 shadow-xs" />
          )}
          <HelpCircle
            className={`${isCollapsed ? "w-5 h-5" : "w-4 h-4"} flex-shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-0.5 ${
              pathname === "/help"
                ? "text-red-600 dark:text-red-500"
                : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300"
            }`}
          />
          {!isCollapsed && <span>{language === "id" ? "Bantuan & Sistem" : "Help & System"}</span>}
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

      {/* Mobile sidebar drawer (Always full width on mobile) */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full w-72 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 z-50 flex flex-col shadow-xl transition-transform duration-200 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 rounded-md transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent isCollapsed={false} />
      </aside>

      {/* Desktop collapsible sidebar */}
      <aside
        className={`hidden lg:flex ${
          isSidebarCollapsed ? "w-[68px]" : "w-60"
        } bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 flex-col h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-zinc-850 z-20 transition-all duration-300 ease-in-out`}
      >
        <SidebarContent isCollapsed={isSidebarCollapsed} />
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";
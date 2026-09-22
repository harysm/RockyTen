"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Menu,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  ExternalLink,
  Calendar
} from "lucide-react";
import NetworkStatusBadge from "@/components/NetworkStatusBadge";
import NotificationDropdown from "@/components/NotificationDropdown";

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentProfile,
    departments,
    language,
    logoutProfile,
    theme,
    updateTheme,
    showConfirm
  } = useApp();

  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    setFormattedDate(today.toLocaleDateString(language === "id" ? "id-ID" : "en-US", options));
  }, [language]);

  // Close account menu on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountMenuOpen(false);
    };

    if (accountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  const toggleTheme = () => {
    updateTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    setAccountMenuOpen(false);
    showConfirm({
      title: language === "id" ? "Konfirmasi Keluar" : "Confirm Logout",
      message:
        language === "id"
          ? "Apakah Anda yakin ingin keluar dari sesi akun ini?"
          : "Are you sure you want to log out of this account?",
      confirmText: language === "id" ? "Ya, Keluar" : "Log out",
      cancelText: language === "id" ? "Batal" : "Cancel",
      variant: "danger",
      onConfirm: () => {
        logoutProfile();
        router.push("/auth");
      }
    });
  };

  const getDeptName = (id: string | null) => {
    if (currentProfile.role === "developer") return "Developer";
    if (!id) return "Owner / Direksi";
    const dept = departments.find((d) => d.id === id);
    return dept ? dept.name : "PIC";
  };



  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left Section: Mobile Menu Button & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand (visible only on small screens) */}
        <div className="flex items-center gap-2 lg:hidden">
          <span className="font-brand text-sm font-black tracking-tight text-slate-900 dark:text-white">
            Rocky <span className="text-red-600 dark:text-red-500">ten</span>
          </span>
        </div>

        {/* Desktop Date Display (Applies to all pages) */}
        <div className="hidden lg:flex items-center gap-2 min-w-0">
          <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
          <h1 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-zinc-300 tracking-tight truncate">
            {formattedDate}
          </h1>
        </div>
      </div>

      {/* Right Section: System Controls, Notification, and User Account */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Network Connection Signal Badge */}
        <div className="hidden sm:flex items-center">
          <NetworkStatusBadge />
        </div>

        {/* Dark / Light Theme Quick Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600 dark:text-zinc-400 shrink-0" />
          )}
        </button>

        {/* NOTIFICATION BELL ICON WITH DROPDOWN (Directly to the left of Account) */}
        <NotificationDropdown />

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 my-auto" />

        {/* USER ACCOUNT PROFILE (Far Right of TopBar) */}
        <div className="relative" ref={accountMenuRef}>
          <button
            onClick={() => setAccountMenuOpen((prev) => !prev)}
            className={`flex items-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 sm:pr-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
              accountMenuOpen
                ? "bg-slate-100 dark:bg-zinc-900 ring-2 ring-blue-500/20"
                : "hover:bg-slate-100 dark:hover:bg-zinc-900"
            }`}
            aria-expanded={accountMenuOpen}
            aria-haspopup="true"
          >
            {/* User Avatar */}
            {currentProfile.avatarUrl ? (
              <img
                src={currentProfile.avatarUrl}
                alt={currentProfile.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-zinc-700 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                {currentProfile.name.charAt(0)}
              </div>
            )}

            {/* Name and Role Label (Hidden on small mobile screens) */}
            <div className="hidden sm:block text-left min-w-0 max-w-[130px] md:max-w-[170px]">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                {currentProfile.name}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                {getDeptName(currentProfile.departmentId)}
              </p>
            </div>

            {/* Subtle Chevron */}
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 transition-transform duration-150 ${
                accountMenuOpen ? "rotate-180 text-blue-600" : ""
              }`}
            />
          </button>

          {/* Account Dropdown Panel */}
          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-xl border border-slate-100 dark:border-zinc-800/80 mb-2">
                <div className="flex items-center gap-3">
                  {currentProfile.avatarUrl ? (
                    <img
                      src={currentProfile.avatarUrl}
                      alt={currentProfile.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-zinc-700 shadow-xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {currentProfile.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {currentProfile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                      {currentProfile.email || "user@nasigerilya.com"}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">
                    {language === "id" ? "Divisi / Unit:" : "Division:"}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">
                    {getDeptName(currentProfile.departmentId)}
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1">
                <Link
                  href="/settings"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                    <span>{language === "id" ? "Pengaturan Akun & RBAC" : "Account Settings & RBAC"}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              </div>

              <div className="my-1.5 border-t border-slate-100 dark:border-zinc-850" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === "id" ? "Keluar dari Akun" : "Log out"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;

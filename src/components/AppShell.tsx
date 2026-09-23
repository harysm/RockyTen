"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

import CustomConfirmModal from "@/components/CustomConfirmModal";
import TopBar from "@/components/TopBar";

import { MaintenanceScreen } from "@/components/MaintenanceScreen";

const IS_MAINTENANCE_MODE = false;

export const AppShell: React.FC<{ children: React.ReactNode; fullWidth?: boolean }> = ({ children, fullWidth }) => {
  const { isLoggedIn, toast, hideToast, confirmModal, hideConfirm, isSidebarCollapsed } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [isBypassed, setIsBypassed] = React.useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBypass = localStorage.getItem("maintenance_bypass");
      if (savedBypass === "true") {
        setIsBypassed(true);
      }
    }
  }, []);

  const isAuthPage = pathname === "/auth";
  const isArchivesPage = pathname === "/archives" || fullWidth;

  useEffect(() => {
    if (!isLoggedIn && !isAuthPage) {
      router.push("/auth");
    }
  }, [isLoggedIn, isAuthPage, router]);

  // Auto-hide toast after timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast?.id, hideToast]);

  // If Maintenance Mode is Active & Not Bypassed -> Render Maintenance Screen
  if (IS_MAINTENANCE_MODE && !isBypassed) {
    return <MaintenanceScreen onBypass={() => setIsBypassed(true)} />;
  }

  if (isAuthPage) {
    return (
      <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {toast && <Toast key={toast.id} toast={toast} onClose={hideToast} />}
        {confirmModal && <CustomConfirmModal info={confirmModal} onClose={hideConfirm} />}
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
          {children}
        </div>
      </main>
    );
  }

  // Not logged in yet: render nothing while redirect happens
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Logged in: full app layout with TopBar & Sidebar
  return (
    <>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div
        className={`flex-1 ${
          isSidebarCollapsed ? "lg:pl-[68px]" : "lg:pl-60"
        } min-h-screen flex flex-col relative min-w-0 transition-all duration-300 ease-in-out`}
        suppressHydrationWarning
      >
        <TopBar onToggleSidebar={() => setMobileMenuOpen((prev) => !prev)} />
        <main className="flex-1 p-4 lg:p-6 pb-24 w-full max-w-full">
          {children}
        </main>
      </div>
      {toast && <Toast key={toast.id} toast={toast} onClose={hideToast} />}
      {confirmModal && <CustomConfirmModal info={confirmModal} onClose={hideConfirm} />}
    </>
  );
};

// Toast Component
interface ToastProps {
  toast: { message: string; type: "info" | "success" | "warning" | "error" };
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />;
    }
  };

  const getBarColor = () => {
    switch (toast.type) {
      case "success": return "bg-emerald-500";
      case "error": return "bg-rose-500";
      case "warning": return "bg-amber-500";
      default: return "bg-blue-500";
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success": return "border-emerald-500/30 dark:border-emerald-500/30";
      case "error": return "border-rose-500/30 dark:border-rose-500/30";
      case "warning": return "border-amber-500/30 dark:border-amber-500/30";
      default: return "border-blue-500/30 dark:border-blue-500/30";
    }
  };

  return (
    <div className={`fixed top-16 left-4 right-4 sm:left-auto sm:right-5 sm:top-6 z-[99999] max-w-[calc(100vw-2rem)] sm:max-w-md w-auto sm:w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border ${getBorderColor()} shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200`}>
      <div className="p-4 flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-black tracking-wide uppercase text-slate-900 dark:text-white leading-tight">
            {toast.type === "success" && "Sukses"}
            {toast.type === "error" && "Gagal / Error"}
            {toast.type === "warning" && "Peringatan"}
            {toast.type === "info" && "Informasi"}
          </p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 leading-relaxed break-words">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* 3.5-Second Countdown Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 overflow-hidden">
        <div
          className={`h-full ${getBarColor()}`}
          style={{ animation: "toastCountdown 3.5s linear forwards" }}
          onAnimationEnd={onClose}
        />
      </div>
    </div>
  );
};
"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

import CustomConfirmModal from "@/components/CustomConfirmModal";
import CustomAlertModal from "@/components/CustomAlertModal";
import TopBar from "@/components/TopBar";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import { ToastInfo } from "@/types";

const IS_MAINTENANCE_MODE = false;

export const AppShell: React.FC<{ children: React.ReactNode; fullWidth?: boolean }> = ({ children, fullWidth }) => {
  const { 
    isLoggedIn, 
    isAuthReady,
    toasts, 
    hideToast, 
    alertModal, 
    hideAlert, 
    confirmModal, 
    hideConfirm, 
    isSidebarCollapsed 
  } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [isBypassed, setIsBypassed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBypass = localStorage.getItem("maintenance_bypass");
      if (savedBypass === "true") {
        setIsBypassed(true);
      }
    }
  }, []);

  const isAuthPage = pathname === "/auth";

  useEffect(() => {
    // Only redirect once client has checked session state from localStorage
    if (isAuthReady && !isLoggedIn && !isAuthPage) {
      router.replace("/auth");
    }
  }, [isAuthReady, isLoggedIn, isAuthPage, router]);

  // If Maintenance Mode is Active & Not Bypassed -> Render Maintenance Screen
  if (IS_MAINTENANCE_MODE && !isBypassed) {
    return <MaintenanceScreen onBypass={() => setIsBypassed(true)} />;
  }

  // Not logged in or checking auth: render clean loading spinner while redirect or session check occurs
  if ((!isAuthReady || !isLoggedIn) && !isAuthPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950 gap-3">
        <div className="w-8 h-8 border-4 border-slate-200 dark:border-zinc-800 border-t-red-600 rounded-full animate-spin" />
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-500">
          Memverifikasi Sesi...
        </span>
      </div>
    );
  }

  return (
    <>
      {/* 1. Global Multi-Stacking Toast Notification Container (Top-Center) */}
      <div 
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] flex flex-col items-center gap-2.5 pointer-events-none w-full max-w-md px-4"
        aria-live="polite"
        role="region"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => hideToast(t.id)} />
        ))}
      </div>

      {/* 2. Global Custom Alert Modal with Button (Slides smoothly from top, replaces native browser alert) */}
      {alertModal && <CustomAlertModal info={alertModal} onClose={hideAlert} />}

      {/* 3. Global Custom Confirm Modal */}
      {confirmModal && <CustomConfirmModal info={confirmModal} onClose={hideConfirm} />}

      {/* 4. Page Layout */}
      {isAuthPage ? (
        <main className="relative min-h-screen w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center">
            {children}
          </div>
        </main>
      ) : (
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
        </>
      )}
    </>
  );
};

// ==============================================================================
// TOAST ITEM COMPONENT (Top-Center, Multi-Stacking, Individual Timer)
// ==============================================================================
interface ToastItemProps {
  toast: ToastInfo;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  // Independent 3.5s auto-dismiss per toast item
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
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
    <div 
      className={`pointer-events-auto w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border ${getBorderColor()} shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-top-3 fade-in duration-200 transition-all`}
      role="alert"
    >
      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[11px] font-black tracking-wide uppercase text-slate-900 dark:text-white leading-tight">
            {toast.type === "success" && "Sukses"}
            {toast.type === "error" && "Gagal / Error"}
            {toast.type === "warning" && "Peringatan"}
            {toast.type === "info" && "Informasi"}
          </p>
          <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mt-0.5 leading-relaxed break-words">
            {toast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg cursor-pointer"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* 3.5-Second Countdown Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1 overflow-hidden">
        <div
          className={`h-full ${getBarColor()}`}
          style={{ animation: "toastCountdown 3.5s linear forwards" }}
        />
      </div>
    </div>
  );
};
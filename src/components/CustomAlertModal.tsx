"use client";

import React, { useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { AlertModalInfo } from "@/types";

interface CustomAlertModalProps {
  info: AlertModalInfo;
  onClose: () => void;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({ info, onClose }) => {
  const variant = info.variant || "info";

  // Lock scroll and listen for Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleAction = () => {
    if (info.onClose) info.onClose();
    onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case "error":
        return <AlertCircle className="w-6 h-6 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getIconBoxColor = () => {
    switch (variant) {
      case "error":
        return "bg-rose-500/10 border-rose-500/20";
      case "warning":
        return "bg-amber-500/10 border-amber-500/20";
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20";
      default:
        return "bg-blue-500/10 border-blue-500/20";
    }
  };

  const getDefaultTitle = () => {
    if (info.title) return info.title;
    switch (variant) {
      case "error":
        return "Terjadi Kesalahan";
      case "warning":
        return "Pemberitahuan Penting";
      case "success":
        return "Berhasil";
      default:
        return "Informasi Sistem";
    }
  };

  const getButtonColor = () => {
    switch (variant) {
      case "error":
        return "bg-rose-600 hover:bg-rose-700 border-rose-600 shadow-rose-600/25";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 border-amber-600 shadow-amber-600/25";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 shadow-emerald-600/25";
      default:
        return "bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-blue-600/25";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[9999999] flex items-start justify-center pt-10 sm:pt-20 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-6 zoom-in-95 duration-200 p-6 flex flex-col space-y-5 relative"
        role="alertdialog"
        aria-modal="true"
      >
        {/* Top accent light */}
        <div className={`absolute top-0 inset-x-0 h-1.5 ${
          variant === "error" ? "bg-rose-500" :
          variant === "warning" ? "bg-amber-500" :
          variant === "success" ? "bg-emerald-500" : "bg-blue-500"
        }`} />

        {/* Header Icon & Content */}
        <div className="flex items-start gap-4 pt-1">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getIconBoxColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              {getDefaultTitle()}
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium mt-1.5 leading-relaxed break-words whitespace-pre-line">
              {info.message}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAction}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleAction}
            className={`w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white rounded-xl transition-all shadow-md cursor-pointer border ${getButtonColor()}`}
          >
            {info.buttonText || "Mengerti"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlertModal;

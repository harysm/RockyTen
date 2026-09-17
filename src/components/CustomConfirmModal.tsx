"use client";

import React from "react";
import { AlertTriangle, Trash2, Info, X } from "lucide-react";
import { ConfirmModalInfo } from "@/context/AppContext";

interface CustomConfirmModalProps {
  info: ConfirmModalInfo;
  onClose: () => void;
}

export const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({ info, onClose }) => {
  const handleConfirm = () => {
    info.onConfirm();
    onClose();
  };

  const isDanger = info.variant === "danger" || !info.variant;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[999999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 p-6 flex flex-col space-y-5">
        
        {/* Header Icon & Title */}
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
            isDanger
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              : info.variant === "warning"
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
          }`}>
            {isDanger ? (
              <Trash2 className="w-6 h-6" />
            ) : info.variant === "warning" ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Info className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              {info.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed break-words">
              {info.message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-all border border-slate-200/80 dark:border-zinc-700/80 cursor-pointer"
          >
            {info.cancelText || "Batal"}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl transition-all shadow-md cursor-pointer border ${
              isDanger
                ? "bg-rose-600 hover:bg-rose-700 border-rose-600 shadow-rose-600/20"
                : info.variant === "warning"
                ? "bg-amber-600 hover:bg-amber-700 border-amber-600 shadow-amber-600/20"
                : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 shadow-zinc-900/20"
            }`}
          >
            {info.confirmText || (isDanger ? "Ya, Hapus" : "Konfirmasi")}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomConfirmModal;

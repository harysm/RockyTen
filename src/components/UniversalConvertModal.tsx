"use client";

import React, { useEffect } from "react";
import ConvertTargetForm, {
  ConvertSourceType,
  ConvertTargetType,
  UniversalConvertItem
} from "@/components/convert/ConvertTargetForm";

export type { ConvertSourceType, ConvertTargetType, UniversalConvertItem };

interface UniversalConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: ConvertSourceType;
  sourceItem: UniversalConvertItem | null;
}

export default function UniversalConvertModal({
  isOpen,
  onClose,
  sourceType,
  sourceItem
}: UniversalConvertModalProps) {
  // Escape key handler & scroll lock
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, onClose]);

  if (!isOpen || !sourceItem) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10 animate-in zoom-in-95 duration-200 transform-gpu"
        onClick={(e) => e.stopPropagation()}
      >
        <ConvertTargetForm
          sourceType={sourceType}
          sourceItem={sourceItem}
          onCancel={onClose}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}

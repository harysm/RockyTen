"use client";

import React, { useState, useEffect } from "react";
import { Issue, Department } from "@/context/AppContext";
import {
  X,
  RefreshCw,
  Edit3,
  Trash2,
  Calendar,
  User,
  Building2,
  FileText,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import ConvertTargetForm from "@/components/convert/ConvertTargetForm";

interface IssueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  departments: Department[];
  onConvert: (issue: Issue) => void;
  onEdit: (issue: Issue) => void;
  onDelete: (issue: Issue) => void;
  formatCardDate: (dateStr: string) => string;
  downloadAttachment: (name: string, dataUrl?: string, type?: string) => void;
  setLightboxImage: (url: string | null) => void;
}

export default function IssueDetailModal({
  isOpen,
  onClose,
  issue,
  departments,
  onConvert,
  onEdit,
  onDelete,
  formatCardDate,
  downloadAttachment,
  setLightboxImage,
}: IssueDetailModalProps) {
  const [isConverting, setIsConverting] = useState(false);

  // Reset convert mode whenever modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsConverting(false);
    }
  }, [isOpen]);

  // Lock background scroll & Escape key handler
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (isConverting) {
            setIsConverting(false);
          } else {
            onClose();
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose, isConverting]);

  if (!isOpen || !issue) return null;

  const dept = departments.find((d) => d.id === issue.departmentId);

  const getPriorityTextColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "low":
        return "text-slate-500 dark:text-zinc-400";
      case "medium":
        return "text-amber-600 dark:text-amber-400";
      case "high":
        return "text-orange-600 dark:text-orange-400";
      case "critical":
        return "text-rose-600 dark:text-rose-400 font-extrabold";
      default:
        return "text-slate-700 dark:text-zinc-300";
    }
  };

  const getStatusTextColor = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return "text-rose-600 dark:text-rose-400";
      case "in_progress":
        return "text-amber-600 dark:text-amber-400";
      case "solved":
        return "text-emerald-600 dark:text-emerald-400";
      case "closed":
        return "text-slate-500 dark:text-zinc-400";
      default:
        return "text-slate-700 dark:text-zinc-300";
    }
  };

  const getStatusLabel = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "solved":
        return "Solved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const linkAndDocAtts = issue.attachments?.filter(
    (att) => att.type === "link" || att.dataUrl?.startsWith("http") || !att.type.startsWith("image/")
  ) || [];

  const imageAtts = issue.attachments?.filter(
    (att) => att.type.startsWith("image/") && att.type !== "link" && !att.dataUrl?.startsWith("http")
  ) || [];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in-0 duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* STEP 2: FORMULIR KONVERSI (Smooth In-Place Step Slide) */}
        {isConverting ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-6 duration-200">
            <ConvertTargetForm
              sourceType="issue"
              sourceItem={{
                id: issue.id,
                title: issue.title,
                description: issue.description,
                departmentId: issue.departmentId,
                picName: issue.picName,
                picId: issue.picId,
                priority: issue.priority,
                attachments: issue.attachments,
                createdAt: issue.createdAt
              }}
              onBack={() => setIsConverting(false)}
              onCancel={onClose}
              onSuccess={() => {
                setIsConverting(false);
                onClose();
              }}
            />
          </div>
        ) : (
          /* STEP 1: DETAIL ISSUE ASAL */
          <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-6 duration-200">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800/80 flex justify-between items-start bg-slate-50/50 dark:bg-zinc-900/40">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Detail Masalah / Issue
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Informasi lengkap kendala dan opsi tindak lanjut divisi.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Issue Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Title */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  Judul Kendala
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                  {issue.title}
                </h4>
              </div>

              {/* Meta Grid: Department, Priority, Status, PIC */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-150 dark:border-zinc-800/80 rounded-xl">
                {/* Department */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 block mb-0.5">
                    Divisi
                  </span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{dept?.name || "Semua Divisi"}</span>
                  </span>
                </div>

                {/* Priority */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 block mb-0.5">
                    Prioritas
                  </span>
                  <span className={`font-bold capitalize flex items-center gap-1.5 ${getPriorityTextColor(issue.priority)}`}>
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{issue.priority}</span>
                  </span>
                </div>

                {/* Status */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 block mb-0.5">
                    Status
                  </span>
                  <span className={`font-bold block ${getStatusTextColor(issue.status)}`}>
                    {getStatusLabel(issue.status)}
                  </span>
                </div>

                {/* PIC */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 block mb-0.5">
                    PIC
                  </span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{issue.picName || "-"}</span>
                  </span>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Deskripsi & Catatan Kendala
                </span>
                <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 border border-slate-150 dark:border-zinc-800/80 rounded-xl text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">
                  {issue.description ? issue.description : "Tidak ada catatan deskripsi tambahan untuk issue ini."}
                </div>
              </div>

              {/* Attachments Section */}
              {issue.attachments && issue.attachments.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                    Lampiran File & Link ({issue.attachments.length})
                  </span>

                  {/* Links & Documents */}
                  {linkAndDocAtts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {linkAndDocAtts.map((att, idx) => (
                        <div key={idx} className="flex items-center">
                          {att.type === "link" || att.dataUrl?.startsWith("http") ? (
                            <a
                              href={att.dataUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 transition-all text-left shadow-2xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="truncate max-w-[200px]">{att.name}</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => downloadAttachment(att.name, att.dataUrl, att.type)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-300 transition-all text-left shadow-2xs cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[200px]">{att.name}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Images */}
                  {imageAtts.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {imageAtts.map((att, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-lg border border-slate-255 dark:border-zinc-800 overflow-hidden bg-slate-100 dark:bg-zinc-900 flex items-center justify-center group cursor-pointer shadow-2xs hover:shadow-md hover:border-red-400 dark:hover:border-red-600 transition-all"
                          onClick={() => setLightboxImage(att.dataUrl || null)}
                          title={att.name || "Gambar Lampiran"}
                        >
                          <img
                            src={att.dataUrl}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            alt={att.name || "attachment"}
                          />
                          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[9px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded">Zoom</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Creation Date Footer Info */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Dibuat pada {formatCardDate(issue.createdAt)}</span>
              </div>
            </div>

            {/* Modal Footer / Action Bar */}
            <div className="px-6 py-4 bg-slate-50/80 dark:bg-zinc-900/60 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap justify-between items-center gap-2">
              {/* Left Action Buttons: Convert, Edit, Delete */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConverting(true)}
                  title="Konversi Issue Ke Modul Lain"
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Konversi Modul</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(issue);
                  }}
                  title="Edit Issue"
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDelete(issue);
                  }}
                  title="Hapus Issue Secara Permanen"
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Hapus</span>
                </button>
              </div>

              {/* Right: Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

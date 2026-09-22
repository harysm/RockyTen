"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Target,
  ClipboardList,
  AlertOctagon,
  Megaphone,
  Paperclip,
  RefreshCw,
  Loader2,
  Calendar,
  X,
  ArrowLeft,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { AttachmentInfo } from "@/types";
import FormDatePicker from "@/components/FormDatePicker";

export type ConvertSourceType = "metric" | "todo" | "issue" | "headline";
export type ConvertTargetType = "metric" | "todo" | "issue" | "headline";

export interface UniversalConvertItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  departmentId?: string | null;
  picName?: string;
  picId?: string;
  priority?: "low" | "medium" | "high" | "critical";
  category?: "good_news" | "bad_news" | "reminder" | "announcement" | "achievement";
  attachments?: AttachmentInfo[];
  createdAt?: string;
  deadline?: string;
  target?: number;
  unit?: string;
}

export interface ConvertTargetFormProps {
  sourceType: ConvertSourceType;
  sourceItem: UniversalConvertItem;
  onCancel: () => void;
  onSuccess: () => void;
  onBack?: () => void;
  titleSuffix?: string;
}

const getDaysBetween = (startStr: string, endStr: string): number => {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  } catch {
    return 7;
  }
};

const getSourceTypeName = (type: ConvertSourceType): string => {
  switch (type) {
    case "metric": return "Scoreboard KPI";
    case "todo": return "Agenda Todo";
    case "issue": return "Masalah Issue";
    case "headline": return "Berita Headline";
    default: return "Item";
  }
};

export default function ConvertTargetForm({
  sourceType,
  sourceItem,
  onCancel,
  onSuccess,
  onBack
}: ConvertTargetFormProps) {
  const {
    currentProfile,
    departments,
    allProfiles,
    addMetric,
    addTodo,
    addHeadline,
    addIssue,
    deleteTodo,
    deleteIssue,
    deleteHeadline,
    deleteMetric,
    showToast,
    addHistoryLog
  } = useApp();

  const availableTargets: { type: ConvertTargetType; label: string; icon: React.ReactNode; desc: string }[] = [
    { type: "metric" as ConvertTargetType, label: "Scoreboard KPI", icon: <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />, desc: "Sasaran berkala mingguan/khusus" },
    { type: "todo" as ConvertTargetType, label: "Agenda Todo", icon: <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />, desc: "Tindakan eksekusi tim" },
    { type: "issue" as ConvertTargetType, label: "Masalah Issue", icon: <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />, desc: "Kendala untuk rapat IDS" },
    { type: "headline" as ConvertTargetType, label: "Berita Headline", icon: <Megaphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />, desc: "Pengumuman/pencapaian tim" },
  ].filter(t => t.type !== sourceType);

  const [targetType, setTargetType] = useState<ConvertTargetType>(availableTargets[0]?.type || "todo");

  // Form states (Pre-filled from sourceItem)
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deptId, setDeptId] = useState("");

  // PIC States
  const [selectedPicId, setSelectedPicId] = useState("");
  const [selectedPicName, setSelectedPicName] = useState("");

  // Target Specific States
  // Metric
  const [metricTarget, setMetricTarget] = useState<string>("100");
  const [metricUnit, setMetricUnit] = useState<"number" | "currency" | "percentage">("number");
  const [metricAccumulationMode, setMetricAccumulationMode] = useState<"sum" | "average">("sum");
  const [metricTargetType, setMetricTargetType] = useState<"higher_better" | "lower_better">("higher_better");
  const [metricCycle, setMetricCycle] = useState<"monthly" | "special">("monthly");
  const [metricDeadline, setMetricDeadline] = useState("");
  const [metricDurationDays, setMetricDurationDays] = useState(7);

  // Todo / Issue
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");

  // Headline
  const [headlineCategory, setHeadlineCategory] = useState<"good_news" | "bad_news" | "reminder" | "announcement" | "achievement">("announcement");

  // Attachment States
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentInfo[]>([]);
  const [linkInputUrl, setLinkInputUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate from sourceItem whenever sourceItem changes
  useEffect(() => {
    if (sourceItem) {
      setTitle(sourceItem.title || "");
      setDesc(sourceItem.description || sourceItem.content || "");
      setDeptId(sourceItem.departmentId || currentProfile.departmentId || departments[0]?.id || "");
      setSelectedPicId(sourceItem.picId || currentProfile.id);
      setSelectedPicName(sourceItem.picName || currentProfile.name);

      if (sourceItem.priority) {
        setPriority(sourceItem.priority);
      }
      if (sourceItem.category) {
        setHeadlineCategory(sourceItem.category);
      }
      if (sourceItem.attachments && Array.isArray(sourceItem.attachments)) {
        setAttachmentFiles([...sourceItem.attachments]);
      } else {
        setAttachmentFiles([]);
      }
      if (sourceItem.target) {
        setMetricTarget(String(sourceItem.target));
      }
      if (sourceItem.unit === "currency" || sourceItem.unit === "percentage" || sourceItem.unit === "number") {
        setMetricUnit(sourceItem.unit);
      }
    }
  }, [sourceItem, currentProfile, departments]);

  const handleDeptChange = (newDeptId: string) => {
    setDeptId(newDeptId);
    if (newDeptId === "global") {
      setSelectedPicId(currentProfile.id);
      setSelectedPicName(currentProfile.name);
    } else {
      const match = allProfiles.find(p => p.departmentId === newDeptId);
      if (match) {
        setSelectedPicId(match.id);
        setSelectedPicName(match.name);
      }
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`File ${file.name} melebihi batas 5MB`, "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        let type: "image" | "pdf" | "doc" = "doc";
        if (file.type.startsWith("image/")) type = "image";
        else if (file.type.includes("pdf")) type = "pdf";

        setAttachmentFiles((prev) => [
          ...prev,
          { name: file.name, size: file.size, type, dataUrl }
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleAddLink = () => {
    if (!linkInputUrl.trim()) return;
    let url = linkInputUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    setAttachmentFiles((prev) => [
      ...prev,
      {
        name: url.replace(/^https?:\/\//i, "").split("/")[0] || "Tautan Web",
        size: 0,
        type: "link",
        dataUrl: url
      }
    ]);
    setLinkInputUrl("");
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Judul tidak boleh kosong.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const targetDept = deptId || currentProfile.departmentId || departments[0]?.id || "";

      if (targetType === "metric") {
        if (metricCycle === "special" && !metricDeadline) {
          showToast("Harap tentukan batas deadline untuk metrik khusus.", "warning");
          setIsSubmitting(false);
          return;
        }

        const selectedPicObj = allProfiles.find(p => p.id === selectedPicId) || currentProfile;
        await addMetric({
          name: title.trim(),
          target: Number(metricTarget) || 100,
          unit: metricUnit,
          targetType: metricTargetType,
          departmentId: targetDept,
          picId: selectedPicObj.id,
          picName: selectedPicObj.name,
          keterangan: desc.trim(),
          cycleType: metricCycle,
          accumulationMode: metricAccumulationMode,
          durationDays: metricCycle === "special" ? metricDurationDays : 7,
          deadline: metricCycle === "special" && metricDeadline ? metricDeadline : undefined
        });
      } else if (targetType === "todo") {
        await addTodo({
          title: title.trim(),
          description: desc.trim(),
          priority: (priority === "critical" ? "high" : priority) as "low" | "medium" | "high",
          deadline: new Date().toISOString().split("T")[0],
          status: "pending",
          departmentId: targetDept,
          createdBy: selectedPicName || currentProfile.name,
          attachments: attachmentFiles
        });
      } else if (targetType === "headline") {
        await addHeadline({
          title: title.trim(),
          content: desc.trim() || title.trim(),
          category: headlineCategory,
          departmentId: targetDept === "global" ? null : targetDept,
          authorId: selectedPicId || currentProfile.id,
          authorName: selectedPicName || currentProfile.name,
          attachments: attachmentFiles
        });
      } else if (targetType === "issue") {
        await addIssue({
          title: title.trim(),
          description: desc.trim(),
          priority: priority,
          status: "open",
          departmentId: targetDept,
          picId: selectedPicId || currentProfile.id,
          picName: selectedPicName || currentProfile.name,
          attachments: attachmentFiles
        });
      }

      // Auto delete origin item from source
      if (sourceType === "todo") {
        deleteTodo(sourceItem.id);
      } else if (sourceType === "issue") {
        deleteIssue(sourceItem.id);
      } else if (sourceType === "headline") {
        deleteHeadline(sourceItem.id);
      } else if (sourceType === "metric") {
        deleteMetric(sourceItem.id);
      }

      addHistoryLog("Universal Convert", `Mengonversi ${getSourceTypeName(sourceType)} "${sourceItem.title}" ke ${targetType.toUpperCase()}`, targetDept);
      showToast("Berhasil dikonversi & diperbarui di sistem!", "success");
      onSuccess();
    } catch (err) {
      console.error("Convert error:", err);
      showToast("Gagal memproses konversi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSpecificDept = deptId && deptId !== "global";
  const deptPics = isSpecificDept ? allProfiles.filter(p => p.departmentId === deptId) : [];
  const otherPics = isSpecificDept ? allProfiles.filter(p => p.departmentId !== deptId) : allProfiles;

  const sourceDept = departments.find(d => d.id === sourceItem.departmentId);
  const sourceDeptName = sourceItem.departmentId === "global" ? "Semua Divisi (Global)" : (sourceDept ? `${sourceDept.name} Division` : "");

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-900">
      {/* Header Form with Breadcrumb & Back button */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-2.5 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Kembali ke Detail"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          )}

          {/* Breadcrumb Indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500 dark:text-zinc-400">Detail</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
            <span className="font-bold text-blue-600 dark:text-blue-400">
              Konversi Modul
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-all text-xs font-bold cursor-pointer"
          title="Tutup Modal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Content (Scrollable) */}
      <form onSubmit={handleConvert} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Source Context Mini-Card */}
        <div className="px-4 py-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200/70 dark:border-blue-900/50">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>Mengonversi dari: {getSourceTypeName(sourceType)}</span>
            {sourceDeptName && (
              <>
                <span>•</span>
                <span className="truncate">{sourceDeptName}</span>
              </>
            )}
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
            {sourceItem.title}
          </h4>
        </div>
        {/* Target Module Selector */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            Pilih Modul Tujuan <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {availableTargets.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => setTargetType(t.type)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 cursor-pointer ${
                  targetType === t.type
                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-slate-900 dark:text-white shadow-xs ring-1 ring-blue-500/30"
                    : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="p-1 rounded-md bg-slate-100 dark:bg-zinc-800 shrink-0 mt-0.5">
                  {t.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block leading-tight truncate">{t.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block mt-0.5 line-clamp-1">{t.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Title Field */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
            Judul Item Baru <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
            placeholder="Ketik judul item baru..."
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
            Deskripsi / Keterangan Baru
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white h-20 resize-none"
            placeholder="Detail pendukung atau catatan instruksi..."
          />
        </div>

        {/* Division & PIC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
              Divisi Terkait <span className="text-rose-500">*</span>
            </label>
            <select
              value={deptId}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="global">Semua Divisi (Global)</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name} Division</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
              PIC (Person In Charge) <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedPicId}
              onChange={(e) => {
                const found = allProfiles.find(p => p.id === e.target.value);
                if (found) {
                  setSelectedPicId(found.id);
                  setSelectedPicName(found.name);
                }
              }}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white cursor-pointer"
            >
              {deptPics.length > 0 ? (
                <>
                  <optgroup label="PIC Divisi Terkait">
                    {deptPics.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                    ))}
                  </optgroup>
                  {otherPics.length > 0 && (
                    <optgroup label="PIC Lainnya">
                      {otherPics.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                      ))}
                    </optgroup>
                  )}
                </>
              ) : (
                allProfiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* TARGET SPECIFIC CONFIG */}
        {/* Metric Settings */}
        {targetType === "metric" && (
          <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Pengaturan Target Metrik
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 mb-1">Target</label>
                <input
                  type="number"
                  value={metricTarget}
                  onChange={(e) => setMetricTarget(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 mb-1">Satuan</label>
                <select
                  value={metricUnit}
                  onChange={(e) => setMetricUnit(e.target.value as any)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs"
                >
                  <option value="number">Angka (Qty)</option>
                  <option value="percentage">Persen (%)</option>
                  <option value="currency">Rupiah (Rp)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 mb-1">Arah Target</label>
                <select
                  value={metricTargetType}
                  onChange={(e) => setMetricTargetType(e.target.value as any)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs"
                >
                  <option value="higher_better">&ge; Lebih Tinggi</option>
                  <option value="lower_better">&le; Lebih Rendah</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 mb-1">Metode Akumulasi</label>
                <select
                  value={metricAccumulationMode}
                  onChange={(e) => setMetricAccumulationMode(e.target.value as any)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs"
                >
                  <option value="sum">Penjumlahan (SUM)</option>
                  <option value="average">Rata-Rata (AVG)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 mb-1">Siklus</label>
                <select
                  value={metricCycle}
                  onChange={(e) => setMetricCycle(e.target.value as any)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs"
                >
                  <option value="monthly">Bulanan (4 Minggu)</option>
                  <option value="special">Khusus / Ad-Hoc</option>
                </select>
              </div>
            </div>

            {metricCycle === "special" && (
              <div className="pt-2 border-t border-slate-200 dark:border-zinc-700">
                <label className="block text-[10px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Batas Deadline Khusus <span className="text-rose-500">*</span>
                </label>
                <FormDatePicker
                  value={metricDeadline}
                  onChange={(val) => {
                    setMetricDeadline(val);
                    if (val) {
                      const todayStr = new Date().toISOString().split("T")[0];
                      const days = getDaysBetween(todayStr, val);
                      setMetricDurationDays(days);
                    }
                  }}
                  placeholder="Pilih batas tanggal deadline"
                />
              </div>
            )}
          </div>
        )}

        {/* Priority Selector (Todo / Issue) */}
        {(targetType === "todo" || targetType === "issue") && (
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              Prioritas <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { val: "low", label: "Low", color: "text-slate-600 border-slate-300" },
                { val: "medium", label: "Medium", color: "text-amber-600 border-amber-400" },
                { val: "high", label: "High", color: "text-orange-600 border-orange-400" },
                ...(targetType === "issue" ? [{ val: "critical", label: "Critical", color: "text-rose-600 border-rose-400" }] : [])
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setPriority(p.val as any)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    priority === p.val
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white shadow-2xs"
                      : `bg-white dark:bg-zinc-950 ${p.color}`
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category (Headline) */}
        {targetType === "headline" && (
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
              Kategori Berita <span className="text-rose-500">*</span>
            </label>
            <select
              value={headlineCategory}
              onChange={(e) => setHeadlineCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="announcement">Pengumuman (Announcement)</option>
              <option value="achievement">Pencapaian (Achievement)</option>
              <option value="good_news">Kabar Baik (Good News)</option>
              <option value="bad_news">Kendala / Kabar Buruk (Bad News)</option>
              <option value="reminder">Pengingat (Reminder)</option>
            </select>
          </div>
        )}

        {/* Attachments Section */}
        {targetType !== "metric" && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                Lampiran File / Tautan Web
              </label>
              <span className="text-[10px] text-slate-400">(Maks 5MB)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs text-slate-600 dark:text-zinc-300 cursor-pointer transition-colors">
                <Paperclip className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                />
              </label>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Tempel URL tautan..."
                  value={linkInputUrl}
                  onChange={(e) => setLinkInputUrl(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-2.5 py-1.5 text-xs font-bold bg-slate-800 text-white rounded-xl hover:bg-slate-700 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {attachmentFiles.length > 0 && (
              <div className="space-y-1 max-h-24 overflow-y-auto pt-1">
                {attachmentFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-800 dark:text-zinc-200">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachmentFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onBack || onCancel}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Konfirmasi Konversi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

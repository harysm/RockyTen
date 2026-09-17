"use client";

import React, { useState, useEffect } from "react";
import { useApp, AttachmentInfo } from "@/context/AppContext";
import { ArrowRight, RefreshCw, Sparkles, Check, AlertTriangle, FileText, X, Paperclip, Link as LinkIcon, ExternalLink, User, Calendar, Loader2 } from "lucide-react";

export type ConvertSourceType = "todo" | "headline" | "issue" | "metric";
export type ConvertTargetType = "todo" | "headline" | "issue" | "metric";

export interface UniversalConvertItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  departmentId?: string | null;
  priority?: string;
  category?: string;
  attachments?: AttachmentInfo[];
  picName?: string;
}

interface UniversalConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: ConvertSourceType;
  sourceItem: UniversalConvertItem | null;
}

const getDaysBetween = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return 7;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

export default function UniversalConvertModal({
  isOpen,
  onClose,
  sourceType,
  sourceItem
}: UniversalConvertModalProps) {
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
    updateTodoStatus,
    updateIssueStatus,
    showToast,
    addHistoryLog
  } = useApp();

  const availableTargets: { type: ConvertTargetType; label: string; icon: string; desc: string }[] = [
    { type: "metric" as ConvertTargetType, label: "Scoreboard KPI", icon: "🎯", desc: "Ubah jadi metrik target berkala" },
    { type: "todo" as ConvertTargetType, label: "Agenda Todo", icon: "📋", desc: "Ubah jadi tugas tindakan tim" },
    { type: "headline" as ConvertTargetType, label: "Berita Headline", icon: "📢", desc: "Ubah jadi pengumuman publik" },
    { type: "issue" as ConvertTargetType, label: "Masalah Issue", icon: "🚨", desc: "Ubah jadi kendala operasional" },
  ].filter(t => t.type !== sourceType);

  const [targetType, setTargetType] = useState<ConvertTargetType>(availableTargets[0]?.type || "todo");

  // Form states (Pre-filled)
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

  // Attachment States (For Todo, Headline, Issue)
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentInfo[]>([]);
  const [linkInputUrl, setLinkInputUrl] = useState("");
  const [linkInputName, setLinkInputName] = useState("");

  // Reset/Initialize form when sourceItem or isOpen changes
  useEffect(() => {
    if (sourceItem && isOpen) {
      const initialTitle = sourceItem.title || "";
      const initialDesc = sourceItem.description || sourceItem.content || "";
      const initialDept = sourceItem.departmentId || currentProfile.departmentId || (departments[0]?.id || "");

      setTitle(initialTitle);
      setDesc(initialDesc);
      setDeptId(initialDept);
      setAttachmentFiles(sourceItem.attachments ? [...sourceItem.attachments] : []);
      setLinkInputUrl("");
      setLinkInputName("");
      setMetricCycle("monthly");
      setMetricDeadline("");
      setMetricDurationDays(7);
      setMetricAccumulationMode("sum");

      // Auto-set PIC based on initialDept
      const matchingPics = initialDept && initialDept !== "global"
        ? allProfiles.filter(p => p.departmentId === initialDept)
        : allProfiles;

      if (matchingPics.length > 0) {
        setSelectedPicId(matchingPics[0].id);
        setSelectedPicName(matchingPics[0].name);
      } else {
        setSelectedPicId(currentProfile.id);
        setSelectedPicName(sourceItem.picName || currentProfile.name);
      }

      // Set default target
      const firstTarget = availableTargets[0]?.type || "todo";
      setTargetType(firstTarget);
    }
  }, [sourceItem, isOpen]);

  if (!isOpen || !sourceItem) return null;

  // Handle Division Change & Auto Update PIC
  const handleDeptChange = (newDept: string) => {
    setDeptId(newDept);

    if (newDept && newDept !== "global") {
      const matchingPics = allProfiles.filter(p => p.departmentId === newDept);
      if (matchingPics.length > 0) {
        setSelectedPicId(matchingPics[0].id);
        setSelectedPicName(matchingPics[0].name);
        return;
      }
    }

    // Fallback if global or no PIC found for that division
    setSelectedPicId(currentProfile.id);
    setSelectedPicName(currentProfile.name);
  };

  // Handle PIC Selection Change
  const handlePicChange = (pid: string) => {
    setSelectedPicId(pid);
    const prof = allProfiles.find(p => p.id === pid);
    if (prof) {
      setSelectedPicName(prof.name);
    }
  };

  // Handle File Selection
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);

    const newAtts: AttachmentInfo[] = [];
    let processedCount = 0;

    selectedFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`⚠️ Ukuran file "${file.name}" melebihi batas 5MB.`);
        processedCount++;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newAtts.push({
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          dataUrl: reader.result as string,
        });
        processedCount++;
        if (processedCount === selectedFiles.length) {
          setAttachmentFiles((prev) => [...prev, ...newAtts]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // Handle Add Link
  const handleAddLink = () => {
    if (!linkInputUrl.trim()) {
      alert("⚠️ Harap isi URL link terlebih dahulu.");
      return;
    }

    let finalUrl = linkInputUrl.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }

    const linkName = linkInputName.trim() || finalUrl;

    setAttachmentFiles((prev) => [
      ...prev,
      {
        name: linkName,
        size: 0,
        type: "link",
        dataUrl: finalUrl,
      },
    ]);

    setLinkInputUrl("");
    setLinkInputName("");
  };

  const getSourceTypeName = (st: ConvertSourceType) => {
    switch (st) {
      case "todo": return "Agenda Todo";
      case "headline": return "Berita Headline";
      case "issue": return "Masalah Issue";
      case "metric": return "Scoreboard KPI";
    }
  };

  const getSourceBadgeColor = (st: ConvertSourceType) => {
    switch (st) {
      case "todo": return "bg-blue-50 text-blue-600 border-blue-200";
      case "headline": return "bg-purple-50 text-purple-600 border-purple-200";
      case "issue": return "bg-rose-50 text-rose-600 border-rose-200";
      case "metric": return "bg-amber-50 text-amber-600 border-amber-200";
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      showToast("Koneksi terputus! Mohon periksa internet Anda.", "error");
      return;
    }
    if (!title.trim()) {
      alert("⚠️ Judul tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);
    try {
      const targetDept = deptId || currentProfile.departmentId || departments[0]?.id || "";

      if (targetType === "metric") {
        if (metricCycle === "special" && !metricDeadline) {
          alert("⚠️ Harap tentukan Tanggal Deadline untuk metrik khusus Ad-Hoc.");
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

      // Auto delete origin item on convert
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
      showToast("Berhasil dikonversi & diverifikasi di database!", "success");
      onClose();
    } catch (err) {
      console.error("Convert error:", err);
      showToast("⚠️ Gagal memproses konversi ke database.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered PIC list for dropdown: prioritize PICs of selected department
  const isSpecificDept = deptId && deptId !== "global";
  const deptPics = isSpecificDept ? allProfiles.filter(p => p.departmentId === deptId) : [];
  const otherPics = isSpecificDept ? allProfiles.filter(p => p.departmentId !== deptId) : allProfiles;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[92vh] rounded-3xl shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-full border ${getSourceBadgeColor(sourceType)} flex items-center gap-1`}>
                <RefreshCw className="w-3 h-3 animate-spin-slow" /> {getSourceTypeName(sourceType)}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Konversi Silang</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
              Konversi Tipe Item
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Item Preview Box */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 mb-4 flex-shrink-0">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Item Asal</span>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{sourceItem.title}</h4>
          {(sourceItem.description || sourceItem.content) && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{sourceItem.description || sourceItem.content}</p>
          )}
        </div>

        <form onSubmit={handleConvert} className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Target Type Selector */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Pilih Modul Tujuan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableTargets.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setTargetType(t.type)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    targetType === t.type
                      ? "bg-red-50 dark:bg-red-950/40 border-red-500 dark:border-red-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-red-500/20"
                      : "bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <span className="text-lg mb-1">{t.icon}</span>
                  <div>
                    <span className="text-xs font-bold block leading-tight">{t.label}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 line-clamp-1">{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Judul Item Baru <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-900 dark:text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi / Detail
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-900 dark:text-white h-20 resize-none"
            />
          </div>

          {/* Division Selector & PIC Selector (Responsive 1/2 Column Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Divisi Terkait <span className="text-red-500">*</span>
              </label>
              <select
                value={deptId}
                onChange={(e) => handleDeptChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="global">Semua Divisi (Global)</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} Division</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>PIC Penanggung Jawab</span>
              </label>
              <select
                value={selectedPicId}
                onChange={(e) => handlePicChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none text-slate-900 dark:text-white cursor-pointer"
              >
                {deptPics.length > 0 ? (
                  <>
                    <optgroup label={`PIC Divisi (${departments.find(d => d.id === deptId)?.name || 'Terpilih'})`}>
                      {deptPics.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.role})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="PIC Divisi Lain">
                      {otherPics.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({departments.find(d => d.id === p.departmentId)?.name || p.role})
                        </option>
                      ))}
                    </optgroup>
                  </>
                ) : (
                  allProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({departments.find(d => d.id === p.departmentId)?.name || p.role})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* TARGET DYNAMIC FIELDS */}

          {/* Target: METRIC */}
          {targetType === "metric" && (
            <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <span>🎯</span> Pengaturan Target Scoreboard
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Target Angka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={metricTarget}
                    onChange={(e) => setMetricTarget(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Unit Satuan
                  </label>
                  <select
                    value={metricUnit}
                    onChange={(e) => {
                      const u = e.target.value as any;
                      setMetricUnit(u);
                    }}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="number">Angka Murni (Number)</option>
                    <option value="currency">Rupiah (Rp)</option>
                    <option value="percentage">Persentase (%)</option>
                    <option value="boolean">Boolean (Ya / Tidak)</option>
                  </select>
                </div>
              </div>

              {/* Accumulation Mode for number / currency / percentage */}
              {(metricUnit === "number" || metricUnit === "currency" || metricUnit === "percentage") && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Metode Akumulasi Harian ke Mingguan
                  </label>
                  <select
                    value={metricAccumulationMode}
                    onChange={(e) => setMetricAccumulationMode(e.target.value as "sum" | "average")}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="sum">➕ Total Penjumlahan (SUM) — Input harian dijumlahkan</option>
                    <option value="average">📊 Rata-Rata (AVG) — Input harian dirata-ratakan</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Evaluasi Target
                  </label>
                  <select
                    value={metricTargetType}
                    onChange={(e) => setMetricTargetType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="higher_better">📈 Makin Tinggi Makin Baik</option>
                    <option value="lower_better">📉 Makin Rendah Makin Baik</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Jenis Siklus KPI
                  </label>
                  <select
                    value={metricCycle}
                    onChange={(e) => setMetricCycle(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="monthly">📅 Bulanan (Routine KPI)</option>
                    <option value="special">⚡ Khusus (Ad-Hoc / Event)</option>
                  </select>
                </div>
              </div>

              {/* Special / Ad-Hoc Metric Deadline Picker */}
              {metricCycle === "special" && (
                <div className="pt-1 space-y-2 border-t border-amber-200/50 dark:border-amber-900/30 mt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Tanggal Deadline (Tenggat Waktu) <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="date"
                      required
                      value={metricDeadline}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        const dl = e.target.value;
                        setMetricDeadline(dl);
                        const today = new Date().toISOString().split("T")[0];
                        const days = getDaysBetween(today, dl);
                        setMetricDurationDays(days);
                      }}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white dark:[color-scheme:dark] cursor-pointer"
                    />
                  </div>
                  {metricDeadline && (
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 font-medium bg-amber-100/50 dark:bg-amber-900/30 p-2 rounded-lg border border-amber-200/50 dark:border-amber-800/40">
                      Durasi Terhitung: <strong className="text-red-600 dark:text-red-400">{metricDurationDays} Hari</strong> (Dibuat s.d Deadline)
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Target: TODO */}
          {targetType === "todo" && (
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-blue-800 dark:text-blue-400 flex items-center gap-1.5">
                <span>📋</span> Pengaturan Agenda Todo
              </h5>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Tingkat Prioritas</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-1.5 text-xs font-bold rounded-xl border capitalize transition-all cursor-pointer ${
                        priority === p
                          ? p === "high"
                            ? "bg-rose-500 text-white border-rose-500"
                            : p === "medium"
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Target: HEADLINE */}
          {targetType === "headline" && (
            <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/40 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-purple-800 dark:text-purple-400 flex items-center gap-1.5">
                <span>📢</span> Kategori Headline
              </h5>
              <select
                value={headlineCategory}
                onChange={(e) => setHeadlineCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="good_news">🎉 Good News</option>
                <option value="bad_news">⚠️ Bad News</option>
                <option value="reminder">📌 Reminder</option>
                <option value="announcement">📢 Announcement</option>
                <option value="achievement">🏆 Achievement</option>
              </select>
            </div>
          )}

          {/* Target: ISSUE */}
          {targetType === "issue" && (
            <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
                <span>🚨</span> Pengaturan Issue Kendala
              </h5>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">Prioritas Masalah</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                  <option value="critical">🚨 Critical</option>
                </select>
              </div>
            </div>
          )}

          {/* ATTACHMENT SECTION (FILE + LINK) - Only for Headline, Todo, and Issue */}
          {(targetType === "headline" || targetType === "todo" || targetType === "issue") && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Lampiran File & Link Tautan (Opsional)
              </label>

              {/* File Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-3 text-center cursor-pointer transition-colors block bg-slate-50/50 dark:bg-slate-950/50">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                  accept="image/*,.pdf,.xls,.xlsx,.csv,.ppt,.pptx"
                />
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Paperclip className="w-4 h-4 text-slate-400" />
                  <span>Pilih File Lampiran...</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Foto, PDF, Excel, CSV, PPT (Maks 5MB/file)
                </p>
              </label>

              {/* Add External Link Section */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Sematkan Link / URL Tautan</span>
                </div>
                <div className="space-y-2 min-w-0">
                  <input
                    type="url"
                    value={linkInputUrl}
                    onChange={(e) => setLinkInputUrl(e.target.value)}
                    placeholder="URL Link (cth: https://drive.google.com/...)"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
                  <div className="flex gap-2 min-w-0">
                    <input
                      type="text"
                      value={linkInputName}
                      onChange={(e) => setLinkInputName(e.target.value)}
                      placeholder="Nama / Label Link (Opsional)..."
                      className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                    >
                      + Link
                    </button>
                  </div>
                </div>
              </div>

              {/* List of Attached Files & Links */}
              {attachmentFiles.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Daftar Lampiran ({attachmentFiles.length})
                  </span>
                  {attachmentFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs">
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                        {file.type === "link" || file.dataUrl?.startsWith("http") ? (
                          <>
                            <ExternalLink className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <a
                              href={file.dataUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 font-bold truncate hover:underline"
                            >
                              {file.name}
                            </a>
                            <span className="text-[9px] text-slate-400 font-medium flex-shrink-0">(Link Tautan)</span>
                          </>
                        ) : (
                          <>
                            <Paperclip className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-800 dark:text-slate-200 font-bold truncate">{file.name}</span>
                            {file.size > 0 && (
                              <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachmentFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 font-bold text-xs p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Action */}
          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-xl shadow-md shadow-zinc-900/10 transition-all flex items-center gap-1.5 cursor-pointer border border-zinc-900 dark:border-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white dark:text-zinc-950" />
                  <span>Verifikasi & Memasukkan Data ke Database...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-white dark:text-zinc-950" />
                  <span>Konversi Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

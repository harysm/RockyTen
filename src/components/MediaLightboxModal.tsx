"use client";

import React, { useEffect } from "react";
import { X, Download, FileImage, Video, ExternalLink } from "lucide-react";
import { MediaPreviewItem } from "@/utils/attachmentUtils";

interface MediaLightboxModalProps {
  media: MediaPreviewItem | null;
  onClose: () => void;
}

export default function MediaLightboxModal({
  media,
  onClose
}: MediaLightboxModalProps) {
  useEffect(() => {
    if (!media) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [media, onClose]);

  if (!media) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = media.url;
    link.download = media.name || (media.type === "video" ? "video.mp4" : "photo.png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Floating Control Bar */}
      <div
        className="w-full max-w-4xl flex items-center justify-between pb-3 text-white px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0 pr-4">
          {media.type === "video" ? (
            <Video className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <FileImage className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-bold truncate">
            {media.name || (media.type === "video" ? "Video Lampiran" : "Foto Lampiran")}
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-extrabold px-2 py-0.5 bg-white/10 rounded-md text-white/80">
            {media.type === "video" ? "Video Player" : "In-App Photo Viewer"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            title="Unduh File Media"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            title="Tutup (Esc)"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media Content Display */}
      <div
        className="relative max-w-4xl max-h-[82vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950/60 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {media.type === "video" ? (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-w-full max-h-[80vh] w-auto h-auto rounded-xl object-contain bg-black shadow-lg"
          >
            Browser Anda tidak mendukung pemutaran video.
          </video>
        ) : (
          <img
            src={media.url}
            alt={media.name || "Foto Lampiran"}
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-xl select-none"
          />
        )}
      </div>

      {/* Bottom Hint */}
      <p className="text-[11px] text-white/50 pt-3">
        Tekan <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/80">Esc</kbd> atau klik di luar untuk menutup
      </p>
    </div>
  );
}

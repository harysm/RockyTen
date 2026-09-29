// src/utils/attachmentUtils.ts

export interface MediaPreviewItem {
  url: string;
  name?: string;
  type: "image" | "video";
}

const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif", "ico"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "m4v", "avi", "mkv"];

export const getFileExtension = (filename: string = ""): string => {
  const parts = filename.split("?")[0].split("#")[0].split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
};

export const isPhotoAttachment = (name: string = "", type: string = "", dataUrl: string = ""): boolean => {
  const ext = getFileExtension(name);
  if (PHOTO_EXTENSIONS.includes(ext)) return true;
  if (type && type.startsWith("image/")) return true;
  if (dataUrl && dataUrl.startsWith("data:image/")) return true;
  if (dataUrl && PHOTO_EXTENSIONS.some((e) => dataUrl.toLowerCase().includes(`.${e}`))) return true;
  return false;
};

export const isVideoAttachment = (name: string = "", type: string = "", dataUrl: string = ""): boolean => {
  const ext = getFileExtension(name);
  if (VIDEO_EXTENSIONS.includes(ext)) return true;
  if (type && type.startsWith("video/")) return true;
  if (dataUrl && dataUrl.startsWith("data:video/")) return true;
  if (dataUrl && VIDEO_EXTENSIONS.some((e) => dataUrl.toLowerCase().includes(`.${e}`))) return true;
  return false;
};

export const isMediaAttachment = (name: string = "", type: string = "", dataUrl: string = ""): boolean => {
  return isPhotoAttachment(name, type, dataUrl) || isVideoAttachment(name, type, dataUrl);
};

export const getMimeTypeFromDataUrl = (dataUrl: string, fallbackType: string = "", filename: string = ""): string => {
  if (dataUrl.startsWith("data:")) {
    const match = dataUrl.match(/^data:([^;]+);/);
    if (match && match[1]) return match[1];
  }
  if (fallbackType && fallbackType !== "doc" && fallbackType !== "link") {
    return fallbackType;
  }
  const ext = getFileExtension(filename);
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xls":
      return "application/vnd.ms-excel";
    case "csv":
      return "text/csv";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc":
      return "application/msword";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "txt":
      return "text/plain";
    case "zip":
      return "application/zip";
    case "rar":
      return "application/x-rar-compressed";
    default:
      return "application/octet-stream";
  }
};

/**
 * Handle opening attachments:
 * - Photo & Video: Opens in-app lightbox modal directly inside the web app (zero new tab)
 * - Non-photo/video (Excel, CSV, PDF, Word, links, etc.): Opens in a new tab (_blank)
 */
export const handleAttachmentClick = (
  att: { name: string; dataUrl?: string; type?: string },
  onOpenInAppMedia?: (media: MediaPreviewItem) => void
) => {
  const { name, dataUrl, type = "" } = att;
  if (!dataUrl) {
    alert("Data file tidak ditemukan.");
    return;
  }

  // 1. If it's a photo or video: open directly inside our web app without leaving to a new tab!
  if (isMediaAttachment(name, type, dataUrl)) {
    const isVid = isVideoAttachment(name, type, dataUrl);
    if (onOpenInAppMedia) {
      onOpenInAppMedia({
        url: dataUrl,
        name: name || "Media Lampiran",
        type: isVid ? "video" : "image"
      });
      return;
    }
  }

  // 2. For files OUTSIDE photo or video (Excel, CSV, PDF, Word, links, etc.): Open in a new tab!
  if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
    window.open(dataUrl, "_blank", "noopener,noreferrer");
    return;
  }

  // For base64 data URLs:
  try {
    const parts = dataUrl.split(",");
    if (parts.length < 2) {
      window.open(dataUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const mime = getMimeTypeFromDataUrl(dataUrl, type, name);
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const blobUrl = URL.createObjectURL(blob);

    // Open in new tab
    const newWindow = window.open(blobUrl, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      // Fallback if popup blocker intercepted window.open
      const link = document.createElement("a");
      link.href = blobUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (err) {
    console.error("Gagal membuka file lampiran:", err);
    window.open(dataUrl, "_blank", "noopener,noreferrer");
  }
};

/**
 * Client-side WebP image compression utility for Scoreboard Nasi Gerilya.
 * Reduces camera photos (5MB - 10MB) to ultra-ringan WebP (~30KB - 60KB).
 */

export interface CompressedImageResult {
  dataUrl: string;
  size: number;
  name: string;
  type: string;
}

export const compressImageFile = (
  file: File,
  maxDimension = 900,
  quality = 0.75
): Promise<CompressedImageResult> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type) {
      reject(new Error("File tidak valid"));
      return;
    }

    // For non-image files (PDF, DOCX, XLSX): return standard DataURL
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = (e.target?.result as string) || "";
        resolve({
          dataUrl: resultUrl,
          size: file.size,
          name: file.name,
          type: file.type
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    // For images: Compress using HTML5 Canvas API to WebP
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          const rawUrl = (event.target?.result as string) || "";
          resolve({
            dataUrl: rawUrl,
            size: file.size,
            name: file.name,
            type: file.type
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export to WebP format
        const compressedDataUrl = canvas.toDataURL("image/webp", quality);
        const base64Head = "data:image/webp;base64,";
        const base64Str = compressedDataUrl.startsWith(base64Head)
          ? compressedDataUrl.substring(base64Head.length)
          : compressedDataUrl;
        const compressedSize = Math.round((base64Str.length * 3) / 4);

        const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

        resolve({
          dataUrl: compressedDataUrl,
          size: compressedSize,
          name: newName,
          type: "image/webp"
        });
      };
      img.onerror = (err) => reject(err);
      img.src = (event.target?.result as string) || "";
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

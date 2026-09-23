$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class ImageProcessor {
    public static void Process(string srcPath, string destPath) {
        using (Bitmap src = new Bitmap(srcPath)) {
            int w = src.Width;
            int h = src.Height;
            using (Bitmap dest = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
                BitmapData srcData = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                BitmapData destData = dest.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

                int bytes = Math.Abs(srcData.Stride) * h;
                byte[] rgbValues = new byte[bytes];
                Marshal.Copy(srcData.Scan0, rgbValues, 0, bytes);

                // Pixel format is BGRA (B=0, G=1, R=2, A=3)
                for (int i = 0; i < bytes; i += 4) {
                    byte b = rgbValues[i];
                    byte g = rgbValues[i + 1];
                    byte r = rgbValues[i + 2];
                    
                    int brightness = (r + g + b) / 3;
                    
                    // Background is uniform light (white/light gray)
                    if (brightness >= 244) {
                        rgbValues[i + 3] = 0; // Transparent
                    } else if (brightness >= 232) {
                        // Smooth feathering
                        int alpha = (int)(255 * (244 - brightness) / 12.0);
                        if (alpha < 0) alpha = 0;
                        if (alpha > 255) alpha = 255;
                        rgbValues[i + 3] = (byte)alpha;
                    } else {
                        rgbValues[i + 3] = 255; // Fully opaque
                    }
                }

                Marshal.Copy(rgbValues, 0, destData.Scan0, bytes);
                src.UnlockBits(srcData);
                dest.UnlockBits(destData);

                dest.Save(destPath, ImageFormat.Png);
            }
        }
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$src = "C:\Users\Haxxs\.gemini\antigravity-ide\brain\04252a24-efec-4df7-9c37-4910a4f06ca5\docs_3d_book_1790200790422.jpg"
$dest = "d:\Kerjaan\RockyTen\public\docs_3d_book_transparent.png"

[ImageProcessor]::Process($src, $dest)
Write-Host "Processed in milliseconds! Saved to $dest"

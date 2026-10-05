$csharp = @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class HeinekenBgFixer {
    public static void Process(string inputPath, string outputPath) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int width = src.Width;
            int height = src.Height;

            using (Bitmap dest = new Bitmap(width, height, PixelFormat.Format32bppArgb)) {
                BitmapData srcData = src.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                BitmapData destData = dest.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

                int stride = srcData.Stride;
                int totalBytes = stride * height;
                byte[] srcBytes = new byte[totalBytes];
                byte[] destBytes = new byte[totalBytes];

                System.Runtime.InteropServices.Marshal.Copy(srcData.Scan0, srcBytes, 0, totalBytes);

                bool[] isBg = new bool[width * height];
                float[] bgWeight = new float[width * height];

                // Pixel classification
                Func<int, int, bool> isBgPixel = (x, y) => {
                    int idx = y * stride + x * 4;
                    byte b = srcBytes[idx];
                    byte g = srcBytes[idx + 1];
                    byte r = srcBytes[idx + 2];

                    int maxC = Math.Max(r, Math.Max(g, b));
                    int minC = Math.Min(r, Math.Min(g, b));
                    int diff = maxC - minC;

                    // Definite white
                    if (minC >= 250 && diff <= 10) return true;

                    // Slate grey studio vignette
                    if (minC >= 165 && diff <= 18) return true;

                    // Upper half background
                    if (y < height * 0.78 && minC >= 155 && diff <= 24) return true;

                    // Table sides (left of hops: x < 240, right of hops: x > 880)
                    if (y >= height * 0.78 && (x < 240 || x > 880) && minC >= 155 && diff <= 25) return true;

                    return false;
                };

                // Queue for BFS flood fill
                Queue<int> queue = new Queue<int>();

                // Seed borders
                for (int x = 0; x < width; x++) {
                    if (isBgPixel(x, 0)) { isBg[0 * width + x] = true; queue.Enqueue(0 * width + x); }
                    if (isBgPixel(x, height - 1)) { isBg[(height - 1) * width + x] = true; queue.Enqueue((height - 1) * width + x); }
                }
                for (int y = 0; y < height; y++) {
                    if (isBgPixel(0, y)) { isBg[y * width + 0] = true; queue.Enqueue(y * width + 0); }
                    if (isBgPixel(width - 1, y)) { isBg[y * width + (width - 1)] = true; queue.Enqueue(y * width + (width - 1)); }
                }

                int[] dx = { -1, 1, 0, 0, -1, 1, -1, 1 };
                int[] dy = { 0, 0, -1, 1, -1, -1, 1, 1 };

                while (queue.Count > 0) {
                    int curr = queue.Dequeue();
                    int cx = curr % width;
                    int cy = curr / width;

                    for (int i = 0; i < 8; i++) {
                        int nx = cx + dx[i];
                        int ny = cy + dy[i];

                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            int nIdx = ny * width + nx;
                            if (!isBg[nIdx] && isBgPixel(nx, ny)) {
                                isBg[nIdx] = true;
                                queue.Enqueue(nIdx);
                            }
                        }
                    }
                }

                // Smooth edge blending: distance to foreground
                // For pixels flagged as background:
                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        int p = y * width + x;
                        int idx = y * stride + x * 4;

                        byte b = srcBytes[idx];
                        byte g = srcBytes[idx + 1];
                        byte r = srcBytes[idx + 2];

                        int maxC = Math.Max(r, Math.Max(g, b));
                        int minC = Math.Min(r, Math.Min(g, b));
                        int diff = maxC - minC;

                        if (isBg[p]) {
                            // Check if near non-bg (edge anti-aliasing)
                            bool nearFg = false;
                            for (int k = 0; k < 8; k++) {
                                int qx = x + dx[k];
                                int qy = y + dy[k];
                                if (qx >= 0 && qx < width && qy >= 0 && qy < height) {
                                    if (!isBg[qy * width + qx]) { nearFg = true; break; }
                                }
                            }

                            if (nearFg && diff > 10) {
                                // Transition pixel: smooth blend towards white
                                float factor = 0.5f;
                                destBytes[idx] = (byte)Math.Min(255, (int)(b * (1 - factor) + 255 * factor));
                                destBytes[idx + 1] = (byte)Math.Min(255, (int)(g * (1 - factor) + 255 * factor));
                                destBytes[idx + 2] = (byte)Math.Min(255, (int)(r * (1 - factor) + 255 * factor));
                                destBytes[idx + 3] = 255;
                            } else {
                                // Pure white
                                destBytes[idx] = 255;
                                destBytes[idx + 1] = 255;
                                destBytes[idx + 2] = 255;
                                destBytes[idx + 3] = 255;
                            }
                        } else {
                            // Foreground:
                            // Apply gentle bottom table reflection fade (soft gradient into pure white like Amstel)
                            if (y >= 1260) {
                                float vertFade = (float)(y - 1260) / (height - 1260); // 0 to 1
                                vertFade = vertFade * vertFade; // quadratic soft falloff

                                // Blend towards white
                                destBytes[idx] = (byte)Math.Min(255, (int)(b * (1 - vertFade) + 255 * vertFade));
                                destBytes[idx + 1] = (byte)Math.Min(255, (int)(g * (1 - vertFade) + 255 * vertFade));
                                destBytes[idx + 2] = (byte)Math.Min(255, (int)(r * (1 - vertFade) + 255 * vertFade));
                                destBytes[idx + 3] = 255;
                            } else {
                                // Also remove faint slate tint on edges if high brightness
                                if (minC > 230 && diff < 12) {
                                    int boost = 255 - minC;
                                    destBytes[idx] = (byte)Math.Min(255, b + boost);
                                    destBytes[idx + 1] = (byte)Math.Min(255, g + boost);
                                    destBytes[idx + 2] = (byte)Math.Min(255, r + boost);
                                    destBytes[idx + 3] = 255;
                                } else {
                                    destBytes[idx] = b;
                                    destBytes[idx + 1] = g;
                                    destBytes[idx + 2] = r;
                                    destBytes[idx + 3] = 255;
                                }
                            }
                        }
                    }
                }

                System.Runtime.InteropServices.Marshal.Copy(destBytes, 0, destData.Scan0, totalBytes);
                src.UnlockBits(srcData);
                dest.UnlockBits(destData);

                dest.Save(outputPath, ImageFormat.Png);
            }
        }
    }
}
'@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies "System.Drawing.dll"
[HeinekenBgFixer]::Process("heinken.png", "public/products/heineken_test2.png")
Write-Host "Processed heineken_test2.png successfully!"

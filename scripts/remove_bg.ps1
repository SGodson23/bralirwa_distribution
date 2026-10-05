$csharpSource = @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class ImageBgRemover {
    public static void Process(string inputPath, string outputPath, int threshold = 232) {
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

                bool[] visited = new bool[width * height];
                Queue<int> queue = new Queue<int>();

                // Helper to check white
                Func<int, int, bool> isWhite = (x, y) => {
                    int idx = y * stride + x * 4;
                    byte b = srcBytes[idx];
                    byte g = srcBytes[idx + 1];
                    byte r = srcBytes[idx + 2];
                    return r >= threshold && g >= threshold && b >= threshold;
                };

                // Seed borders
                for (int x = 0; x < width; x++) {
                    if (isWhite(x, 0)) { visited[0 * width + x] = true; queue.Enqueue(0 * width + x); }
                    if (isWhite(x, height - 1)) { visited[(height - 1) * width + x] = true; queue.Enqueue((height - 1) * width + x); }
                }
                for (int y = 0; y < height; y++) {
                    if (isWhite(0, y)) { visited[y * width + 0] = true; queue.Enqueue(y * width + 0); }
                    if (isWhite(width - 1, y)) { visited[y * width + (width - 1)] = true; queue.Enqueue(y * width + (width - 1)); }
                }

                // BFS flood fill
                while (queue.Count > 0) {
                    int curr = queue.Dequeue();
                    int cx = curr % width;
                    int cy = curr / width;

                    if (cx > 0 && !visited[cy * width + (cx - 1)] && isWhite(cx - 1, cy)) {
                        visited[cy * width + (cx - 1)] = true;
                        queue.Enqueue(cy * width + (cx - 1));
                    }
                    if (cx < width - 1 && !visited[cy * width + (cx + 1)] && isWhite(cx + 1, cy)) {
                        visited[cy * width + (cx + 1)] = true;
                        queue.Enqueue(cy * width + (cx + 1));
                    }
                    if (cy > 0 && !visited[(cy - 1) * width + cx] && isWhite(cx, cy - 1)) {
                        visited[(cy - 1) * width + cx] = true;
                        queue.Enqueue((cy - 1) * width + cx);
                    }
                    if (cy < height - 1 && !visited[(cy + 1) * width + cx] && isWhite(cx, cy + 1)) {
                        visited[(cy + 1) * width + cx] = true;
                        queue.Enqueue((cy + 1) * width + cx);
                    }
                }

                // Construct destination with smooth transparency
                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        int p = y * width + x;
                        int idx = y * stride + x * 4;

                        byte b = srcBytes[idx];
                        byte g = srcBytes[idx + 1];
                        byte r = srcBytes[idx + 2];

                        if (visited[p]) {
                            destBytes[idx] = 0;
                            destBytes[idx + 1] = 0;
                            destBytes[idx + 2] = 0;
                            destBytes[idx + 3] = 0;
                        } else {
                            int minChannel = Math.Min(r, Math.Min(g, b));
                            if (minChannel > 235) {
                                byte alpha = (byte)Math.Max(0, Math.Min(255, (255 - minChannel) * 14));
                                destBytes[idx] = b;
                                destBytes[idx + 1] = g;
                                destBytes[idx + 2] = r;
                                destBytes[idx + 3] = alpha;
                            } else {
                                destBytes[idx] = b;
                                destBytes[idx + 1] = g;
                                destBytes[idx + 2] = r;
                                destBytes[idx + 3] = 255;
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

Add-Type -TypeDefinition $csharpSource -ReferencedAssemblies "System.Drawing.dll"

$targetDir = (Resolve-Path "public/products").Path

$images = @(
    @{ In = "Amstel.png"; Out = "amstel.png" },
    @{ In = "Desperados.png"; Out = "desperados.png" },
    @{ In = "Turbo King.png"; Out = "turbo-king.png" },
    @{ In = "primus.png"; Out = "primus.png" },
    @{ In = "heinken.png"; Out = "heineken.png" },
    @{ In = "cocacola.png"; Out = "cocacola.png" },
    @{ In = "fanta orange.png"; Out = "fanta-orange.png" },
    @{ In = "fanta citron.png"; Out = "fanta-citron.png" },
    @{ In = "fanta pineapple.png"; Out = "fanta-pineapple.png" },
    @{ In = "cheetah energy drink.png"; Out = "cheetah.png" }
)

foreach ($item in $images) {
    if (Test-Path $item.In) {
        $inPath = (Get-Item $item.In).FullName
        $outPath = Join-Path $targetDir $item.Out
        Write-Host "Processing $inPath -> $outPath..."
        [ImageBgRemover]::Process($inPath, $outPath, 235)
    }
}

# Special handling for Mutzig and Vital'o
$mutzig = Get-Item "*tzig*.png" | Where-Object { $_.DirectoryName -notmatch "public" } | Select-Object -First 1
if ($mutzig) {
    $outPath = Join-Path $targetDir "mutzig.png"
    Write-Host "Processing $($mutzig.FullName) -> $outPath..."
    [ImageBgRemover]::Process($mutzig.FullName, $outPath, 235)
}

$vitalo = Get-Item "*ital*.png" | Where-Object { $_.DirectoryName -notmatch "public" } | Select-Object -First 1
if ($vitalo) {
    $outPath = Join-Path $targetDir "vitalo.png"
    Write-Host "Processing $($vitalo.FullName) -> $outPath..."
    [ImageBgRemover]::Process($vitalo.FullName, $outPath, 235)
}

# Sprite
$sprite = Get-Item "public/products/sprite.jpg" -ErrorAction SilentlyContinue
if ($sprite) {
    $outPath = Join-Path $targetDir "sprite.png"
    Write-Host "Processing $($sprite.FullName) -> $outPath..."
    [ImageBgRemover]::Process($sprite.FullName, $outPath, 220)
}

Write-Host "ALL IMAGES SUCCESSFULLY PROCESSED WITH BACKGROUND REMOVED!"

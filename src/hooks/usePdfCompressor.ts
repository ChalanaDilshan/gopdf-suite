"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type CompressionLevel = "extreme" | "recommended" | "basic";

export interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  totalPages: number;
}

export interface UsePdfCompressorReturn {
  isCompressing: boolean;
  progress: number; // 0 to 100
  statusMessage: string;
  downloadUrl: string | null;
  outputFileName: string | null;
  stats: CompressionStats | null;
  error: string | null;
  compressPdf: (
    file: File,
    level: CompressionLevel,
    customName?: string
  ) => Promise<string | null>;
  reset: () => void;
}

interface DecodedImage {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, targetW: number, targetH: number) => void;
  cleanup: () => void;
}

async function decodeBlobToImage(blob: Blob): Promise<DecodedImage | null> {
  if (typeof createImageBitmap !== "undefined") {
    try {
      const bitmap = await createImageBitmap(blob);
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, targetW, targetH) => {
          ctx.drawImage(bitmap, 0, 0, targetW, targetH);
        },
        cleanup: () => {
          bitmap.close();
        },
      };
    } catch {
      // Fall through to Image element
    }
  }

  if (typeof window !== "undefined") {
    try {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image decode failed"));
        img.src = url;
      });
      return {
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        draw: (ctx, targetW, targetH) => {
          ctx.drawImage(img, 0, 0, targetW, targetH);
        },
        cleanup: () => {
          URL.revokeObjectURL(url);
        },
      };
    } catch {
      return null;
    }
  }

  return null;
}

async function decompressZlibStream(bytes: Uint8Array): Promise<Uint8Array | null> {
  if (typeof DecompressionStream === "undefined") return null;
  try {
    const ds = new DecompressionStream("deflate");
    const writer = ds.writable.getWriter();
    writer.write(bytes as any);
    writer.close();

    const chunks: Uint8Array[] = [];
    const reader = ds.readable.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
    const out = new Uint8Array(totalLen);
    let offset = 0;
    for (const c of chunks) {
      out.set(c, offset);
      offset += c.length;
    }
    return out;
  } catch {
    return null;
  }
}

export function usePdfCompressor(): UsePdfCompressorReturn {
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string | null>(null);
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeBlobUrlRef = useRef<string | null>(null);
  const isCancelledRef = useRef<boolean>(false);

  const revokeActiveBlob = useCallback(() => {
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    setDownloadUrl(null);
  }, []);

  const reset = useCallback(() => {
    isCancelledRef.current = true;
    revokeActiveBlob();
    setIsCompressing(false);
    setProgress(0);
    setStatusMessage("");
    setOutputFileName(null);
    setStats(null);
    setError(null);
  }, [revokeActiveBlob]);

  useEffect(() => {
    return () => {
      revokeActiveBlob();
    };
  }, [revokeActiveBlob]);

  const compressPdf = useCallback(
    async (
      file: File,
      level: CompressionLevel,
      customName?: string
    ): Promise<string | null> => {
      if (!file) {
        setError("Please provide a valid PDF document to compress.");
        return null;
      }

      reset();
      isCancelledRef.current = false;
      setIsCompressing(true);
      setProgress(5);
      setStatusMessage("Reading document into secure memory buffer...");
      setError(null);

      try {
        const [{ PDFDocument, PDFName, PDFNumber }, arrayBuffer] =
          await Promise.all([import("pdf-lib"), file.arrayBuffer()]);

        if (isCancelledRef.current) return null;

        const originalSize = file.size;

        setProgress(15);
        setStatusMessage("Parsing PDF object tree & font dictionaries...");

        const srcDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: false,
        });

        if (isCancelledRef.current) return null;

        // Strip redundant metadata while preserving 100% vector fonts & text
        srcDoc.setTitle("");
        srcDoc.setAuthor("");
        srcDoc.setSubject("");
        srcDoc.setKeywords([]);
        srcDoc.setProducer("GoPDF Fast In-Memory Compressor");
        srcDoc.setCreator("GoPDF");
        srcDoc.catalog.delete(PDFName.of("Metadata"));

        const totalPages = srcDoc.getPageCount();

        // Level-specific image optimization parameters
        // RECOMMENDED: Max 1800px dimension (~200 DPI on standard A4/Letter), high quality 0.78 JPEG
        // EXTREME: Max 1200px dimension (~140 DPI), balanced 0.60 JPEG for strict email limits
        const maxDimension = level === "extreme" ? 1200 : 1800;
        const targetJpegQuality = level === "extreme" ? 0.60 : 0.78;

        const yieldToMain = () =>
          new Promise<void>((resolve) => {
            if (typeof requestAnimationFrame !== "undefined") {
              requestAnimationFrame(() => resolve());
            } else {
              setTimeout(resolve, 0);
            }
          });

        if (level !== "basic") {
          // Identify embedded raster images (/XObject with /Subtype /Image)
          // We optimize ONLY the images in-place, keeping all text, letters, fonts, and vector paths 100% native!
          const imageEntries: Array<{ ref: any; obj: any }> = [];

          for (const [ref, obj] of srcDoc.context.enumerateIndirectObjects()) {
            if (obj && (obj as any).dict) {
              const subtype = (obj as any).dict.get(PDFName.of("Subtype"));
              if (subtype && subtype.toString() === "/Image") {
                imageEntries.push({ ref, obj });
              }
            }
          }

          const totalImages = imageEntries.length;

          if (totalImages > 0) {
            setProgress(25);
            setStatusMessage(`Found ${totalImages} embedded image stream${totalImages > 1 ? "s" : ""}. Optimizing in-place...`);

            for (let i = 0; i < totalImages; i++) {
              if (isCancelledRef.current) return null;

              await yieldToMain();

              const currentProgress = 25 + Math.round(((i + 1) / totalImages) * 55);
              setProgress(currentProgress);
              setStatusMessage(
                `Optimizing image ${i + 1} of ${totalImages} (preserving 100% vector text)...`
              );

              const { obj } = imageEntries[i];
              const dict = (obj as any).dict;
              const filter = dict.get(PDFName.of("Filter"))?.toString();
              const widthVal = dict.get(PDFName.of("Width"));
              const heightVal = dict.get(PDFName.of("Height"));
              const width =
                widthVal && typeof widthVal.asNumber === "function"
                  ? widthVal.asNumber()
                  : null;
              const height =
                heightVal && typeof heightVal.asNumber === "function"
                  ? heightVal.asNumber()
                  : null;
              const hasSMask = dict.has(PDFName.of("SMask"));
              const rawContents = (obj as any).contents as Uint8Array | undefined;

              if (!rawContents || rawContents.length < 5120) {
                // Skip very small images (icons, 1px spacers)
                continue;
              }

              // Case A: Embedded JPEG (/Filter /DCTDecode)
              if (filter === "/DCTDecode") {
                try {
                  const blob = new Blob([rawContents as unknown as BlobPart], {
                    type: "image/jpeg",
                  });
                  const decoded = await decodeBlobToImage(blob);

                  if (decoded) {
                    const origW = decoded.width;
                    const origH = decoded.height;

                    let targetW = origW;
                    let targetH = origH;
                    if (Math.max(origW, origH) > maxDimension) {
                      const scale = maxDimension / Math.max(origW, origH);
                      targetW = Math.max(1, Math.round(origW * scale));
                      targetH = Math.max(1, Math.round(origH * scale));
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = targetW;
                    canvas.height = targetH;
                    const ctx = canvas.getContext("2d", { alpha: false });

                    if (ctx) {
                      ctx.fillStyle = "#ffffff";
                      ctx.fillRect(0, 0, targetW, targetH);
                      ctx.imageSmoothingEnabled = true;
                      ctx.imageSmoothingQuality = "high";
                      decoded.draw(ctx, targetW, targetH);
                      decoded.cleanup();

                      const dataUrl = canvas.toDataURL("image/jpeg", targetJpegQuality);
                      canvas.width = 0;
                      canvas.height = 0;

                      const base64 = dataUrl.split(",")[1];
                      if (base64) {
                        const bin = atob(base64);
                        const newBytes = new Uint8Array(bin.length);
                        for (let j = 0; j < bin.length; j++) {
                          newBytes[j] = bin.charCodeAt(j);
                        }

                        // Monotonic check: Only replace if smaller!
                        if (newBytes.length < rawContents.length) {
                          (obj as any).contents = newBytes;
                          dict.set(PDFName.of("Length"), PDFNumber.of(newBytes.length));
                          dict.set(PDFName.of("Width"), PDFNumber.of(targetW));
                          dict.set(PDFName.of("Height"), PDFNumber.of(targetH));
                        }
                      }
                    } else {
                      decoded.cleanup();
                    }
                  }
                } catch {
                  // Fall back gracefully if an individual image stream can't be decoded
                }
              }

              // Case B: Uncompressed / Flate RGB bitmap (/Filter /FlateDecode) without transparency mask
              else if (
                filter === "/FlateDecode" &&
                !hasSMask &&
                width &&
                height &&
                width > 50 &&
                height > 50
              ) {
                try {
                  const decompressed = await decompressZlibStream(rawContents);
                  const colorSpace = dict.get(PDFName.of("ColorSpace"))?.toString();
                  const isRgb =
                    colorSpace === "/DeviceRGB" ||
                    (decompressed && decompressed.length === width * height * 3);

                  if (decompressed && isRgb && decompressed.length >= width * height * 3) {
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d", { alpha: false });

                    if (ctx) {
                      const imgData = ctx.createImageData(width, height);
                      const d = imgData.data;
                      let p = 0;
                      for (let pixel = 0; pixel < width * height; pixel++) {
                        d[pixel * 4] = decompressed[p++];
                        d[pixel * 4 + 1] = decompressed[p++];
                        d[pixel * 4 + 2] = decompressed[p++];
                        d[pixel * 4 + 3] = 255;
                      }
                      ctx.putImageData(imgData, 0, 0);

                      let targetW = width;
                      let targetH = height;
                      let outCanvas = canvas;

                      if (Math.max(width, height) > maxDimension) {
                        const scale = maxDimension / Math.max(width, height);
                        targetW = Math.max(1, Math.round(width * scale));
                        targetH = Math.max(1, Math.round(height * scale));

                        const scaledCanvas = document.createElement("canvas");
                        scaledCanvas.width = targetW;
                        scaledCanvas.height = targetH;
                        const sCtx = scaledCanvas.getContext("2d", { alpha: false });
                        if (sCtx) {
                          sCtx.imageSmoothingEnabled = true;
                          sCtx.imageSmoothingQuality = "high";
                          sCtx.drawImage(canvas, 0, 0, targetW, targetH);
                          outCanvas = scaledCanvas;
                        }
                      }

                      const dataUrl = outCanvas.toDataURL("image/jpeg", targetJpegQuality);
                      canvas.width = 0;
                      canvas.height = 0;
                      if (outCanvas !== canvas) {
                        outCanvas.width = 0;
                        outCanvas.height = 0;
                      }

                      const base64 = dataUrl.split(",")[1];
                      if (base64) {
                        const bin = atob(base64);
                        const newBytes = new Uint8Array(bin.length);
                        for (let j = 0; j < bin.length; j++) {
                          newBytes[j] = bin.charCodeAt(j);
                        }

                        if (newBytes.length < rawContents.length) {
                          (obj as any).contents = newBytes;
                          dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
                          dict.set(PDFName.of("Length"), PDFNumber.of(newBytes.length));
                          dict.set(PDFName.of("Width"), PDFNumber.of(targetW));
                          dict.set(PDFName.of("Height"), PDFNumber.of(targetH));
                          dict.delete(PDFName.of("DecodeParms"));
                        }
                      }
                    }
                  }
                } catch {
                  // Fall back gracefully
                }
              }
            }
          }
        }

        setProgress(85);
        setStatusMessage("Packing compressed PDF object streams (FlateDecode)...");

        // Save with modern PDF 1.5 compressed object streams
        const optimizedBytes = await srcDoc.save({ useObjectStreams: true });

        // Safety fallback: ensure final file is NEVER larger than original
        let finalBytes = optimizedBytes;
        if (finalBytes.length > originalSize) {
          finalBytes = new Uint8Array(arrayBuffer);
        }

        setProgress(95);

        const compressedSize = finalBytes.length;
        const savedBytes = Math.max(0, originalSize - compressedSize);
        const savedPercentage =
          originalSize > 0
            ? Math.max(0, Math.round((savedBytes / originalSize) * 100))
            : 0;

        const blob = new Blob([finalBytes as unknown as BlobPart], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        activeBlobUrlRef.current = url;

        const baseName = file.name.replace(/\.pdf$/i, "");
        const finalName = customName || `${baseName}-compressed.pdf`;

        setStats({
          originalSize,
          compressedSize,
          savedBytes,
          savedPercentage,
          totalPages,
        });
        setDownloadUrl(url);
        setOutputFileName(finalName);
        setProgress(100);
        setStatusMessage("Compression complete! Text quality is 100% preserved.");
        setIsCompressing(false);

        return url;
      } catch (err: any) {
        if (isCancelledRef.current) return null;

        const msg = err?.message?.toLowerCase() || "";
        if (msg.includes("password") || msg.includes("encrypt")) {
          setError(
            "This PDF is password-protected. Please remove the password before compressing."
          );
        } else {
          setError(err?.message || "Failed to compress the PDF document.");
        }
        setIsCompressing(false);
        return null;
      }
    },
    [reset]
  );

  return {
    isCompressing,
    progress,
    statusMessage,
    downloadUrl,
    outputFileName,
    stats,
    error,
    compressPdf,
    reset,
  };
}

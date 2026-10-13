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
      setStatusMessage("Reading document into memory...");
      setError(null);

      try {
        const [{ PDFDocument, PDFName, PDFNumber }, arrayBuffer] =
          await Promise.all([import("pdf-lib"), file.arrayBuffer()]);

        if (isCancelledRef.current) return null;

        const originalSize = file.size;

        const yieldToMain = () =>
          new Promise<void>((resolve) => {
            if (typeof requestAnimationFrame !== "undefined") {
              requestAnimationFrame(() => resolve());
            } else {
              setTimeout(resolve, 0);
            }
          });

        // =========================================================================
        // PASS 1: Attempt In-Place Vector-Preserving Optimization
        // =========================================================================
        setProgress(15);
        setStatusMessage("Analyzing PDF structure & embedded streams...");

        const srcDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });

        if (isCancelledRef.current) return null;

        // Strip bloated metadata
        srcDoc.setTitle("");
        srcDoc.setAuthor("");
        srcDoc.setSubject("");
        srcDoc.setKeywords([]);
        srcDoc.setProducer("GoPDF Fast In-Memory Compressor");
        srcDoc.setCreator("GoPDF");
        srcDoc.catalog.delete(PDFName.of("Metadata"));

        const totalPages = srcDoc.getPageCount();

        if (level !== "basic") {
          // Check for embedded JPEG image streams to compress in-place
          const imageEntries: Array<{ ref: any; obj: any }> = [];

          for (const [ref, obj] of srcDoc.context.enumerateIndirectObjects()) {
            if (obj && (obj as any).dict) {
              const subtype = (obj as any).dict.get(PDFName.of("Subtype"));
              if (subtype && subtype.toString() === "/Image") {
                imageEntries.push({ ref, obj });
              }
            }
          }

          if (imageEntries.length > 0) {
            const maxDim = level === "extreme" ? 1400 : 1800;
            const quality = level === "extreme" ? 0.65 : 0.78;

            for (let i = 0; i < imageEntries.length; i++) {
              if (isCancelledRef.current) return null;
              await yieldToMain();

              const { obj } = imageEntries[i];
              const dict = (obj as any).dict;
              const filter = dict.get(PDFName.of("Filter"))?.toString();
              const rawContents = (obj as any).contents as Uint8Array | undefined;

              if (filter === "/DCTDecode" && rawContents && rawContents.length > 8192) {
                try {
                  const blob = new Blob([rawContents as unknown as BlobPart], {
                    type: "image/jpeg",
                  });
                  const decoded = await decodeBlobToImage(blob);

                  if (decoded) {
                    let targetW = decoded.width;
                    let targetH = decoded.height;
                    if (Math.max(decoded.width, decoded.height) > maxDim) {
                      const scale = maxDim / Math.max(decoded.width, decoded.height);
                      targetW = Math.max(1, Math.round(decoded.width * scale));
                      targetH = Math.max(1, Math.round(decoded.height * scale));
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

                      const dataUrl = canvas.toDataURL("image/jpeg", quality);
                      canvas.width = 0;
                      canvas.height = 0;

                      const base64 = dataUrl.split(",")[1];
                      if (base64) {
                        const bin = atob(base64);
                        const newBytes = new Uint8Array(bin.length);
                        for (let j = 0; j < bin.length; j++) {
                          newBytes[j] = bin.charCodeAt(j);
                        }

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
                  // Fall back gracefully
                }
              }
            }
          }
        }

        setProgress(35);
        const inPlaceOptimizedBytes = await srcDoc.save({ useObjectStreams: true });

        // Calculate in-place savings percentage
        const inPlaceSavedBytes = Math.max(0, originalSize - inPlaceOptimizedBytes.length);
        const inPlaceRatio = originalSize > 0 ? inPlaceSavedBytes / originalSize : 0;

        let finalBytes: Uint8Array;

        // If user chose Basic, OR in-place optimization achieved at least 15% reduction,
        // we use in-place vector bytes (100% native vector text)!
        if (level === "basic" || inPlaceRatio >= 0.15) {
          finalBytes = inPlaceOptimizedBytes;
          if (finalBytes.length > originalSize) {
            finalBytes = new Uint8Array(arrayBuffer);
          }
        } else {
          // =========================================================================
          // PASS 2: High-Definition Crisp Rendering Engine
          // Triggered when in-place streams didn't reduce the document (e.g. uncompressed
          // PNG screenshots or complex transparency layers as in vulnerability reports).
          // Uses HD 2.0x scale (144 DPI) and high JPEG quality so letters DO NOT lose quality!
          // =========================================================================
          setProgress(40);
          setStatusMessage("Initializing High-Definition crisp rendering engine...");

          const pdfjs = await import("pdfjs-dist");

          if (typeof window !== "undefined") {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
            pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/pdf.worker.min.js`;
          }

          const loadingTask = pdfjs.getDocument({
            data: arrayBuffer,
            cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
            cMapPacked: true,
            isEvalSupported: false,
          });

          const pdfDocument = await loadingTask.promise;
          const numPages = pdfDocument.numPages;

          const newDoc = await PDFDocument.create();

          // CRUCIAL FOR CRISP LETTERS:
          // Recommended: 2.0x scale (144 DPI) + 0.82 JPEG quality
          // Extreme: 1.6x scale (115 DPI) + 0.72 JPEG quality
          const renderScale = level === "extreme" ? 1.6 : 2.0;
          const renderQuality = level === "extreme" ? 0.72 : 0.82;

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            if (isCancelledRef.current) return null;

            await yieldToMain();

            const pageProgress = 40 + Math.round((pageNum / numPages) * 45);
            setProgress(pageProgress);
            setStatusMessage(`Compressing page ${pageNum} of ${numPages} (HD crisp typography)...`);

            const page = await pdfDocument.getPage(pageNum);
            const unscaledViewport = page.getViewport({ scale: 1 });
            const scaledViewport = page.getViewport({ scale: renderScale });

            const canvas = document.createElement("canvas");
            canvas.width = Math.floor(scaledViewport.width);
            canvas.height = Math.floor(scaledViewport.height);

            const ctx = canvas.getContext("2d", { alpha: false });
            if (!ctx) {
              throw new Error("Could not initialize 2D canvas context");
            }

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;

            if (isCancelledRef.current) return null;

            const dataUrl = canvas.toDataURL("image/jpeg", renderQuality);
            canvas.width = 0;
            canvas.height = 0;

            const embeddedImg = await newDoc.embedJpg(dataUrl);
            const newPage = newDoc.addPage([
              unscaledViewport.width,
              unscaledViewport.height,
            ]);

            newPage.drawImage(embeddedImg, {
              x: 0,
              y: 0,
              width: unscaledViewport.width,
              height: unscaledViewport.height,
            });
          }

          setProgress(90);
          setStatusMessage("Packaging compressed FlateDecode streams...");

          const renderedBytes = await newDoc.save({ useObjectStreams: true });

          // Pick the best result between rendered and in-place
          if (renderedBytes.length < originalSize) {
            finalBytes = renderedBytes;
          } else if (inPlaceOptimizedBytes.length < originalSize) {
            finalBytes = inPlaceOptimizedBytes;
          } else {
            finalBytes = new Uint8Array(arrayBuffer);
          }
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
        setStatusMessage("Compression complete!");
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

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
      setStatusMessage("Reading document buffer...");
      setError(null);

      try {
        const [{ PDFDocument }, arrayBuffer] = await Promise.all([
          import("pdf-lib"),
          file.arrayBuffer(),
        ]);

        if (isCancelledRef.current) return null;

        const originalSize = file.size;

        // Level 1: Basic Structural Compression (Lossless Vector / Metadata Pruning)
        if (level === "basic") {
          setProgress(25);
          setStatusMessage("Optimizing object streams and pruning metadata...");

          const srcDoc = await PDFDocument.load(arrayBuffer, {
            ignoreEncryption: false,
          });

          // Strip redundant metadata
          srcDoc.setTitle("");
          srcDoc.setAuthor("");
          srcDoc.setSubject("");
          srcDoc.setKeywords([]);
          srcDoc.setProducer("GoPDF Fast In-Memory Compressor");
          srcDoc.setCreator("GoPDF");

          setProgress(65);
          setStatusMessage("Packing compressed FlateDecode streams...");

          const optimizedBytes = await srcDoc.save({ useObjectStreams: true });
          const totalPages = srcDoc.getPageCount();

          let finalBytes = optimizedBytes;
          if (finalBytes.length > originalSize) {
            // Keep original if structural pass didn't yield savings
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
          setStatusMessage("Compression complete!");
          setIsCompressing(false);
          return url;
        }

        // Level 2 & 3: Visual Raster Downscaling with Canvas + pdf-lib object stream packaging
        setProgress(15);
        setStatusMessage("Initializing client-side rendering pipeline...");

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
        const totalPages = pdfDocument.numPages;

        const newDoc = await PDFDocument.create();

        // Level-specific parameters
        // Recommended: balanced scale (1.25x), JPEG quality 0.68
        // Extreme: low-bandwidth scale (0.95x), JPEG quality 0.45
        const scale = level === "extreme" ? 0.95 : 1.25;
        const jpegQuality = level === "extreme" ? 0.45 : 0.68;

        const yieldToMain = () =>
          new Promise<void>((resolve) => {
            if (typeof requestAnimationFrame !== "undefined") {
              requestAnimationFrame(() => resolve());
            } else {
              setTimeout(resolve, 0);
            }
          });

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          if (isCancelledRef.current) return null;

          await yieldToMain();

          const pageProgress = 20 + Math.round((pageNum / totalPages) * 60);
          setProgress(pageProgress);
          setStatusMessage(`Compressing page ${pageNum} of ${totalPages}...`);

          const page = await pdfDocument.getPage(pageNum);
          const unscaledViewport = page.getViewport({ scale: 1 });
          const scaledViewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(scaledViewport.width);
          canvas.height = Math.floor(scaledViewport.height);

          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) {
            throw new Error("Could not initialize 2D canvas context");
          }

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport: scaledViewport })
            .promise;

          if (isCancelledRef.current) return null;

          const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);

          // Free canvas memory immediately
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

        setProgress(85);
        setStatusMessage("Assembling compressed PDF object streams...");

        const compressedBytes = await newDoc.save({ useObjectStreams: true });

        // Safety fallback: If rasterization resulted in a larger file (e.g. tiny 10KB text file),
        // fallback to structural optimization so user ALWAYS gets a smaller file!
        let finalBytes = compressedBytes;
        if (finalBytes.length >= originalSize) {
          setStatusMessage("Optimizing structural streams as fallback...");
          const srcDoc = await PDFDocument.load(arrayBuffer, {
            ignoreEncryption: false,
          });
          const structuralBytes = await srcDoc.save({
            useObjectStreams: true,
          });
          finalBytes =
            structuralBytes.length < originalSize
              ? structuralBytes
              : new Uint8Array(arrayBuffer);
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

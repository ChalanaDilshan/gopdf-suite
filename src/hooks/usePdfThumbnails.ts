"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface PageThumbnail {
  pageNumber: number; // 1-based index
  dataUrl: string;
  width?: number;
  height?: number;
}

export interface UsePdfThumbnailsReturn {
  thumbnails: PageThumbnail[];
  totalPages: number;
  isLoadingThumbnails: boolean;
  renderingProgress: number; // 0 to 100
  error: string | null;
  loadThumbnails: (file: File) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

export function usePdfThumbnails(initialFile?: File | null): UsePdfThumbnailsReturn {
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState<boolean>(false);
  const [renderingProgress, setRenderingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const isCancelledRef = useRef<boolean>(false);
  const activeTaskRef = useRef<any>(null);

  const reset = useCallback(() => {
    isCancelledRef.current = true;
    if (activeTaskRef.current?.cancel) {
      try {
        activeTaskRef.current.cancel();
      } catch {
        // Ignore cancellation errors
      }
    }
    setThumbnails([]);
    setTotalPages(0);
    setIsLoadingThumbnails(false);
    setRenderingProgress(0);
    setError(null);
  }, []);

  const cancel = useCallback(() => {
    isCancelledRef.current = true;
    if (activeTaskRef.current?.cancel) {
      try {
        activeTaskRef.current.cancel();
      } catch {
        // Ignore cancellation errors
      }
    }
    setIsLoadingThumbnails(false);
  }, []);

  const loadThumbnails = useCallback(async (file: File) => {
    if (!file) return;

    reset();
    isCancelledRef.current = false;
    setIsLoadingThumbnails(true);
    setRenderingProgress(0);
    setError(null);

    try {
      // Dynamic import to prevent any SSR canvas/window issues in Next.js
      const pdfjs = await import("pdfjs-dist");

      // Configure offline-first local worker or fallback
      if (typeof window !== "undefined") {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      }

      const arrayBuffer = await file.arrayBuffer();

      if (isCancelledRef.current) return;

      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
        cMapPacked: true,
      });

      activeTaskRef.current = loadingTask;
      const pdfDocument = await loadingTask.promise;

      if (isCancelledRef.current) return;

      const total = pdfDocument.numPages;
      setTotalPages(total);

      const generatedThumbnails: PageThumbnail[] = [];

      for (let pageNum = 1; pageNum <= total; pageNum++) {
        if (isCancelledRef.current) break;

        const page = await pdfDocument.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });

        // Fixed crisp thumbnail width: 220px
        const targetWidth = 220;
        const scale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        // Offscreen canvas rendering
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) {
          throw new Error("Could not create 2D canvas rendering context");
        }

        // Fill crisp white background behind transparent PDF pages
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        await page.render(renderContext).promise;

        if (isCancelledRef.current) break;

        // Export as lightweight JPEG (quality 0.7)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

        const item: PageThumbnail = {
          pageNumber: pageNum,
          dataUrl,
          width: canvas.width,
          height: canvas.height,
        };

        generatedThumbnails.push(item);

        // Update progress and thumbnails state incrementally for fast UI feedback
        setThumbnails([...generatedThumbnails]);
        setRenderingProgress(Math.round((pageNum / total) * 100));
      }

      setIsLoadingThumbnails(false);
    } catch (err: any) {
      if (isCancelledRef.current) return;

      const msg = err?.message?.toLowerCase() || "";
      if (msg.includes("password") || msg.includes("encrypted")) {
        setError("This PDF is password-protected. Please unlock it before extracting pages.");
      } else {
        setError(err?.message || "Failed to render PDF page thumbnails.");
      }
      setIsLoadingThumbnails(false);
    }
  }, [reset]);

  useEffect(() => {
    if (initialFile) {
      loadThumbnails(initialFile);
    }
    return () => {
      cancel();
    };
  }, [initialFile, loadThumbnails, cancel]);

  return {
    thumbnails,
    totalPages,
    isLoadingThumbnails,
    renderingProgress,
    error,
    loadThumbnails,
    cancel,
    reset,
  };
}

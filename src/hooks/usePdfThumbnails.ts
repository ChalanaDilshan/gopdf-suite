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
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/pdf.worker.min.js`;
      }

      const arrayBuffer = await file.arrayBuffer();

      if (isCancelledRef.current) return;

      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
        cMapPacked: true,
        // Disable optional features we don't need for thumbnails
        isEvalSupported: false,
      });

      activeTaskRef.current = loadingTask;
      const pdfDocument = await loadingTask.promise;

      if (isCancelledRef.current) return;

      const total = pdfDocument.numPages;
      setTotalPages(total);

      const generatedThumbnails: PageThumbnail[] = [];

      // Yield control back to the browser between pages to keep UI responsive
      const yieldToMain = () =>
        new Promise<void>((resolve) => {
          if (typeof requestAnimationFrame !== "undefined") {
            requestAnimationFrame(() => resolve());
          } else {
            setTimeout(resolve, 0);
          }
        });

      // Adaptive thumbnail width: smaller on mobile for faster rendering
      const targetWidth =
        typeof window !== "undefined" && window.innerWidth < 640 ? 160 : 220;

      for (let pageNum = 1; pageNum <= total; pageNum++) {
        if (isCancelledRef.current) break;

        // Yield every page to keep scrolling / interactions smooth
        await yieldToMain();

        if (isCancelledRef.current) break;

        const page = await pdfDocument.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });

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

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        if (isCancelledRef.current) break;

        // Export as lightweight JPEG — quality 0.65 for mobile, 0.72 for desktop
        const jpegQuality =
          typeof window !== "undefined" && window.innerWidth < 640
            ? 0.65
            : 0.72;
        const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);

        // Release canvas memory immediately after use
        canvas.width = 0;
        canvas.height = 0;

        const item: PageThumbnail = {
          pageNumber: pageNum,
          dataUrl,
          width: Math.floor(viewport.width),
          height: Math.floor(viewport.height),
        };

        generatedThumbnails.push(item);

        // Batch UI updates: update every page for first 5, then every 3 pages
        const batchSize = pageNum <= 5 ? 1 : 3;
        if (pageNum % batchSize === 0 || pageNum === total) {
          setThumbnails([...generatedThumbnails]);
          setRenderingProgress(Math.round((pageNum / total) * 100));
        }
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

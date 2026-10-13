"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

export interface PageState {
  id: string;
  pageNumber: number; // 1-based original index
  rotation: number; // 0, 90, 180, 270 (delta angle)
  isDeleted: boolean;
  thumbnailUrl: string;
}

export interface UsePdfOrganizerReturn {
  file: File | null;
  pages: PageState[];
  totalPages: number;
  activePagesCount: number;
  deletedPagesCount: number;
  hasModifications: boolean;
  isLoadingThumbnails: boolean;
  renderingProgress: number; // 0 to 100
  isExporting: boolean;
  exportProgress: number; // 0 to 100
  downloadUrl: string | null;
  outputFileName: string | null;
  error: string | null;
  loadFile: (file: File) => Promise<void>;
  rotatePage: (id: string, angle: number) => void;
  rotateAll: (angle: number) => void;
  deletePage: (id: string) => void;
  restorePage: (id: string) => void;
  toggleDeletePage: (id: string) => void;
  reorderPages: (oldIndex: number, newIndex: number) => void;
  setPagesOrder: (newPages: PageState[]) => void;
  resetAll: () => void;
  exportPdf: (customName?: string) => Promise<string | null>;
  clear: () => void;
}

export function usePdfOrganizer(): UsePdfOrganizerReturn {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageState[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState<boolean>(false);
  const [renderingProgress, setRenderingProgress] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeBlobUrlRef = useRef<string | null>(null);
  const isCancelledRef = useRef<boolean>(false);
  const activeTaskRef = useRef<any>(null);

  const revokeActiveBlob = useCallback(() => {
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    setDownloadUrl(null);
  }, []);

  const clear = useCallback(() => {
    isCancelledRef.current = true;
    if (activeTaskRef.current?.cancel) {
      try {
        activeTaskRef.current.cancel();
      } catch {
        // Ignore cancellation errors
      }
    }
    revokeActiveBlob();
    setFile(null);
    setPages([]);
    setTotalPages(0);
    setIsLoadingThumbnails(false);
    setRenderingProgress(0);
    setIsExporting(false);
    setExportProgress(0);
    setOutputFileName(null);
    setError(null);
  }, [revokeActiveBlob]);

  useEffect(() => {
    return () => {
      revokeActiveBlob();
    };
  }, [revokeActiveBlob]);

  const loadFile = useCallback(
    async (uploadedFile: File): Promise<void> => {
      if (!uploadedFile) return;

      clear();
      isCancelledRef.current = false;
      setFile(uploadedFile);
      setIsLoadingThumbnails(true);
      setRenderingProgress(0);
      setError(null);

      try {
        const pdfjs = await import("pdfjs-dist");

        if (typeof window !== "undefined") {
          const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
          pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/pdf.worker.min.js`;
        }

        const arrayBuffer = await uploadedFile.arrayBuffer();

        if (isCancelledRef.current) return;

        const loadingTask = pdfjs.getDocument({
          data: arrayBuffer,
          cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
          cMapPacked: true,
          isEvalSupported: false,
        });

        activeTaskRef.current = loadingTask;
        const pdfDocument = await loadingTask.promise;

        if (isCancelledRef.current) return;

        const total = pdfDocument.numPages;
        setTotalPages(total);

        const generatedPages: PageState[] = [];

        const yieldToMain = () =>
          new Promise<void>((resolve) => {
            if (typeof requestAnimationFrame !== "undefined") {
              requestAnimationFrame(() => resolve());
            } else {
              setTimeout(resolve, 0);
            }
          });

        const targetWidth =
          typeof window !== "undefined" && window.innerWidth < 640 ? 180 : 260;

        for (let pageNum = 1; pageNum <= total; pageNum++) {
          if (isCancelledRef.current) break;

          await yieldToMain();

          if (isCancelledRef.current) break;

          const page = await pdfDocument.getPage(pageNum);
          const unscaledViewport = page.getViewport({ scale: 1 });

          const scale = targetWidth / unscaledViewport.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) {
            throw new Error("Could not initialize 2D canvas rendering context");
          }

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport }).promise;

          if (isCancelledRef.current) break;

          const jpegQuality =
            typeof window !== "undefined" && window.innerWidth < 640
              ? 0.68
              : 0.75;
          const thumbnailUrl = canvas.toDataURL("image/jpeg", jpegQuality);

          canvas.width = 0;
          canvas.height = 0;

          const pageState: PageState = {
            id: `page-${pageNum}`,
            pageNumber: pageNum,
            rotation: 0,
            isDeleted: false,
            thumbnailUrl,
          };

          generatedPages.push(pageState);

          // Progressive UI updates: update immediately for first 4 pages, then batches of 3
          const batchSize = pageNum <= 4 ? 1 : 3;
          if (pageNum % batchSize === 0 || pageNum === total) {
            setPages([...generatedPages]);
            setRenderingProgress(Math.round((pageNum / total) * 100));
          }
        }

        setIsLoadingThumbnails(false);
      } catch (err: any) {
        if (isCancelledRef.current) return;

        const msg = err?.message?.toLowerCase() || "";
        if (msg.includes("password") || msg.includes("encrypted")) {
          setError(
            "This PDF is password-protected. Please remove the password before organizing pages."
          );
        } else {
          setError(err?.message || "Failed to load and render PDF pages.");
        }
        setIsLoadingThumbnails(false);
      }
    },
    [clear]
  );

  const rotatePage = useCallback((id: string, angle: number) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id !== id) return page;
        const normalizedAngle = ((page.rotation + angle) % 360 + 360) % 360;
        return { ...page, rotation: normalizedAngle };
      })
    );
  }, []);

  const rotateAll = useCallback((angle: number) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        const normalizedAngle = ((page.rotation + angle) % 360 + 360) % 360;
        return { ...page, rotation: normalizedAngle };
      })
    );
  }, []);

  const deletePage = useCallback((id: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === id ? { ...page, isDeleted: true } : page
      )
    );
  }, []);

  const restorePage = useCallback((id: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === id ? { ...page, isDeleted: false } : page
      )
    );
  }, []);

  const toggleDeletePage = useCallback((id: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === id ? { ...page, isDeleted: !page.isDeleted } : page
      )
    );
  }, []);

  const reorderPages = useCallback((oldIndex: number, newIndex: number) => {
    setPages((prevPages) => {
      const next = [...prevPages];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });
  }, []);

  const setPagesOrder = useCallback((newPages: PageState[]) => {
    setPages(newPages);
  }, []);

  const resetAll = useCallback(() => {
    setPages((prevPages) =>
      [...prevPages]
        .map((page) => ({
          ...page,
          rotation: 0,
          isDeleted: false,
        }))
        .sort((a, b) => a.pageNumber - b.pageNumber)
    );
  }, []);

  const exportPdf = useCallback(
    async (customName?: string): Promise<string | null> => {
      if (!file) {
        setError("No PDF file selected for export.");
        return null;
      }

      const pagesToKeep = pages.filter((p) => !p.isDeleted);
      if (pagesToKeep.length === 0) {
        setError("Cannot export: all pages have been marked as deleted. Restore at least one page.");
        return null;
      }

      revokeActiveBlob();
      setIsExporting(true);
      setExportProgress(15);
      setError(null);

      try {
        const [{ PDFDocument, degrees }, arrayBuffer] = await Promise.all([
          import("pdf-lib"),
          file.arrayBuffer(),
        ]);

        setExportProgress(35);

        const srcDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: false,
        });

        setExportProgress(50);

        const newDoc = await PDFDocument.create();

        // Map 1-based page numbers to 0-based source indices
        const indicesToCopy = pagesToKeep.map((p) => p.pageNumber - 1);
        const copiedPages = await newDoc.copyPages(srcDoc, indicesToCopy);

        setExportProgress(70);

        for (let i = 0; i < copiedPages.length; i++) {
          const targetPage = copiedPages[i];
          const pageState = pagesToKeep[i];

          const originalRotation = targetPage.getRotation()?.angle || 0;
          const cumulativeRotation =
            ((originalRotation + pageState.rotation) % 360 + 360) % 360;

          targetPage.setRotation(degrees(cumulativeRotation));
          newDoc.addPage(targetPage);
        }

        setExportProgress(85);

        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        activeBlobUrlRef.current = url;

        const baseName = file.name.replace(/\.pdf$/i, "");
        const finalName = customName || `${baseName}-organized.pdf`;

        setDownloadUrl(url);
        setOutputFileName(finalName);
        setExportProgress(100);
        setIsExporting(false);

        return url;
      } catch (err: any) {
        const msg = err?.message?.toLowerCase() || "";
        if (msg.includes("encrypt") || msg.includes("password")) {
          setError(
            "This PDF is password-protected. Please unlock it before exporting."
          );
        } else {
          setError(err?.message || "Failed to generate organized PDF.");
        }
        setIsExporting(false);
        return null;
      }
    },
    [file, pages, revokeActiveBlob]
  );

  const activePagesCount = useMemo(() => {
    return pages.filter((p) => !p.isDeleted).length;
  }, [pages]);

  const deletedPagesCount = useMemo(() => {
    return pages.filter((p) => p.isDeleted).length;
  }, [pages]);

  const hasModifications = useMemo(() => {
    const isOrderChanged = pages.some((p, idx) => p.pageNumber !== idx + 1);
    return isOrderChanged || pages.some((p) => p.rotation !== 0 || p.isDeleted);
  }, [pages]);

  return {
    file,
    pages,
    totalPages,
    activePagesCount,
    deletedPagesCount,
    hasModifications,
    isLoadingThumbnails,
    renderingProgress,
    isExporting,
    exportProgress,
    downloadUrl,
    outputFileName,
    error,
    loadFile,
    rotatePage,
    rotateAll,
    deletePage,
    restorePage,
    toggleDeletePage,
    reorderPages,
    setPagesOrder,
    resetAll,
    exportPdf,
    clear,
  };
}

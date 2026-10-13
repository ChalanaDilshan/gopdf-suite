"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { matchFont } from "@/lib/pdf/fontMatcher";

export interface EditableTextBlock {
  id: string;
  originalText: string;
  currentText: string;
  isDeleted: boolean;
  x: number; // Viewport X in pixels (DOM space, top-left origin)
  y: number; // Viewport Y in pixels (DOM space, top-left origin)
  width: number; // Bounding box width in pixels
  height: number; // Bounding box height in pixels
  fontSize: number; // Viewport font size in pixels
  fontFamily: string; // Extracted raw font name
  cssFontFamily: string; // Matched CSS font family
  pdfX: number; // PDF point coordinates for pdf-lib export (bottom-left origin)
  pdfY: number; // PDF point coordinates (bottom-left origin, baseline)
  color: string; // Hex color (e.g. #000000)
  isCustom?: boolean; // True if newly added by user
}

export interface UsePdfTextLayerOptions {
  pdfDocument: PDFDocumentProxy | null;
  pageNumber: number; // 1-based index
  scale: number;
  cachedBlocks?: EditableTextBlock[];
  onBlocksChange?: (blocks: EditableTextBlock[]) => void;
}

export interface UsePdfTextLayerReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  textBlocks: EditableTextBlock[];
  setTextBlocks: React.Dispatch<React.SetStateAction<EditableTextBlock[]>>;
  updateTextBlock: (id: string, updates: Partial<EditableTextBlock>) => void;
  deleteTextBlock: (id: string) => void;
  restoreTextBlock: (id: string) => void;
  addTextBlock: (domX: number, domY: number, defaultText?: string) => EditableTextBlock | null;
  viewportDimensions: { width: number; height: number } | null;
  isLoading: boolean;
  error: string | null;
}

export function usePdfTextLayer({
  pdfDocument,
  pageNumber,
  scale,
  cachedBlocks,
  onBlocksChange,
}: UsePdfTextLayerOptions): UsePdfTextLayerReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textBlocks, setTextBlocks] = useState<EditableTextBlock[]>(cachedBlocks || []);
  const [viewportDimensions, setViewportDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeRenderTaskRef = useRef<any>(null);
  const pageProxyRef = useRef<PDFPageProxy | null>(null);

  // Sync internal blocks when cachedBlocks change from outside (e.g. page navigation)
  useEffect(() => {
    if (cachedBlocks && cachedBlocks.length > 0) {
      setTextBlocks(cachedBlocks);
    }
  }, [cachedBlocks, pageNumber]);

  // Main rendering & text extraction lifecycle
  useEffect(() => {
    if (!pdfDocument || pageNumber < 1 || pageNumber > pdfDocument.numPages) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const renderAndExtract = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Cancel any pending render task to prevent canvas collision
        if (activeRenderTaskRef.current) {
          activeRenderTaskRef.current.cancel();
          activeRenderTaskRef.current = null;
        }

        const page = await pdfDocument.getPage(pageNumber);
        pageProxyRef.current = page;

        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        setViewportDimensions({ width: viewport.width, height: viewport.height });

        // 1. Render Base PDF onto Canvas with DevicePixelRatio
        const canvas = canvasRef.current;
        if (canvas) {
          const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          const ctx = canvas.getContext("2d", { alpha: false });
          if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, viewport.width, viewport.height);

            const renderTask = page.render({
              canvasContext: ctx,
              viewport,
            });
            activeRenderTaskRef.current = renderTask;

            await renderTask.promise;
          }
        }

        if (isCancelled) return;

        // 2. Fetch Text Layer Data
        // If we already have user edits cached for this page, re-project their DOM coordinates with new scale
        if (cachedBlocks && cachedBlocks.length > 0) {
          const reprojected = cachedBlocks.map((b) => {
            const [vx, vy] = viewport.convertToViewportPoint(b.pdfX, b.pdfY);
            const unscaledFontSize = b.pdfY > 0 ? b.fontSize / (cachedBlocks[0]?.fontSize ? scale : 1) : 12;
            const currentFontSize = Math.max(10, unscaledFontSize * scale);
            const currentWidth = (b.width / (viewport.scale / scale)) || b.width;
            const currentHeight = (b.height / (viewport.scale / scale)) || b.height;

            return {
              ...b,
              x: vx,
              y: vy - currentHeight,
              width: currentWidth,
              height: currentHeight,
              fontSize: currentFontSize,
            };
          });

          setTextBlocks(reprojected);
          onBlocksChange?.(reprojected);
          setIsLoading(false);
          return;
        }

        // Fresh Extraction
        const textContent = await page.getTextContent();
        if (isCancelled) return;

        const blocks: EditableTextBlock[] = [];

        for (let idx = 0; idx < textContent.items.length; idx++) {
          const item = textContent.items[idx] as any;
          if (!item.str || item.str.trim() === "") continue;

          const transform = item.transform; // [scaleX, skewY, skewX, scaleY, tx, ty]
          const a = transform[0];
          const b = transform[1];
          const d = transform[3];
          const pdfX = transform[4];
          const pdfY = transform[5];

          const unscaledFontSize = Math.sqrt(a * a + b * b) || Math.abs(d) || 12;
          const unscaledWidth = item.width || unscaledFontSize * item.str.length * 0.55;
          const unscaledHeight = item.height || unscaledFontSize;

          const [vx, vy] = viewport.convertToViewportPoint(pdfX, pdfY);

          const boxWidth = Math.max(unscaledWidth * scale, 12);
          const boxHeight = Math.max(unscaledHeight * scale, 14);
          const domX = vx;
          const domY = vy - boxHeight; // Invert baseline to top-left origin

          const matched = matchFont(
            item.fontName,
            textContent.styles[item.fontName]?.fontFamily
          );

          blocks.push({
            id: `p${pageNumber}-b${idx}-${Math.round(pdfX)}-${Math.round(pdfY)}`,
            originalText: item.str,
            currentText: item.str,
            isDeleted: false,
            x: domX,
            y: domY,
            width: boxWidth,
            height: boxHeight,
            fontSize: Math.round(unscaledFontSize * scale),
            fontFamily: item.fontName || "Helvetica",
            cssFontFamily: matched.cssFontFamily,
            pdfX,
            pdfY,
            color: "#000000",
          });
        }

        if (!isCancelled) {
          setTextBlocks(blocks);
          onBlocksChange?.(blocks);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!isCancelled && err?.name !== "RenderingCancelledException") {
          console.error("Text layer extraction failed:", err);
          setError(err?.message || "Failed to load page text.");
          setIsLoading(false);
        }
      }
    };

    renderAndExtract();

    return () => {
      isCancelled = true;
      if (activeRenderTaskRef.current) {
        activeRenderTaskRef.current.cancel();
      }
    };
  }, [pdfDocument, pageNumber, scale]);

  // Update a single text block
  const updateTextBlock = useCallback(
    (id: string, updates: Partial<EditableTextBlock>) => {
      setTextBlocks((prev) => {
        const next = prev.map((block) => {
          if (block.id === id) {
            const updated = { ...block, ...updates };
            // If empty text string entered, treat as deleted
            if (updates.currentText !== undefined && updates.currentText.trim() === "") {
              updated.isDeleted = true;
            } else if (updates.currentText !== undefined && updates.currentText.trim() !== "") {
              updated.isDeleted = false;
            }
            return updated;
          }
          return block;
        });
        onBlocksChange?.(next);
        return next;
      });
    },
    [onBlocksChange]
  );

  // Mark block as deleted
  const deleteTextBlock = useCallback(
    (id: string) => {
      updateTextBlock(id, { isDeleted: true });
    },
    [updateTextBlock]
  );

  // Restore deleted block
  const restoreTextBlock = useCallback(
    (id: string) => {
      setTextBlocks((prev) => {
        const next = prev.map((block) => {
          if (block.id === id) {
            return {
              ...block,
              isDeleted: false,
              currentText: block.originalText || "Text",
            };
          }
          return block;
        });
        onBlocksChange?.(next);
        return next;
      });
    },
    [onBlocksChange]
  );

  // Add a brand new text block at a clicked DOM coordinate
  const addTextBlock = useCallback(
    (domX: number, domY: number, defaultText: string = "New Text"): EditableTextBlock | null => {
      if (!pageProxyRef.current || !viewportDimensions) return null;

      const viewport = pageProxyRef.current.getViewport({ scale });
      const defaultFontSize = 14;
      const boxHeight = defaultFontSize * scale;
      const boxWidth = defaultText.length * 8 * scale;

      // Invert DOM point back to PDF coordinates
      const baselineDomY = domY + boxHeight;
      const [pdfX, pdfY] = viewport.convertToPdfPoint(domX, baselineDomY);

      const newBlock: EditableTextBlock = {
        id: `p${pageNumber}-custom-${Date.now()}`,
        originalText: "",
        currentText: defaultText,
        isDeleted: false,
        x: domX,
        y: domY,
        width: Math.max(boxWidth, 80),
        height: Math.max(boxHeight, 24),
        fontSize: defaultFontSize * scale,
        fontFamily: "Helvetica",
        cssFontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif',
        pdfX,
        pdfY,
        color: "#000000",
        isCustom: true,
      };

      setTextBlocks((prev) => {
        const next = [...prev, newBlock];
        onBlocksChange?.(next);
        return next;
      });

      return newBlock;
    },
    [pageNumber, scale, viewportDimensions, onBlocksChange]
  );

  return {
    canvasRef,
    textBlocks,
    setTextBlocks,
    updateTextBlock,
    deleteTextBlock,
    restoreTextBlock,
    addTextBlock,
    viewportDimensions,
    isLoading,
    error,
  };
}

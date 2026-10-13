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
  color: string; // Hex color (e.g. #000000 or #ffffff)
  backgroundColor: string; // Hex background color (e.g. #ffffff or #000000)
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
        let pageImageData: ImageData | null = null;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        if (canvas) {
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

            // Extract backing buffer pixel data for high-accuracy color extraction
            try {
              pageImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            } catch (imgErr) {
              console.warn("Could not read ImageData for color extraction:", imgErr);
            }
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

          // Auto-detect font color and background color from rendered canvas bitmap
          let detectedColor = "#000000";
          let detectedBgColor = "#ffffff";

          if (pageImageData) {
            const sampled = sampleColorsFromCanvas(
              pageImageData,
              domX,
              domY,
              boxWidth,
              boxHeight,
              dpr
            );
            detectedColor = sampled.color;
            detectedBgColor = sampled.backgroundColor;
          }

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
            color: detectedColor,
            backgroundColor: detectedBgColor,
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

      let initialColor = "#000000";
      let initialBgColor = "#ffffff";

      // Sample clicked canvas pixel to determine best font and background color
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          try {
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const px = Math.max(0, Math.min(canvas.width - 1, Math.floor(domX * dpr)));
            const py = Math.max(0, Math.min(canvas.height - 1, Math.floor(domY * dpr)));
            const pixel = ctx.getImageData(px, py, 1, 1).data;
            const [r, g, b] = [pixel[0], pixel[1], pixel[2]];
            const toHex = (n: number) => n.toString(16).padStart(2, "0");
            initialBgColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            initialColor = lum < 128 ? "#ffffff" : "#000000";
          } catch {}
        }
      }

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
        color: initialColor,
        backgroundColor: initialBgColor,
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

interface SampledColors {
  color: string;
  backgroundColor: string;
}

/**
 * Accurately samples the background color and foreground font color of a text block
 * directly from the rendered HTML5 canvas pixels.
 */
function sampleColorsFromCanvas(
  imageData: ImageData,
  domX: number,
  domY: number,
  boxWidth: number,
  boxHeight: number,
  dpr: number
): SampledColors {
  const { width: imgW, height: imgH, data } = imageData;

  // Convert DOM coordinates to backing buffer coordinates
  const bufX = Math.max(0, Math.min(imgW - 1, Math.floor(domX * dpr)));
  const bufY = Math.max(0, Math.min(imgH - 1, Math.floor(domY * dpr)));
  const bufW = Math.max(1, Math.min(imgW - bufX, Math.floor(boxWidth * dpr)));
  const bufH = Math.max(1, Math.min(imgH - bufY, Math.floor(boxHeight * dpr)));

  const getPixel = (px: number, py: number): [number, number, number] | null => {
    if (px < 0 || px >= imgW || py < 0 || py >= imgH) return null;
    const idx = (py * imgW + px) * 4;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  // 1. Background Sampling: Sample points along the outer perimeter (top, bottom, left, right, corners)
  const bgSamples: Array<[number, number, number]> = [];
  const perimeterPoints: Array<[number, number]> = [];

  const stepsX = Math.max(4, Math.min(24, Math.floor(bufW / 4)));
  for (let i = 0; i <= stepsX; i++) {
    const px = Math.floor(bufX + (i / stepsX) * bufW);
    perimeterPoints.push([px, Math.max(0, bufY - 2)]);
    perimeterPoints.push([px, Math.min(imgH - 1, bufY + bufH + 2)]);
    perimeterPoints.push([px, bufY]);
    perimeterPoints.push([px, bufY + bufH - 1]);
  }

  const stepsY = Math.max(4, Math.min(16, Math.floor(bufH / 4)));
  for (let j = 0; j <= stepsY; j++) {
    const py = Math.floor(bufY + (j / stepsY) * bufH);
    perimeterPoints.push([Math.max(0, bufX - 2), py]);
    perimeterPoints.push([Math.min(imgW - 1, bufX + bufW + 2), py]);
    perimeterPoints.push([bufX, py]);
    perimeterPoints.push([bufX + bufW - 1, py]);
  }

  for (const [px, py] of perimeterPoints) {
    const p = getPixel(px, py);
    if (p) bgSamples.push(p);
  }

  // Quantize perimeter samples to find dominant background color
  const bgBuckets = new Map<string, { count: number; sumR: number; sumG: number; sumB: number }>();
  for (const [r, g, b] of bgSamples) {
    const qr = Math.round(r / 16) * 16;
    const qg = Math.round(g / 16) * 16;
    const qb = Math.round(b / 16) * 16;
    const key = `${qr},${qg},${qb}`;
    const entry = bgBuckets.get(key) || { count: 0, sumR: 0, sumG: 0, sumB: 0 };
    entry.count += 1;
    entry.sumR += r;
    entry.sumG += g;
    entry.sumB += b;
    bgBuckets.set(key, entry);
  }

  let dominantBg = { count: 0, r: 255, g: 255, b: 255 };
  for (const entry of bgBuckets.values()) {
    if (entry.count > dominantBg.count) {
      dominantBg = {
        count: entry.count,
        r: Math.round(entry.sumR / entry.count),
        g: Math.round(entry.sumG / entry.count),
        b: Math.round(entry.sumB / entry.count),
      };
    }
  }

  const bgR = dominantBg.r;
  const bgG = dominantBg.g;
  const bgB = dominantBg.b;

  // 2. Foreground / Text Sampling: Sample interior pixels to locate glyph strokes
  interface GlyphPixel {
    r: number;
    g: number;
    b: number;
    dist: number;
  }
  const glyphPixels: GlyphPixel[] = [];

  const sampleStepX = Math.max(1, Math.floor(bufW / 30));
  const sampleStepY = Math.max(1, Math.floor(bufH / 20));

  for (let py = bufY + 1; py < bufY + bufH - 1; py += sampleStepY) {
    for (let px = bufX + 1; px < bufX + bufW - 1; px += sampleStepX) {
      const p = getPixel(px, py);
      if (!p) continue;
      const [r, g, b] = p;
      // Euclidean distance in RGB color space
      const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
      if (dist >= 35) {
        glyphPixels.push({ r, g, b, dist });
      }
    }
  }

  let textR = 0;
  let textG = 0;
  let textB = 0;

  if (glyphPixels.length > 0) {
    // Sort descending by contrast distance to target the core stroke pixels (avoiding edge blur)
    glyphPixels.sort((a, b) => b.dist - a.dist);
    const topCount = Math.max(1, Math.min(glyphPixels.length, Math.ceil(glyphPixels.length * 0.35)));
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    for (let i = 0; i < topCount; i++) {
      sumR += glyphPixels[i].r;
      sumG += glyphPixels[i].g;
      sumB += glyphPixels[i].b;
    }
    textR = Math.round(sumR / topCount);
    textG = Math.round(sumG / topCount);
    textB = Math.round(sumB / topCount);
  } else {
    // Fallback based on background perceived luminance
    const lum = 0.299 * bgR + 0.587 * bgG + 0.114 * bgB;
    if (lum < 128) {
      textR = 255;
      textG = 255;
      textB = 255;
    } else {
      textR = 0;
      textG = 0;
      textB = 0;
    }
  }

  const toHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0")).join("");

  return {
    backgroundColor: toHex(bgR, bgG, bgB),
    color: toHex(textR, textG, textB),
  };
}

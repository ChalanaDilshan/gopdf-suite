"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy, 
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Image as ImageIcon, 
  Download, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Settings2, 
  ShieldCheck, 
  Sparkles,
  GripVertical
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Dropzone } from "@/components/ui/Dropzone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CompletionNextActions } from "@/components/tools/CompletionNextActions";
import { formatBytes, truncateFileName, cn } from "@/lib/utils";
import { HowToStep, FaqItem } from "@/types";
import { ToolContentGuideProps } from "@/components/seo/ToolContentGuide";

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number; // 0, 90, 180, 270
  width: number;
  height: number;
}

export type PageOrientation = "auto" | "portrait" | "landscape";
export type PageSize = "fit" | "a4" | "letter";
export type PageMargin = "none" | "small" | "large";

export interface ImagesToPdfWorkspaceProps {
  toolSlug: "jpg-to-pdf" | "png-to-pdf";
  title: string;
  description: string;
  badgeText?: string;
  defaultFormatLabel: string; // e.g. "JPG" or "PNG"
  acceptedTypes?: string[];
  steps: HowToStep[];
  faqItems: FaqItem[];
  contentGuide?: ToolContentGuideProps;
}

const DEFAULT_IMAGE_ACCEPTS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const PAGE_DIMENSIONS: Record<PageSize, { width: number; height: number }> = {
  fit: { width: 0, height: 0 },
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const MARGIN_SIZES: Record<PageMargin, number> = {
  none: 0,
  small: 20,
  large: 40,
};

interface SortableImageCardProps {
  item: ImageItem;
  index: number;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

function SortableImageCard({
  item,
  index,
  onRotate,
  onRemove,
  disabled = false,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border p-3 transition-all duration-200 select-none bg-white dark:bg-slate-900 shadow-2xs",
        isDragging && "z-50 shadow-2xl scale-105 border-blue-500 ring-2 ring-blue-500/30 opacity-95",
        !isDragging && "border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/80 hover:shadow-md",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {/* Top Header: Drag Handle, Page Badge & Delete Action */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/80 text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
            {index + 1}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          title="Remove image"
          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Image Preview Canvas */}
      <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-1.5">
        <img
          src={item.previewUrl}
          alt={item.file.name}
          style={{
            transform: `rotate(${item.rotation}deg)`,
            transition: "transform 0.2s ease-in-out",
          }}
          className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-xs"
        />
      </div>

      {/* Footer: File Name & Quick Rotate Action */}
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          <span className="truncate max-w-[120px]">{item.file.name}</span>
          <span className="text-[10px] text-slate-400">{formatBytes(item.file.size)}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
          <span className="text-slate-400 font-medium">
            {item.width} × {item.height}px
          </span>

          <button
            type="button"
            onClick={() => onRotate(item.id)}
            title="Rotate 90 degrees"
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
          >
            <RotateCw className="h-3 w-3" />
            <span>{item.rotation}°</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImagesToPdfWorkspace({
  toolSlug,
  title,
  description,
  badgeText = "100% Client-Side / Secure",
  defaultFormatLabel,
  acceptedTypes = DEFAULT_IMAGE_ACCEPTS,
  steps,
  faqItems,
  contentGuide,
}: ImagesToPdfWorkspaceProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [orientation, setOrientation] = useState<PageOrientation>("auto");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [margin, setMargin] = useState<PageMargin>("small");

  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string | null>(null);
  const [pdfSizeBytes, setPdfSizeBytes] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Setup sensors for @dnd-kit drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFilesAdded = useCallback(async (files: File[]) => {
    const validFiles = files.filter(
      (f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|avif|gif)$/i.test(f.name)
    );
    if (validFiles.length === 0) return;

    setError(null);
    setDownloadUrl(null);

    const newItems: ImageItem[] = await Promise.all(
      validFiles.map(async (file) => {
        const previewUrl = URL.createObjectURL(file);
        const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
          img.onerror = () => resolve({ width: 800, height: 600 });
          img.src = previewUrl;
        });

        return {
          id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          previewUrl,
          rotation: 0,
          width: dimensions.width,
          height: dimensions.height,
        };
      })
    );

    setImages((prev) => [...prev, ...newItems]);
  }, []);

  // Ingest transferred files from homepage dropzone if available
  useEffect(() => {
    import("@/lib/fileTransfer").then(({ getTransferredFiles }) => {
      const transferred = getTransferredFiles();
      if (transferred.length > 0) {
        handleFilesAdded(transferred);
      }
    });
  }, [handleFilesAdded]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const next = [...items];
          const [moved] = next.splice(oldIndex, 1);
          next.splice(newIndex, 0, moved);
          return next;
        }
        return items;
      });
    }
  };

  const handleRotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClear = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setImages([]);
    setDownloadUrl(null);
    setOutputFileName(null);
    setProgress(0);
    setError(null);
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0 || isConverting) return;

    setIsConverting(true);
    setProgress(5);
    setStatusMessage("Initializing PDF canvas in browser memory...");
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      const total = images.length;
      const marginPt = MARGIN_SIZES[margin];

      for (let i = 0; i < total; i++) {
        const item = images[i];
        const stepProgress = 10 + Math.round(((i + 1) / total) * 80);
        setProgress(stepProgress);
        setStatusMessage(`Processing image ${i + 1} of ${total}: ${truncateFileName(item.file.name, 25)}...`);

        // Check format and rotation
        const isJpg = item.file.type === "image/jpeg" || /\.(jpe?g)$/i.test(item.file.name);
        const isPng = item.file.type === "image/png" || /\.png$/i.test(item.file.name);
        const isRotated = item.rotation !== 0;

        let embeddedImage: any = null;
        let effectiveW = item.width;
        let effectiveH = item.height;

        // Fast-path: embed direct JPG / PNG if unrotated
        if (!isRotated && (isJpg || isPng)) {
          try {
            const arrayBuffer = await item.file.arrayBuffer();
            if (isJpg) {
              embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
            } else if (isPng) {
              embeddedImage = await pdfDoc.embedPng(arrayBuffer);
            }
          } catch {
            // Fall back to canvas normalization on error (e.g. CMYK JPEG or interlaced PNG)
            embeddedImage = null;
          }
        }

        // Normalization path: rotated image, WebP, or non-standard format
        if (!embeddedImage) {
          const canvas = document.createElement("canvas");
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to decode image ${item.file.name}`));
            img.src = item.previewUrl;
          });

          const isRotated90or270 = item.rotation === 90 || item.rotation === 270;
          const naturalW = img.naturalWidth || item.width;
          const naturalH = img.naturalHeight || item.height;

          effectiveW = isRotated90or270 ? naturalH : naturalW;
          effectiveH = isRotated90or270 ? naturalW : naturalH;

          canvas.width = effectiveW;
          canvas.height = effectiveH;
          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) throw new Error("Could not initialize 2D canvas context");

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, effectiveW, effectiveH);

          // Apply rotation on canvas
          ctx.save();
          ctx.translate(effectiveW / 2, effectiveH / 2);
          ctx.rotate((item.rotation * Math.PI) / 180);
          ctx.drawImage(img, -naturalW / 2, -naturalH / 2);
          ctx.restore();

          const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.92);
          canvas.width = 0;
          canvas.height = 0;

          embeddedImage = await pdfDoc.embedJpg(jpegDataUrl);
        }

        // Determine Page Size
        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === "fit") {
          pageWidth = effectiveW + marginPt * 2;
          pageHeight = effectiveH + marginPt * 2;
        } else {
          const dims = PAGE_DIMENSIONS[pageSize];
          let baseW = dims.width;
          let baseH = dims.height;

          if (orientation === "portrait") {
            pageWidth = Math.min(baseW, baseH);
            pageHeight = Math.max(baseW, baseH);
          } else if (orientation === "landscape") {
            pageWidth = Math.max(baseW, baseH);
            pageHeight = Math.min(baseW, baseH);
          } else {
            // Auto: Match Image aspect ratio
            if (effectiveW > effectiveH) {
              pageWidth = Math.max(baseW, baseH);
              pageHeight = Math.min(baseW, baseH);
            } else {
              pageWidth = Math.min(baseW, baseH);
              pageHeight = Math.max(baseW, baseH);
            }
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate fitted image placement preserving aspect ratio
        const availW = Math.max(1, pageWidth - marginPt * 2);
        const availH = Math.max(1, pageHeight - marginPt * 2);

        const imgAspect = effectiveW / effectiveH;
        const pageAspect = availW / availH;

        let drawW: number;
        let drawH: number;

        if (imgAspect > pageAspect) {
          drawW = availW;
          drawH = availW / imgAspect;
        } else {
          drawH = availH;
          drawW = availH * imgAspect;
        }

        const xPos = marginPt + (availW - drawW) / 2;
        const yPos = marginPt + (availH - drawH) / 2;

        page.drawImage(embeddedImage, {
          x: xPos,
          y: yPos,
          width: drawW,
          height: drawH,
        });
      }

      setProgress(95);
      setStatusMessage("Saving compiled PDF document...");

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const firstImageBaseName = images[0].file.name.replace(/\.[^/.]+$/, "");
      const generatedName = images.length === 1 ? `${firstImageBaseName}.pdf` : `converted_images_${images.length}_pages.pdf`;

      setDownloadUrl(url);
      setOutputFileName(generatedName);
      setPdfSizeBytes(blob.size);
      setProgress(100);
      setStatusMessage("Conversion complete!");
    } catch (err: any) {
      console.error("Image to PDF conversion failed:", err);
      setError(err?.message || "An unexpected error occurred during image conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolLayout
      title={title}
      description={description}
      badgeText={badgeText}
      category="Convert to PDF"
      toolSlug={toolSlug}
      steps={steps}
      faqItems={faqItems}
      contentGuide={contentGuide}
    >
      <div className="space-y-6">
        {/* State 1: Dropzone when no images uploaded */}
        {images.length === 0 ? (
          <Dropzone
            onFilesSelected={handleFilesAdded}
            maxFiles={100}
            accept={acceptedTypes}
            title={`Drop your ${defaultFormatLabel} images here to convert to PDF`}
            subtitle="Select multiple images. Arrange order with drag & drop, adjust margins and page orientation with instant live preview."
          />
        ) : (
          <div className="space-y-6">
            {/* Header Toolbar: Images Count & Add More */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {images.length} {images.length === 1 ? "Image" : "Images"} Ready
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Drag and drop cards to reorder, configure orientation, and compile into a unified PDF.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(",")}
                    disabled={isConverting}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesAdded(Array.from(e.target.files));
                        e.target.value = "";
                      }
                    }}
                  />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                    Add More Images
                  </span>
                </label>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isConverting}
                  onClick={handleClear}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Error Feedback Notice */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-4 text-xs text-red-700 dark:text-red-300 animate-fadeIn"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Processing Notice</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Conversion Options Settings Bar */}
            {!downloadUrl && !isConverting && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Settings2 className="h-4 w-4 text-blue-600" />
                  <span>PDF Document Options</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Page Orientation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Page Orientation
                    </label>
                    <select
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as PageOrientation)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="auto">Match Image (Auto)</option>
                      <option value="portrait">Portrait (Vertical)</option>
                      <option value="landscape">Landscape (Horizontal)</option>
                    </select>
                  </div>

                  {/* Page Format */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Page Dimensions
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value as PageSize)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fit">Fit to Image (Exact resolution)</option>
                      <option value="a4">A4 (Standard document)</option>
                      <option value="letter">US Letter</option>
                    </select>
                  </div>

                  {/* Margin Padding */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Margin Padding
                    </label>
                    <select
                      value={margin}
                      onChange={(e) => setMargin(e.target.value as PageMargin)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">No Margin (Full bleed)</option>
                      <option value="small">Small Margin (20pt padding)</option>
                      <option value="large">Big Margin (40pt padding)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Sortable Drag-and-Drop Thumbnail Grid */}
            {!downloadUrl && !isConverting && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={images.map((img) => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {images.map((img, idx) => (
                      <SortableImageCard
                        key={img.id}
                        item={img}
                        index={idx}
                        onRotate={handleRotateImage}
                        onRemove={handleRemoveImage}
                        disabled={isConverting}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Bottom Conversion Action Bar */}
            {!downloadUrl && !isConverting && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Client-Side • Embedded in native resolution via pdf-lib</span>
                </div>

                <Button
                  size="lg"
                  onClick={handleConvertToPdf}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  className="w-full sm:w-auto shadow-md shadow-blue-600/20"
                >
                  Convert {images.length} {images.length === 1 ? "Image" : "Images"} to PDF →
                </Button>
              </div>
            )}

            {/* Progress Bar during conversion */}
            {isConverting && (
              <div className="pt-2 animate-fadeIn">
                <ProgressBar
                  progress={progress}
                  label={statusMessage || `Compiling PDF document (${progress}%)...`}
                  status="loading"
                />
              </div>
            )}

            {/* Success Download Card */}
            {downloadUrl && !isConverting && (
              <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 p-6 sm:p-8 text-center animate-fadeIn shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 mb-4">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  PDF Successfully Created!
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Your {images.length} images were compiled into a high-quality PDF in browser memory.
                </p>

                <div className="my-5 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{outputFileName}</span>
                  <span>•</span>
                  <span>{images.length} Pages</span>
                  <span>•</span>
                  <span>{formatBytes(pdfSizeBytes)}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={downloadUrl}
                    download={outputFileName || "images-converted.pdf"}
                    className="inline-block"
                  >
                    <Button
                      size="lg"
                      leftIcon={<Download className="h-4 w-4" />}
                      className="bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                    >
                      Download Converted PDF
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<RotateCcw className="h-4 w-4" />}
                    onClick={handleClear}
                  >
                    Convert More Images
                  </Button>
                </div>

                {/* Chained Workflow Quick Next Actions */}
                <CompletionNextActions
                  downloadUrl={downloadUrl}
                  fileName={outputFileName || "converted-images.pdf"}
                  currentTool={toolSlug}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

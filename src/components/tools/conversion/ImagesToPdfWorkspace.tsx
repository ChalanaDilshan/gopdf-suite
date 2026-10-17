"use client";

import React, { useState, useRef, useCallback } from "react";
import { 
  Image as ImageIcon, 
  Download, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Settings2, 
  FileCheck,
  ShieldCheck,
  Layers,
  Sparkles
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Dropzone } from "@/components/ui/Dropzone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CompletionNextActions } from "@/components/tools/CompletionNextActions";
import { formatBytes, truncateFileName } from "@/lib/utils";
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

  const handleFilesAdded = useCallback(async (files: File[]) => {
    const validFiles = files.filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|avif|gif)$/i.test(f.name));
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

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
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

        // Render to canvas if rotated or not direct JPG/PNG
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

        const effectiveW = isRotated90or270 ? naturalH : naturalW;
        const effectiveH = isRotated90or270 ? naturalW : naturalH;

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

        const embeddedImage = await pdfDoc.embedJpg(jpegDataUrl);

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
            // auto match image orientation
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
            subtitle="Select multiple images. Arrange order, adjust margins and page orientation with instant live preview."
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
                    Reorder images, configure orientation and compile into a single PDF.
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
                  {/* Orientation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Page Orientation
                    </label>
                    <select
                      value={orientation}
                      onChange={(e) => setOrientation(e.target.value as PageOrientation)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="auto">Auto (Match each image)</option>
                      <option value="portrait">Portrait (Vertical)</option>
                      <option value="landscape">Landscape (Horizontal)</option>
                    </select>
                  </div>

                  {/* Page Size */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Page Format
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value as PageSize)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="a4">A4 (Standard document)</option>
                      <option value="letter">US Letter</option>
                      <option value="fit">Fit (Same as image pixels)</option>
                    </select>
                  </div>

                  {/* Margin */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Page Margins
                    </label>
                    <select
                      value={margin}
                      onChange={(e) => setMargin(e.target.value as PageMargin)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">No Margin (Full bleed)</option>
                      <option value="small">Small Margin (Clean padding)</option>
                      <option value="large">Big Margin</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnail Cards Grid */}
            {!downloadUrl && !isConverting && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-2xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all"
                  >
                    {/* Header: Page Badge & Delete Button */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        title="Remove image"
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Image Preview Canvas */}
                    <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-1">
                      <img
                        src={img.previewUrl}
                        alt={img.file.name}
                        style={{
                          transform: `rotate(${img.rotation}deg)`,
                          transition: "transform 0.2s ease-in-out",
                        }}
                        className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-xs"
                      />
                    </div>

                    {/* Footer: Name & Rotation / Move Actions */}
                    <div className="mt-2 space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {img.file.name}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, "left")}
                            title="Move left"
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === images.length - 1}
                            onClick={() => handleMoveImage(idx, "right")}
                            title="Move right"
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRotateImage(img.id)}
                          title="Rotate 90 degrees"
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                        >
                          <RotateCw className="h-3 w-3" />
                          <span>{img.rotation}°</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Conversion Action Bar */}
            {!downloadUrl && !isConverting && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Client-Side • Embedded at full native resolution</span>
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

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  FileText, 
  Download, 
  RotateCcw, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  Settings2, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Archive,
  Eye,
  Check
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Dropzone } from "@/components/ui/Dropzone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CompletionNextActions } from "@/components/tools/CompletionNextActions";
import { formatBytes, truncateFileName } from "@/lib/utils";
import { HowToStep, FaqItem } from "@/types";
import { ToolContentGuideProps } from "@/components/seo/ToolContentGuide";
import JSZip from "jszip";

export type ImageFormat = "jpg" | "png";
export type ResolutionScale = 1.5 | 2.0 | 2.5;

export interface ExtractedImage {
  pageNumber: number;
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  fileName: string;
}

export interface PdfToImagesWorkspaceProps {
  toolSlug: "pdf-to-jpg" | "pdf-to-png";
  title: string;
  description: string;
  badgeText?: string;
  defaultFormat: ImageFormat;
  steps: HowToStep[];
  faqItems: FaqItem[];
  contentGuide?: ToolContentGuideProps;
}

export function PdfToImagesWorkspace({
  toolSlug,
  title,
  description,
  badgeText = "100% Client-Side / Secure",
  defaultFormat,
  steps,
  faqItems,
  contentGuide,
}: PdfToImagesWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageFormat>(defaultFormat);
  const [scale, setScale] = useState<ResolutionScale>(2.0);
  const [jpegQuality, setJpegQuality] = useState<number>(0.85);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPageNumbers, setSelectedPageNumbers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(true);

  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const [isZipping, setIsZipping] = useState(false);

  // Consume transferred files from homepage dropzone or chained workflow
  useEffect(() => {
    import("@/lib/fileTransfer").then(({ getTransferredFiles }) => {
      const transferred = getTransferredFiles();
      if (transferred.length > 0) {
        handleFileSelected(transferred[0]);
      }
    });
  }, []);

  const handleFileSelected = async (file: File) => {
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) return;

    setSelectedFile(file);
    setError(null);
    setExtractedImages([]);
    setProgress(0);

    try {
      const pdfjs = await import("pdfjs-dist");
      if (typeof window !== "undefined") {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/pdf.worker.min.js`;
      }

      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: buffer,
        cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
        cMapPacked: true,
        isEvalSupported: false,
      });

      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);
      // Select all pages by default
      const allNums = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
      setSelectedPageNumbers(allNums);
      setSelectAll(true);
    } catch (err: any) {
      console.error("Failed to load PDF metadata", err);
      setError("Could not parse PDF. Please ensure the file is valid and unencrypted.");
    }
  };

  const togglePageSelection = (pageNum: number) => {
    setSelectedPageNumbers((prev) => {
      const exists = prev.includes(pageNum);
      const updated = exists ? prev.filter((p) => p !== pageNum) : [...prev, pageNum].sort((a, b) => a - b);
      setSelectAll(updated.length === totalPages);
      return updated;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedPageNumbers([]);
      setSelectAll(false);
    } else {
      const allNums = Array.from({ length: totalPages }, (_, i) => i + 1);
      setSelectedPageNumbers(allNums);
      setSelectAll(true);
    }
  };

  const handleClear = () => {
    extractedImages.forEach((img) => URL.revokeObjectURL(img.dataUrl));
    setSelectedFile(null);
    setExtractedImages([]);
    setTotalPages(0);
    setSelectedPageNumbers([]);
    setError(null);
    setProgress(0);
  };

  const handleConvertToImages = async () => {
    if (!selectedFile || selectedPageNumbers.length === 0 || isConverting) return;

    setIsConverting(true);
    setProgress(5);
    setStatusMessage("Initializing canvas renderer in browser memory...");
    setError(null);
    setExtractedImages([]);

    try {
      const pdfjs = await import("pdfjs-dist");
      if (typeof window !== "undefined") {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/pdf.worker.min.js`;
      }

      const buffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: buffer,
        cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
        cMapPacked: true,
        isEvalSupported: false,
      });

      const pdf = await loadingTask.promise;
      const baseName = selectedFile.name.replace(/\.pdf$/i, "");
      const ext = format === "jpg" ? "jpg" : "png";
      const mime = format === "jpg" ? "image/jpeg" : "image/png";

      const results: ExtractedImage[] = [];
      const totalToProcess = selectedPageNumbers.length;

      for (let i = 0; i < totalToProcess; i++) {
        const pageNum = selectedPageNumbers[i];
        const stepProgress = 10 + Math.round(((i + 1) / totalToProcess) * 85);
        setProgress(stepProgress);
        setStatusMessage(`Rendering page ${pageNum} (${i + 1} of ${totalToProcess}) at ${scale}x HD resolution...`);

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext("2d", { alpha: format === "png" });
        if (!ctx) throw new Error("Could not initialize canvas context");

        if (format === "jpg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error(`Failed to convert page ${pageNum} to image`));
            },
            mime,
            format === "jpg" ? jpegQuality : undefined
          );
        });

        const dataUrl = URL.createObjectURL(blob);
        const fileName = `${baseName}_page_${pageNum}.${ext}`;

        results.push({
          pageNumber: pageNum,
          blob,
          dataUrl,
          width: canvas.width,
          height: canvas.height,
          sizeBytes: blob.size,
          fileName,
        });

        canvas.width = 0;
        canvas.height = 0;
      }

      setProgress(100);
      setStatusMessage("All pages extracted successfully!");
      setExtractedImages(results);
    } catch (err: any) {
      console.error("PDF to image extraction failed:", err);
      setError(err?.message || "Failed to render PDF pages into images.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadAllZip = async () => {
    if (extractedImages.length === 0 || isZipping) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const baseName = selectedFile ? selectedFile.name.replace(/\.pdf$/i, "") : "extracted_pages";

      for (const item of extractedImages) {
        zip.file(item.fileName, item.blob);
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const zipUrl = URL.createObjectURL(zipBlob);
      const anchor = document.createElement("a");
      anchor.href = zipUrl;
      anchor.download = `${baseName}_images.zip`;
      anchor.click();
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error("Failed to build ZIP file", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <ToolLayout
      title={title}
      description={description}
      badgeText={badgeText}
      category="Convert from PDF"
      toolSlug={toolSlug}
      steps={steps}
      faqItems={faqItems}
      contentGuide={contentGuide}
    >
      <div className="space-y-6">
        {/* State 1: Dropzone when no file is active */}
        {!selectedFile ? (
          <Dropzone
            onFilesSelected={(files) => files.length > 0 && handleFileSelected(files[0])}
            maxFiles={1}
            title={`Drop your PDF here to convert to ${format.toUpperCase()} images`}
            subtitle="Extract all or selected pages into crisp, high-resolution image files."
          />
        ) : (
          <div className="space-y-6">
            {/* Header Toolbar: Active Document Info & File Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                    {truncateFileName(selectedFile.name, 35)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {totalPages} {totalPages === 1 ? "page" : "pages"} • {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={isConverting}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileSelected(e.target.files[0]);
                        e.target.value = "";
                      }
                    }}
                  />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors">
                    Change File
                  </span>
                </label>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isConverting}
                  onClick={handleClear}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs"
                >
                  Clear
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

            {/* Conversion Controls Panel */}
            {extractedImages.length === 0 && !isConverting && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Settings2 className="h-4 w-4 text-blue-600" />
                  <span>Image Conversion Settings</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Format */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as ImageFormat)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="jpg">JPG (Standard photo compression)</option>
                      <option value="png">PNG (Lossless &amp; transparent)</option>
                    </select>
                  </div>

                  {/* DPI / Resolution Scale */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Output Quality / DPI
                    </label>
                    <select
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value) as ResolutionScale)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1.5}>Standard Web (1.5x / ~108 DPI)</option>
                      <option value={2.0}>High Definition (2.0x / 144 DPI - Recommended)</option>
                      <option value={2.5}>Ultra Print Sharpness (2.5x / 180 DPI)</option>
                    </select>
                  </div>

                  {/* Page Scope Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Pages to Convert
                      </label>
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {selectAll ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {selectedPageNumbers.length} of {totalPages} {totalPages === 1 ? "page" : "pages"} selected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Page Selection Checkbox Badges */}
                {totalPages > 1 && (
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Click to toggle pages:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                        const isSelected = selectedPageNumbers.includes(num);
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => togglePageSelection(num)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-2xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            <span>#{num}</span>
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom CTA Button */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Rendered 100% locally in browser canvas memory</span>
                  </div>

                  <Button
                    size="lg"
                    disabled={selectedPageNumbers.length === 0}
                    onClick={handleConvertToImages}
                    leftIcon={<Sparkles className="h-4 w-4" />}
                    className="w-full sm:w-auto shadow-md shadow-blue-600/20"
                  >
                    Convert {selectedPageNumbers.length} {selectedPageNumbers.length === 1 ? "Page" : "Pages"} to {format.toUpperCase()} →
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Bar during conversion */}
            {isConverting && (
              <div className="pt-2 animate-fadeIn">
                <ProgressBar
                  progress={progress}
                  label={statusMessage || `Extracting pages (${progress}%)...`}
                  status="loading"
                />
              </div>
            )}

            {/* Success State: Extracted Images Gallery + Download Actions */}
            {extractedImages.length > 0 && !isConverting && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 p-6 sm:p-8 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {extractedImages.length} {extractedImages.length === 1 ? "Image" : "Images"} Extracted Successfully!
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Download all images as a single convenient .ZIP archive or save individual pages below.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      size="lg"
                      isLoading={isZipping}
                      onClick={handleDownloadAllZip}
                      leftIcon={<Archive className="h-4 w-4" />}
                      className="bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                    >
                      Download All as ZIP (.zip)
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      leftIcon={<RotateCcw className="h-4 w-4" />}
                      onClick={handleClear}
                    >
                      Convert Another PDF
                    </Button>
                  </div>
                </div>

                {/* Visual Image Grid of Extracted Pages */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      Extracted Page Previews
                    </h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {extractedImages.length} files generated
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {extractedImages.map((img) => (
                      <div
                        key={img.pageNumber}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-2xs hover:shadow-md transition-all"
                      >
                        <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-1">
                          <img
                            src={img.dataUrl}
                            alt={img.fileName}
                            className="max-h-full max-w-full object-contain drop-shadow-xs"
                          />
                        </div>

                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <span>Page #{img.pageNumber}</span>
                            <span className="text-slate-400 font-normal">{formatBytes(img.sizeBytes)}</span>
                          </div>

                          <a
                            href={img.dataUrl}
                            download={img.fileName}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download {format.toUpperCase()}</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chained Workflow Quick Next Actions */}
                {selectedFile && (
                  <CompletionNextActions
                    downloadUrl={URL.createObjectURL(selectedFile)}
                    fileName={selectedFile.name}
                    currentTool={toolSlug}
                    fileBlob={selectedFile}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

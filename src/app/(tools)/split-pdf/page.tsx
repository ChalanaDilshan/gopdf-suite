"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  RotateCcw, 
  Split, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  ShieldCheck,
  FileCheck,
  Layers
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Dropzone } from "@/components/ui/Dropzone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import dynamic from "next/dynamic";

const SplitPageSelector = dynamic(
  () => import("@/components/tools/SplitPageSelector").then((mod) => mod.SplitPageSelector),
  { ssr: false }
);
import { usePdfThumbnails } from "@/hooks/usePdfThumbnails";
import { usePdfSplitter } from "@/hooks/usePdfSplitter";
import { formatBytes, truncateFileName } from "@/lib/utils";
import { HowToStep, FaqItem } from "@/types";
import { SPLIT_TOOL_GUIDE } from "@/lib/toolGuides";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload your PDF",
    description: "Drop your PDF file into the secure dropzone. Instant visual thumbnails generate automatically in your browser.",
  },
  {
    stepNumber: 2,
    title: "Select pages to extract",
    description: "Click thumbnails to check specific pages, use Quick Select (odd/even), or enter custom ranges like 1-3, 5.",
  },
  {
    stepNumber: 3,
    title: "Extract and Save",
    description: "Click 'Extract Pages' to assemble your custom document. Download your new PDF immediately with zero wait time.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-extract-free",
    question: "How do I extract specific pages from a PDF for free?",
    answer:
      "Upload your PDF to GoPDF, view the visual page previews, and select the exact pages you want to keep using your mouse or by typing a custom page range (e.g. '1-4, 7, 9-12'). Click 'Extract Selected Pages' to immediately download a new PDF containing only your chosen pages without watermarks.",
  },
  {
    id: "range-patterns",
    question: "Can I extract non-consecutive page ranges?",
    answer:
      "Yes. You can select any combination of non-contiguous pages either visually by clicking individual cards or via the Custom Range input using commas and hyphens (e.g., '1-3, 5, 8, 11-14').",
  },
  {
    id: "privacy-safety",
    question: "Is client-side PDF splitting safe for confidential and sensitive files?",
    answer:
      "Absolutely. Unlike traditional PDF conversion websites that send your document to third-party servers, GoPDF processes everything locally inside your browser's WebAssembly and HTML5 Canvas sandbox. Your sensitive data never leaves your device.",
  },
  {
    id: "original-file",
    question: "Does splitting or extracting modify my original PDF file?",
    answer:
      "No. Your original file remains untouched on your device. The extractor reads the pages in memory and generates an entirely separate PDF containing only the extracted pages.",
  },
];

export default function SplitPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  // Thumbnail generation hook
  const {
    thumbnails,
    totalPages,
    isLoadingThumbnails,
    renderingProgress,
    error: thumbnailError,
    loadThumbnails,
    reset: resetThumbnails,
  } = usePdfThumbnails();

  // PDF Splitter engine hook
  const {
    isSplitting,
    progress: splitProgress,
    downloadUrl,
    outputFileName,
    error: splitError,
    splitPdf,
    reset: resetSplitter,
  } = usePdfSplitter();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setSelectedPages([]);
    resetSplitter();
    await loadThumbnails(file);
  };

  React.useEffect(() => {
    import("@/lib/fileTransfer").then(({ getTransferredFiles }) => {
      const transferred = getTransferredFiles();
      if (transferred.length > 0) {
        handleFilesSelected(transferred);
      }
    });
  }, []);

  const handleClear = () => {
    setSelectedFile(null);
    setSelectedPages([]);
    resetThumbnails();
    resetSplitter();
  };

  const handleExtract = async () => {
    if (!selectedFile || selectedPages.length === 0 || isSplitting) return;
    await splitPdf(selectedFile, selectedPages);
  };

  const errorMessage = thumbnailError || splitError;

  return (
    <ToolLayout
      title="Split PDF & Extract Pages"
      description="Visually preview every page of your PDF and extract only the pages you need into a new standalone document. 100% private and on-device."
      badgeText="100% Client-Side / Secure"
      category="Organize PDF"
      toolSlug="split-pdf"
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
      contentGuide={SPLIT_TOOL_GUIDE}
    >
      <div className="space-y-6">
        {/* State 1: Dropzone if no file selected */}
        {!selectedFile ? (
          <Dropzone
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            title="Drop your PDF here to extract pages"
            subtitle="Select a PDF document from your device to preview all pages"
          />
        ) : (
          <div className="space-y-6">
            {/* Header Control Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                    {truncateFileName(selectedFile.name, 40)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatBytes(selectedFile.size)}
                    {totalPages > 0 && ` • ${totalPages} total pages`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={isSplitting}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesSelected(Array.from(e.target.files));
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
                  disabled={isSplitting}
                  onClick={handleClear}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Error Feedback */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-4 text-xs text-red-700 dark:text-red-300 animate-fadeIn"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Processing Error</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Thumbnail Rendering Progress Bar */}
            {isLoadingThumbnails && (
              <div className="pt-2 animate-fadeIn">
                <ProgressBar
                  progress={renderingProgress}
                  label={`Generating crisp browser previews (${renderingProgress}%)...`}
                  status="loading"
                />
              </div>
            )}

            {/* Visual Page Selector Component */}
            {thumbnails.length > 0 && (
              <SplitPageSelector
                thumbnails={thumbnails}
                totalPages={totalPages}
                isLoadingThumbnails={isLoadingThumbnails}
                selectedPages={selectedPages}
                onSelectionChange={setSelectedPages}
                disabled={isSplitting}
              />
            )}

            {/* Extraction Progress Bar */}
            {isSplitting && (
              <div className="pt-2 animate-fadeIn">
                <ProgressBar
                  progress={splitProgress}
                  label="Extracting selected pages into a new PDF in browser memory..."
                  status="loading"
                />
              </div>
            )}

            {/* Success Download Card */}
            {downloadUrl && !isSplitting && (
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 p-6 sm:p-8 text-center animate-fadeIn shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 mb-4">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Pages Successfully Extracted!
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Your new document containing {selectedPages.length} selected pages is ready. It was created 100% locally on your machine.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={downloadUrl}
                    download={outputFileName || "extracted-pages.pdf"}
                    className="inline-block"
                  >
                    <Button
                      size="lg"
                      leftIcon={<Download className="h-4 w-4" />}
                      className="bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                    >
                      Download Extracted PDF
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<RotateCcw className="h-4 w-4" />}
                    onClick={handleClear}
                  >
                    Split Another PDF
                  </Button>
                </div>
              </div>
            )}

            {/* Action Bar (When not already downloaded) */}
            {!downloadUrl && !isSplitting && thumbnails.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedPages.length === 0
                    ? "Click on pages above to select them for extraction."
                    : `Ready to extract ${selectedPages.length} of ${totalPages} pages.`}
                </p>

                <Button
                  size="lg"
                  disabled={selectedPages.length === 0 || isSplitting}
                  leftIcon={<Split className="h-4 w-4" />}
                  onClick={handleExtract}
                  className="w-full sm:w-auto shadow-md shadow-blue-600/20"
                >
                  Extract {selectedPages.length} {selectedPages.length === 1 ? "Page" : "Pages"} Now
                </Button>
              </div>
            )}
          </div>
        )}


      </div>
    </ToolLayout>
  );
}

"use client";

import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FolderPlus, 
  List, 
  Trash2, 
  Plus, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import dynamic from "next/dynamic";
import { HeroBanner } from "@/components/tools/HeroBanner";
import { PdfToolsSidebar } from "@/components/tools/PdfToolsSidebar";
import { usePdfMerger } from "@/hooks/usePdfMerger";
import { UploadedPdfFile } from "@/types";

const MergeList = dynamic(
  () => import("@/components/tools/MergeList").then((mod) => mod.MergeList),
  { ssr: false }
);

const MergeActionPanels = dynamic(
  () => import("@/components/tools/MergeActionPanels").then((mod) => mod.MergeActionPanels),
  { ssr: false }
);

const HowItWorksAndFaq = dynamic(
  () => import("@/components/tools/HowItWorksAndFaq").then((mod) => mod.HowItWorksAndFaq),
  { ssr: true }
);

import { ToolContentGuide } from "@/components/seo/ToolContentGuide";
import { MERGE_TOOL_GUIDE } from "@/lib/toolGuides";

export default function MergePdfPage() {
  const [files, setFiles] = useState<UploadedPdfFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [resultStats, setResultStats] = useState<{
    name: string;
    pageCount: number;
    size: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const {
    isProcessing,
    progress,
    downloadUrl,
    error,
    mergeFiles,
    reset: resetMerger,
  } = usePdfMerger();

  const readPageCount = async (file: File): Promise<number | undefined> => {
    try {
      const [{ PDFDocument }, buffer] = await Promise.all([
        import("pdf-lib"),
        file.slice(0, Math.min(file.size, 5 * 1024 * 1024)).arrayBuffer(),
      ]);
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      return pdf.getPageCount();
    } catch {
      return undefined;
    }
  };

  const handleAddFiles = (newRawFiles: File[]) => {
    const validPdfs = newRawFiles.filter((f) => f.name.toLowerCase().endsWith(".pdf"));
    if (validPdfs.length === 0) return;

    const formatted: UploadedPdfFile[] = validPdfs.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
    }));

    setFiles((prev) => [...prev, ...formatted]);
    resetMerger();
    setResultStats(null);

    formatted.forEach((item) => {
      readPageCount(item.file).then((count) => {
        if (typeof count === "number") {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, pageCount: count } : f))
          );
        }
      });
    });
  };

  React.useEffect(() => {
    import("@/lib/fileTransfer").then(({ getTransferredFiles }) => {
      const transferred = getTransferredFiles();
      if (transferred.length > 0) {
        handleAddFiles(transferred);
      }
    });
  }, []);

  const handleLoadSampleFiles = async () => {
    try {
      const { PDFDocument } = await import("pdf-lib");
      const samples = [
        { name: "Research_Paper.pdf", pages: 12, sizeEstimate: 2400000 },
        { name: "Thesis_Chapter1.pdf", pages: 28, sizeEstimate: 5100000 },
        { name: "Appendix.pdf", pages: 6, sizeEstimate: 1200000 },
      ];

      const generatedFiles: UploadedPdfFile[] = [];

      for (const sample of samples) {
        const doc = await PDFDocument.create();
        const page = doc.addPage([595, 842]);
        page.drawText(sample.name, { x: 50, y: 750, size: 20 });
        const bytes = await doc.save();
        const fileObj = new File([bytes as unknown as BlobPart], sample.name, {
          type: "application/pdf",
        });

        generatedFiles.push({
          id: `${sample.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file: fileObj,
          name: sample.name,
          size: sample.sizeEstimate,
          lastModified: Date.now(),
          pageCount: sample.pages,
        });
      }

      setFiles(generatedFiles);
      resetMerger();
      setResultStats(null);
    } catch (err) {
      console.error("Error creating sample files:", err);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    resetMerger();
    setResultStats(null);
  };

  const handleClearAll = () => {
    setFiles([]);
    resetMerger();
    setResultStats(null);
  };

  const handleMergeAction = async () => {
    if (files.length < 2 || isProcessing) return;

    const totalPages = files.reduce((acc, f) => acc + (f.pageCount || 1), 0);
    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

    setResultStats({
      name: "Merged_Document.pdf",
      pageCount: totalPages,
      size: Math.round(totalBytes * 0.95),
    });

    const rawFiles = files.map((f) => f.file);
    await mergeFiles(rawFiles);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-150">
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-24 lg:pb-12 space-y-6">
        {/* Hero Section */}
        <HeroBanner />

        {/* Error Feedback Banner */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 p-4 text-xs text-red-700 dark:text-red-300 animate-fadeIn"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Main Responsive Interface Layout */}
        {/* Mobile: single column | lg+: 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* PDF Tools Sidebar — hidden on mobile, shown as collapsible on sm+ */}
          <div className="hidden lg:block lg:col-span-3">
            <PdfToolsSidebar currentTool="merge" />
          </div>

          {/* Center Column: Upload Zone + File List */}
          <div className="col-span-1 lg:col-span-6 space-y-4">
            {/* Drag & Drop Upload Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed bg-white dark:bg-[#131b2e] p-6 sm:p-9 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/40 scale-[1.01]"
                  : "border-blue-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                disabled={isProcessing}
                onChange={(e) => {
                  if (e.target.files) {
                    handleAddFiles(Array.from(e.target.files));
                    e.target.value = "";
                  }
                }}
                className="hidden"
                id="workspace-file-upload"
              />

              <div className="flex flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Drag &amp; drop PDF files here
                </h3>
                <span className="text-xs text-slate-400 dark:text-slate-500 my-1.5">or</span>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 shadow-xs transition-colors cursor-pointer min-h-[44px]"
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Choose Files</span>
                </button>

                <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                  Multiple files · Max 50MB each · PDF only
                </p>
              </div>
            </div>

            {/* Uploaded File List */}
            {files.length > 0 ? (
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-4 sm:p-5 shadow-xs space-y-3 transition-colors">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <List className="h-4 w-4 text-slate-400" />
                    <span>{files.length} {files.length === 1 ? "file" : "files"} added</span>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleClearAll}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer min-h-[36px] px-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear all</span>
                  </button>
                </div>

                {/* Sortable Cards */}
                <MergeList
                  files={files}
                  onReorder={setFiles}
                  onRemove={handleRemoveFile}
                  disabled={isProcessing}
                />

                {/* Add More Files */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer min-h-[44px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add more files</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-2">
                <button
                  id="sample-files-btn"
                  type="button"
                  onClick={handleLoadSampleFiles}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer min-h-[44px]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Try with 3 sample reference PDF files</span>
                </button>
              </div>
            )}

            {/* Mobile: Inline Action Panel (shown below file list on mobile) */}
            <div className="block lg:hidden">
              <MergeActionPanels
                fileCount={files.length}
                isProcessing={isProcessing}
                progress={progress}
                downloadUrl={downloadUrl}
                resultStats={resultStats}
                onStartMerge={handleMergeAction}
                onReset={() => {
                  resetMerger();
                  setResultStats(null);
                }}
                disabled={files.length < 2}
              />
            </div>
          </div>

          {/* Right Column: Action Panel — desktop only */}
          <div className="hidden lg:block lg:col-span-3">
            <MergeActionPanels
              fileCount={files.length}
              isProcessing={isProcessing}
              progress={progress}
              downloadUrl={downloadUrl}
              resultStats={resultStats}
              onStartMerge={handleMergeAction}
              onReset={() => {
                resetMerger();
                setResultStats(null);
              }}
              disabled={files.length < 2}
            />
          </div>
        </div>

        {/* Bottom: How It Works & FAQs */}
        <HowItWorksAndFaq />

        {/* 300-700 Words Helpful Content Guide & Pro Tips */}
        <ToolContentGuide {...MERGE_TOOL_GUIDE} />
      </main>

      {/* Mobile sticky bottom merge CTA — visible only on mobile when files ready */}
      {files.length >= 2 && !isProcessing && !downloadUrl && (
        <div className="mobile-action-bar lg:hidden">
          <button
            type="button"
            onClick={handleMergeAction}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold py-3.5 px-4 shadow-lg transition-colors cursor-pointer"
          >
            <span>Merge {files.length} PDFs →</span>
          </button>
        </div>
      )}

      {/* Mobile sticky success bar */}
      {downloadUrl && !isProcessing && (
        <div className="mobile-action-bar lg:hidden">
          <a
            href={downloadUrl}
            download={resultStats?.name || "Merged_Document.pdf"}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3.5 px-4 shadow-lg transition-colors"
          >
            <span>⬇ Download Merged PDF</span>
          </a>
        </div>
      )}
    </div>
  );
}

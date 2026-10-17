"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  FileText, 
  RotateCw, 
  Trash2, 
  Scissors, 
  FileStack, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Layers,
  Zap,
  Type,
  ArrowUp,
  Lock
} from "lucide-react";
import { setTransferredFiles } from "@/lib/fileTransfer";
import { formatBytes, truncateFileName, cn } from "@/lib/utils";

export function SmartDropzone() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter(
      (f) => f.name.toLowerCase().endsWith(".pdf") || f.type === "application/pdf"
    );
    if (valid.length > 0) {
      setSelectedFiles(valid);
    }
  }, []);

  const handleAction = (route: string) => {
    if (selectedFiles.length === 0) return;
    setIsNavigating(true);
    setTransferredFiles(selectedFiles);
    router.push(route);
  };

  const handleClear = () => {
    setSelectedFiles([]);
  };

  const handleLoadSample = async () => {
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      
      // Page 1
      const p1 = doc.addPage([595, 842]);
      p1.drawText("GoPDF Sample Document - Page 1", { x: 50, y: 780, size: 22 });
      p1.drawText("Explore rotating, extracting, or deleting pages client-side.", { x: 50, y: 730, size: 14 });

      // Page 2
      const p2 = doc.addPage([595, 842]);
      p2.drawText("Sample Document - Page 2 (Landscape orientation test)", { x: 50, y: 780, size: 20 });

      // Page 3
      const p3 = doc.addPage([595, 842]);
      p3.drawText("Sample Document - Page 3 (Appendix)", { x: 50, y: 780, size: 20 });

      const bytes = await doc.save();
      const sampleFile = new File([bytes as unknown as BlobPart], "GoPDF_Sample_Document.pdf", {
        type: "application/pdf",
      });

      setSelectedFiles([sampleFile]);
    } catch (err) {
      console.error("Failed to generate sample PDF", err);
    }
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
      handleFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="w-full relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(Array.from(e.target.files));
            e.target.value = "";
          }
        }}
        className="hidden"
        id="universal-smart-dropzone-input"
        aria-label="Upload PDF files"
      />

      {/* State A: File(s) Selected -> Dynamic Smart Action Selector */}
      {selectedFiles.length > 0 ? (
        <div className="rounded-3xl border border-blue-200 dark:border-blue-900/70 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-8 shadow-glass dark:shadow-glass-dark animate-fadeIn">
          {/* Header with Selected Document Badge & Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {selectedFiles.length === 1
                      ? truncateFileName(selectedFiles[0].name, 35)
                      : `${selectedFiles.length} PDF Documents Selected`}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedFiles.length === 1
                    ? formatBytes(selectedFiles[0].size)
                    : `${formatBytes(
                        selectedFiles.reduce((acc, f) => acc + f.size, 0)
                      )} total`}
                  {" • 100% processed in memory"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Change File
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                title="Remove selection"
                aria-label="Remove selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Prompt */}
          <div className="mt-6 mb-4 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Step 2: Choose an Action
            </span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              What would you like to do with this document?
            </h4>
          </div>

          {/* Action Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {/* Action 1: Edit PDF Text */}
            <button
              type="button"
              disabled={isNavigating}
              onClick={() => handleAction("/edit-pdf")}
              className="group relative flex flex-col justify-between rounded-2xl border border-blue-200/90 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-4 text-left hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-105 transition-transform">
                  <Type className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  Edit PDF Text
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Click, type, and delete existing text in-browser.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400">
                <span>Edit Text Now</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 2: Compress PDF */}
            <button
              type="button"
              disabled={isNavigating}
              onClick={() => handleAction("/compress-pdf")}
              className="group relative flex flex-col justify-between rounded-2xl border border-cyan-200/90 dark:border-cyan-900/60 bg-cyan-50/40 dark:bg-cyan-950/20 p-4 text-left hover:border-cyan-400 dark:hover:border-cyan-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
                  <Zap className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  Compress PDF
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Shrink size up to 70% with client-side canvas downscaling.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-cyan-700 dark:text-cyan-400">
                <span>Compress Now</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 2: Reorder PDF */}
            <button
              type="button"
              disabled={isNavigating}
              onClick={() => handleAction("/reorder-pdf-pages")}
              className="group relative flex flex-col justify-between rounded-2xl border border-sky-200/90 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 p-4 text-left hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                  <ArrowRight className="h-5 w-5 rotate-90" />
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  Reorder Pages
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Drag and drop to rearrange your page order.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-700 dark:text-sky-400">
                <span>Reorder Now</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 2: Rotate PDF */}
            <button
              type="button"
              disabled={isNavigating}
              onClick={() => handleAction("/rotate-pdf")}
              className="group relative flex flex-col justify-between rounded-2xl border border-amber-200/90 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-4 text-left hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 mb-3 group-hover:rotate-45 transition-transform duration-300">
                  <RotateCw className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  Rotate Pages
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Turn pages 90°, 180°, or 270° with 60fps instant previews.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                <span>Rotate Now</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 2: Delete PDF Pages */}
            <button
              type="button"
              disabled={isNavigating}
              onClick={() => handleAction("/delete-pdf-pages")}
              className="group relative flex flex-col justify-between rounded-2xl border border-rose-200/90 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-4 text-left hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 mb-3 group-hover:scale-105 transition-transform">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  Delete Pages
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Remove unwanted sheets with 1-click visual undo.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400">
                <span>Delete Pages</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 3: Split PDF */}
            <button
              type="button"
              disabled={isNavigating}
              onClick={() => handleAction("/split-pdf")}
              className="group relative flex flex-col justify-between rounded-2xl border border-emerald-200/90 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 text-left hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                  <Scissors className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  Split &amp; Extract
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Select custom page ranges (e.g. 1-3, 5) into a new PDF.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span>Extract Pages</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Action 4: Merge PDF */}
            <button
              type="button"
              disabled={isNavigating}
              onClick={() => handleAction("/merge-pdf")}
              className="group relative flex flex-col justify-between rounded-2xl border border-blue-200/90 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-4 text-left hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-105 transition-transform">
                  <FileStack className="h-5 w-5" />
                </div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  Merge With Other PDFs
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Combine this file with additional PDFs in any order.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400">
                <span>Merge PDFs</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* State B: Empty Dropzone -> Clean Sky-Blue Dashed Dropzone */
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer select-none group",
            isDragOver
              ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/50 scale-[1.01]"
              : "border-sky-300 hover:border-blue-500 bg-sky-50/30 hover:bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/20 dark:hover:border-sky-700"
          )}
        >
          {/* Blue Square with White Upward Arrow */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm mb-4 group-hover:scale-105 transition-transform">
            <ArrowUp className="h-6 w-6 stroke-[2.5]" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Drop your PDF files here
          </h3>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400 dark:text-slate-500">or</span>
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 shadow-xs transition-colors cursor-pointer"
            >
              choose files
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            <span>Your files never leave your device</span>
          </div>
        </div>
      )}
    </div>
  );
}

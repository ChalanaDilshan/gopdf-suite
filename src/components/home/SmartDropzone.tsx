"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  RotateCw, 
  Scissors, 
  FileStack, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Zap, 
  Type, 
  ArrowUp, 
  Lock,
  CheckCircle2,
  Cpu,
  Image as ImageIcon,
  FolderOpen
} from "lucide-react";
import { setTransferredFiles } from "@/lib/fileTransfer";
import { formatBytes, truncateFileName, cn } from "@/lib/utils";

const QUICK_PILLS = [
  { label: "Merge PDFs", href: "/merge-pdf", icon: FileStack },
  { label: "Edit Text", href: "/edit-pdf", icon: Type },
  { label: "Compress", href: "/compress-pdf", icon: Zap },
  { label: "Rotate & Delete", href: "/rotate-pdf", icon: RotateCw },
  { label: "Split Pages", href: "/split-pdf", icon: Scissors },
  { label: "Images to PDF", href: "/jpg-to-pdf", icon: ImageIcon },
];

export function SmartDropzone() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
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

  const handleLoadSample = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsGeneratingSample(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      
      // Page 1
      const p1 = doc.addPage([595, 842]);
      p1.drawText("GoPDF Client-Side Sandbox Demo", { x: 50, y: 780, size: 22 });
      p1.drawText("Zero cloud uploads. Total privacy guaranteed.", { x: 50, y: 740, size: 14 });
      p1.drawText("Test merging, rotating, splitting, or compressing this file.", { x: 50, y: 710, size: 12 });

      // Page 2
      const p2 = doc.addPage([595, 842]);
      p2.drawText("Page 2 - In-Memory PDF Manipulation", { x: 50, y: 780, size: 20 });
      p2.drawText("Notice how fast operations complete without remote servers.", { x: 50, y: 740, size: 12 });

      // Page 3
      const p3 = doc.addPage([595, 842]);
      p3.drawText("Page 3 - End-to-End Local Execution", { x: 50, y: 780, size: 20 });
      p3.drawText("Ready for instant browser-based processing.", { x: 50, y: 740, size: 12 });

      const bytes = await doc.save();
      const sampleFile = new File([bytes as unknown as BlobPart], "GoPDF_Demo_Document.pdf", {
        type: "application/pdf",
      });

      setSelectedFiles([sampleFile]);
    } catch (err) {
      console.error("Failed to generate sample PDF", err);
    } finally {
      setIsGeneratingSample(false);
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

      {/* Clean Solid Studio Workstation Container */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-3 transition-colors">
        
        {/* Studio Window Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
          {/* Left: Window Controls + Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="h-3 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <Cpu className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline font-semibold">GoPDF In-Memory Engine</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono font-bold">
                v2.4
              </span>
            </div>
          </div>

          {/* Right: RAM Sandbox Status + Sample Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>RAM Sandbox Active</span>
            </div>

            {selectedFiles.length === 0 && (
              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isGeneratingSample}
                className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                title="Generate a sample document to test the tools"
              >
                <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span>{isGeneratingSample ? "Generating..." : "Try Sample PDF"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick-Preset Tool Jump Bar */}
        {selectedFiles.length === 0 && (
          <div className="px-2 pb-2.5 pt-0.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 pl-1 pr-1 hidden sm:inline">
                Quick Jump:
              </span>
              {QUICK_PILLS.map((pill) => {
                const Icon = pill.icon;
                return (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-1 font-medium transition-colors shrink-0"
                  >
                    <Icon className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{pill.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* State A: File(s) Selected -> Dynamic Smart Action Selector */}
        {selectedFiles.length > 0 ? (
          <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs animate-fadeIn">
            {/* Header with Selected Document Badge & Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {selectedFiles.length === 1
                        ? truncateFileName(selectedFiles[0].name, 35)
                        : `${selectedFiles.length} PDF Documents Ready`}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      <CheckCircle2 className="h-3 w-3" />
                      Loaded
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedFiles.length === 1
                      ? formatBytes(selectedFiles[0].size)
                      : `${formatBytes(
                          selectedFiles.reduce((acc, f) => acc + f.size, 0)
                        )} total`}
                    {" • 100% In-Memory RAM • 0 Bytes Sent"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Remove selection"
                  aria-label="Remove selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Prompt */}
            <div className="mt-5 mb-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 2: Choose Transformation
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                What would you like to do with this document?
              </h4>
            </div>

            {/* Action Selector Grid - All using consistent clean blue/slate palette */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Action 1: Edit PDF Text */}
              <button
                type="button"
                disabled={isNavigating}
                onClick={() => handleAction("/edit-pdf")}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-4 text-left hover:border-blue-600 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-3">
                    <Type className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    Edit PDF Text
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Click, type, and replace existing text directly in-browser.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Edit Text</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Action 2: Compress PDF */}
              <button
                type="button"
                disabled={isNavigating}
                onClick={() => handleAction("/compress-pdf")}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-4 text-left hover:border-blue-600 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-3">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    Compress PDF
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Reduce file size up to 70% with client-side downscaling.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Compress Now</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Action 3: Merge PDF */}
              <button
                type="button"
                disabled={isNavigating}
                onClick={() => handleAction("/merge-pdf")}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-4 text-left hover:border-blue-600 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-3">
                    <FileStack className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    Merge With Others
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Combine this document with additional files in any order.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Merge PDFs</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Action 4: Rotate & Organize */}
              <button
                type="button"
                disabled={isNavigating}
                onClick={() => handleAction("/rotate-pdf")}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-4 text-left hover:border-blue-600 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 mb-3">
                    <RotateCw className="h-4 w-4" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    Rotate &amp; Organize
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Rotate 90°, delete unwanted pages, or change sequence.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Rotate Pages</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* State B: Empty Dropzone -> Clean Solid Surface */
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition-colors cursor-pointer select-none group",
              isDragOver
                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30"
                : "border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800"
            )}
          >
            {/* Solid Document Icon */}
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs group-hover:bg-blue-700 transition-colors">
                <FileText className="h-7 w-7" />
              </div>
            </div>

            {/* Headline */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Drag &amp; drop your PDF documents here
            </h3>

            {/* Subtitle */}
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Every operation executes strictly inside your local browser memory sandbox. Zero server uploads, zero wait time.
            </p>

            {/* Action Buttons Row */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 shadow-xs transition-colors cursor-pointer"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Browse Files</span>
              </button>

              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isGeneratingSample}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium px-4 py-2.5 transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>{isGeneratingSample ? "Building Demo..." : "Try Demo File"}</span>
              </button>
            </div>

            {/* Bottom Architecture Capabilities Strip */}
            <div className="mt-7 pt-4 border-t border-slate-200 dark:border-slate-700 w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Cloud Uploads</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Instant CPU Execution</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Up to 100MB / File</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Free &amp; Private</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

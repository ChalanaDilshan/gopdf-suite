"use client";

import React from "react";
import { 
  FileText, 
  Download, 
  RotateCcw, 
  GitMerge, 
  Check, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

export interface MergeActionPanelsProps {
  fileCount: number;
  isProcessing: boolean;
  progress: number;
  downloadUrl: string | null;
  resultStats?: {
    name: string;
    pageCount: number;
    size: number;
  } | null;
  onStartMerge: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function MergeActionPanels({
  fileCount,
  isProcessing,
  progress,
  downloadUrl,
  resultStats,
  onStartMerge,
  onReset,
  disabled = false,
}: MergeActionPanelsProps) {
  const step1Done = progress >= 20;
  const step2Done = progress >= 50;
  const step3Done = progress >= 80;
  const step4Done = progress >= 98;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Action Panel (When idle or ready) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Merge & Download
            </h3>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-semibold text-[11px] border border-blue-100 dark:border-blue-900/60">
            {fileCount} {fileCount === 1 ? "file" : "files"} ready
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
          Arrange your files if needed, then click the button below to merge them into a single PDF.
        </p>

        <button
          type="button"
          disabled={disabled || fileCount < 2 || isProcessing}
          onClick={onStartMerge}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#131b2e] dark:bg-blue-600 hover:bg-[#1e293b] dark:hover:bg-blue-500 active:bg-[#0b101c] text-white text-xs sm:text-sm font-semibold py-3 px-4 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
        >
          <GitMerge className="h-4 w-4" />
          <span>Merge PDFs ({fileCount} {fileCount === 1 ? "file" : "files"}) →</span>
        </button>
      </div>

      {/* 2. Processing State Panel (Visible during merge) */}
      {isProcessing && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-5 shadow-xs animate-fadeIn transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">Processing...</span>
            </div>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Progress bar track */}
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step checklist */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  step1Done
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {step1Done ? <Check className="h-3 w-3 stroke-[3]" /> : "1"}
              </span>
              <span>Reading files...</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  step2Done
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {step2Done ? <Check className="h-3 w-3 stroke-[3]" /> : "2"}
              </span>
              <span>Processing pages...</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  step3Done
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {step3Done ? <Check className="h-3 w-3 stroke-[3]" /> : "3"}
              </span>
              <span>Assembling pages...</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  step4Done
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {step4Done ? <Check className="h-3 w-3 stroke-[3]" /> : "4"}
              </span>
              <span>Finalizing document...</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Success State Panel (Visible when merged) */}
      {downloadUrl && !isProcessing && (
        <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-900/60 bg-white dark:bg-[#131b2e] p-5 shadow-xs animate-fadeIn text-left transition-colors">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                PDF merged successfully!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Your file is ready to download.
              </p>
            </div>
          </div>

          {/* Result file badge */}
          {resultStats && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 mb-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-[10px] font-black text-white">
                PDF
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {resultStats.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {resultStats.pageCount} pages • {formatBytes(resultStats.size)}
                </div>
              </div>
            </div>
          )}

          {/* Download CTA Button */}
          <a
            href={downloadUrl}
            download={resultStats?.name || "Merged_Document.pdf"}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold py-3 px-4 transition-colors mb-2.5 shadow-2xs"
          >
            <Download className="h-4 w-4" />
            <span>Download File</span>
          </a>

          {/* Reset Action */}
          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold py-2.5 px-4 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Merge Another Document</span>
          </button>
        </div>
      )}
    </div>
  );
}

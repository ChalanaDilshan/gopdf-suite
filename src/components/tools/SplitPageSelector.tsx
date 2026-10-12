"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
  Check, 
  CheckSquare, 
  Square, 
  SlidersHorizontal, 
  Sparkles, 
  Loader2, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageThumbnail } from "@/hooks/usePdfThumbnails";

export interface SplitPageSelectorProps {
  thumbnails: PageThumbnail[];
  totalPages: number;
  isLoadingThumbnails: boolean;
  selectedPages: number[]; // 1-based indices
  onSelectionChange: (selected: number[]) => void;
  disabled?: boolean;
}

/**
 * Parses user input ranges like "1-3, 5, 8-10" into a sorted array of 1-based page numbers.
 */
export function parsePageRange(rangeStr: string, maxPages: number): number[] {
  if (!rangeStr || !rangeStr.trim()) return [];

  const pages = new Set<number>();
  const parts = rangeStr.split(",");

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end) && start > 0 && end > 0) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(maxPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          pages.add(p);
        }
      }
    } else {
      const single = parseInt(trimmed, 10);
      if (!isNaN(single) && single >= 1 && single <= maxPages) {
        pages.add(single);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Formats a sorted array of page numbers into compact range format: e.g. "1-3, 5, 8-10"
 */
export function formatPageRange(pages: number[]): string {
  if (!pages || pages.length === 0) return "";

  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const ranges: string[] = [];

  let start = sorted[0];
  let end = start;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = start;
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(", ");
}

export function SplitPageSelector({
  thumbnails,
  totalPages,
  isLoadingThumbnails,
  selectedPages,
  onSelectionChange,
  disabled = false,
}: SplitPageSelectorProps) {
  const [rangeInput, setRangeInput] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // Sync range input text with selectedPages when not actively typing
  useEffect(() => {
    if (!isInputFocused) {
      setRangeInput(formatPageRange(selectedPages));
    }
  }, [selectedPages, isInputFocused]);

  const selectedSet = useMemo(() => new Set(selectedPages), [selectedPages]);

  const togglePage = (pageNum: number) => {
    if (disabled) return;
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageNum)) {
      newSelected.delete(pageNum);
    } else {
      newSelected.add(pageNum);
    }
    onSelectionChange(Array.from(newSelected).sort((a, b) => a - b));
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const all = Array.from({ length: totalPages }, (_, i) => i + 1);
    onSelectionChange(all);
  };

  const handleDeselectAll = () => {
    if (disabled) return;
    onSelectionChange([]);
  };

  const handleSelectEven = () => {
    if (disabled) return;
    const even = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 === 0);
    onSelectionChange(even);
  };

  const handleSelectOdd = () => {
    if (disabled) return;
    const odd = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
    onSelectionChange(odd);
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRangeInput(val);
    const parsed = parsePageRange(val, totalPages);
    onSelectionChange(parsed);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Quick Select Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4 sm:p-5 backdrop-blur-sm space-y-3">
        {/* Selection Counter Pill + Title */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            Page Selection
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300">
            {selectedPages.length}/{totalPages} selected
          </span>
        </div>

        {/* Quick Select Buttons — scroll-x on very small screens */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={disabled || totalPages === 0}
            onClick={handleSelectAll}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors shadow-xs min-h-[36px]"
          >
            All
          </button>

          <button
            type="button"
            disabled={disabled || selectedPages.length === 0}
            onClick={handleDeselectAll}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors shadow-xs min-h-[36px]"
          >
            None
          </button>

          <button
            type="button"
            disabled={disabled || totalPages === 0}
            onClick={handleSelectOdd}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors shadow-xs min-h-[36px]"
          >
            Odd
          </button>

          <button
            type="button"
            disabled={disabled || totalPages === 0}
            onClick={handleSelectEven}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors shadow-xs min-h-[36px]"
          >
            Even
          </button>
        </div>

        {/* Custom Range Input Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
          <label
            htmlFor="custom-range-input"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0"
          >
            Range:
          </label>
          <div className="relative flex-1">
            <input
              id="custom-range-input"
              type="text"
              disabled={disabled || totalPages === 0}
              value={rangeInput}
              onChange={handleRangeInputChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="e.g. 1-3, 5, 8-10"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono min-h-[40px]"
            />
          </div>
          <span className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
            e.g. 1-3, 5, 8
          </span>
        </div>
      </div>

      {/* Responsive Grid of Page Thumbnails */}
      <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
        {thumbnails.map((thumb) => {
          const isSelected = selectedSet.has(thumb.pageNumber);

          return (
            <div
              key={thumb.pageNumber}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={disabled ? -1 : 0}
              onClick={() => togglePage(thumb.pageNumber)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePage(thumb.pageNumber);
                }
              }}
              className={cn(
                "group relative flex flex-col rounded-2xl border p-2.5 transition-all duration-200 cursor-pointer select-none bg-white dark:bg-slate-900 shadow-xs",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                isSelected
                  ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm",
                disabled && "opacity-50 pointer-events-none cursor-not-allowed"
              )}
            >
              {/* Card Header: Page Pill & Checkbox */}
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <FileText className="h-3 w-3 text-slate-400" />
                  Page {thumb.pageNumber}
                </span>

                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent group-hover:border-slate-400"
                  )}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Crisp Page Image Preview */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb.dataUrl}
                  alt={`Page ${thumb.pageNumber}`}
                  className="h-full w-full object-contain object-center transition-transform group-hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Subtle selection overlay */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity",
                    isSelected ? "bg-indigo-600/5 dark:bg-indigo-400/5" : "opacity-0"
                  )}
                />
              </div>
            </div>
          );
        })}

        {/* Skeleton Placeholders while subsequent pages are still rendering */}
        {isLoadingThumbnails &&
          Array.from({ length: Math.max(0, totalPages - thumbnails.length) }).map(
            (_, idx) => {
              const pendingPage = thumbnails.length + idx + 1;
              return (
                <div
                  key={`skeleton-${pendingPage}`}
                  className="flex flex-col rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 p-2.5 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[11px] font-medium text-slate-400">
                      Page {pendingPage}
                    </span>
                    <div className="h-4 w-4 rounded-md bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="aspect-[3/4] w-full rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
}

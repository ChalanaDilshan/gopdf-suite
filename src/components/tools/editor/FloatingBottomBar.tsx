"use client";

import React, { useState } from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  Minus, 
  Plus, 
  Maximize2, 
  Search, 
  Settings,
  RotateCcw
} from "lucide-react";

export interface FloatingBottomBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  onResetZoom?: () => void;
}

export function FloatingBottomBar({
  currentPage,
  totalPages,
  onPageChange,
  scale,
  onScaleChange,
  onResetZoom,
}: FloatingBottomBarProps) {
  const [pageInput, setPageInput] = useState<string>(String(currentPage));
  const [isEditingPage, setIsEditingPage] = useState<boolean>(false);

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      onPageChange(parsed);
    } else {
      setPageInput(String(currentPage));
    }
    setIsEditingPage(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none animate-fadeIn">
      <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 dark:bg-black/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-2xl backdrop-blur-md border border-slate-700/70 text-xs">
        {/* Page Navigation Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            title="Previous page (Up)"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          {isEditingPage ? (
            <form onSubmit={handlePageInputSubmit} className="inline">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageInputSubmit}
                autoFocus
                className="w-10 text-center bg-slate-800 text-white rounded px-1 py-0.5 text-xs outline-none"
              />
            </form>
          ) : (
            <span
              onClick={() => {
                setPageInput(String(currentPage));
                setIsEditingPage(true);
              }}
              className="px-1.5 py-0.5 font-bold hover:bg-slate-800 rounded cursor-pointer transition-colors"
              title="Click to jump to page"
            >
              {currentPage} / {totalPages}
            </span>
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next page (Down)"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="h-3.5 w-[1px] bg-slate-700" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={scale <= 0.6}
            onClick={() => onScaleChange(Math.max(0.6, scale - 0.2))}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span
            onClick={onResetZoom}
            className="w-12 text-center font-bold text-[11px] text-slate-200 hover:text-blue-400 cursor-pointer"
            title="Click to reset zoom (100%)"
          >
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            disabled={scale >= 2.5}
            onClick={() => onScaleChange(Math.min(2.5, scale + 0.2))}
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-3.5 w-[1px] bg-slate-700 hidden sm:block" />

        {/* Quick Utility Icons */}
        <div className="hidden sm:flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onScaleChange(1.0)}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            title="Fit to 100%"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            title="Search document text"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

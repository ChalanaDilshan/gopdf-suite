"use client";

import React, { useState, useEffect, useRef } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { 
  LayoutGrid, 
  ListTree, 
  Bookmark, 
  MoreVertical, 
  Minus, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThumbnailSidebarProps {
  pdfDocument: PDFDocumentProxy | null;
  currentPage: number;
  totalPages: number;
  onSelectPage: (page: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function ThumbnailSidebar({
  pdfDocument,
  currentPage,
  totalPages,
  onSelectPage,
  isOpen,
  onToggleOpen,
}: ThumbnailSidebarProps) {
  const [activeTab, setActiveTab] = useState<"thumbnails" | "outline" | "bookmarks">("thumbnails");
  const [thumbScale, setThumbScale] = useState<number>(100); // 70px to 140px
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<number, string>>({});
  const renderedPagesRef = useRef<Set<number>>(new Set());

  // Render miniature thumbnails lazily for visible pages
  useEffect(() => {
    if (!pdfDocument || totalPages === 0) return;

    let isCancelled = false;

    const renderThumbnails = async () => {
      // Prioritize current page and its neighbors
      const pagesToRender: number[] = [];
      pagesToRender.push(currentPage);
      for (let p = 1; p <= Math.min(totalPages, 15); p++) {
        if (p !== currentPage) pagesToRender.push(p);
      }

      for (const p of pagesToRender) {
        if (isCancelled) break;
        if (renderedPagesRef.current.has(p)) continue;

        try {
          const page = await pdfDocument.getPage(p);
          const viewport = page.getViewport({ scale: 0.25 }); // 25% scale for fast thumbnail

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          const ctx = canvas.getContext("2d", { alpha: false });
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport }).promise;

            const url = canvas.toDataURL("image/jpeg", 0.7);
            if (!isCancelled) {
              renderedPagesRef.current.add(p);
              setThumbnailUrls((prev) => ({ ...prev, [p]: url }));
            }
          }
        } catch {
          // Graceful fallback
        }
      }
    };

    renderThumbnails();

    return () => {
      isCancelled = true;
    };
  }, [pdfDocument, totalPages, currentPage]);

  if (!isOpen) {
    return (
      <div className="hidden sm:flex flex-col items-center py-4 px-1.5 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 z-20">
        <button
          type="button"
          onClick={onToggleOpen}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Open thumbnails sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="relative flex flex-col w-56 sm:w-64 shrink-0 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 h-full select-none z-20 transition-all duration-200">
      {/* Top View Switcher Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("thumbnails")}
            className={cn(
              "p-1.5 rounded-lg transition-colors cursor-pointer",
              activeTab === "thumbnails"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            )}
            title="Thumbnails view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("outline")}
            className={cn(
              "p-1.5 rounded-lg transition-colors cursor-pointer",
              activeTab === "outline"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            )}
            title="Document outline"
          >
            <ListTree className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bookmarks")}
            className={cn(
              "p-1.5 rounded-lg transition-colors cursor-pointer",
              activeTab === "bookmarks"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            )}
            title="Bookmarks"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail Zoom Slider Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Pages ({totalPages})
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setThumbScale((s) => Math.max(70, s - 15))}
            className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            title="Smaller thumbnails"
          >
            <Minus className="h-3 w-3" />
          </button>

          <input
            type="range"
            min={70}
            max={140}
            value={thumbScale}
            onChange={(e) => setThumbScale(Number(e.target.value))}
            className="w-16 h-1 accent-blue-600 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />

          <button
            type="button"
            onClick={() => setThumbScale((s) => Math.min(140, s + 15))}
            className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            title="Larger thumbnails"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Page Thumbnails Vertical Strip */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isSelected = currentPage === pageNum;
          const thumbUrl = thumbnailUrls[pageNum];

          return (
            <div
              key={pageNum}
              onClick={() => onSelectPage(pageNum)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                style={{ width: `${thumbScale}px` }}
                className={cn(
                  "relative aspect-3/4 rounded-lg overflow-hidden bg-white dark:bg-slate-800 border transition-all duration-150 shadow-2xs flex items-center justify-center",
                  isSelected
                    ? "border-red-600 dark:border-red-500 ring-2 ring-red-500/30 shadow-md scale-[1.02]"
                    : "border-slate-200 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-500"
                )}
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={`Page ${pageNum}`}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 p-2">
                    <FileText className="h-6 w-6 stroke-[1.5]" />
                    <span className="text-[10px] mt-1">Page {pageNum}</span>
                  </div>
                )}
              </div>

              {/* Page Number Label */}
              <span
                className={cn(
                  "text-[11px] font-bold mt-1 transition-colors",
                  isSelected
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                )}
              >
                {pageNum}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

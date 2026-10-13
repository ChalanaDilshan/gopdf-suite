"use client";

import React from "react";
import { 
  RotateCw, 
  RotateCcw, 
  RotateCcw as ResetIcon, 
  Download, 
  FileCheck, 
  Trash2, 
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface OrganizeToolbarProps {
  totalPages: number;
  activePagesCount: number;
  deletedPagesCount: number;
  hasModifications: boolean;
  isExporting: boolean;
  isLoadingThumbnails: boolean;
  onRotateAllClockwise: () => void;
  onRotateAllCounterClockwise?: () => void;
  onResetAll: () => void;
  onExport: () => void;
  className?: string;
  customExportLabel?: string;
}

export function OrganizeToolbar({
  totalPages,
  activePagesCount,
  deletedPagesCount,
  hasModifications,
  isExporting,
  isLoadingThumbnails,
  onRotateAllClockwise,
  onRotateAllCounterClockwise,
  onResetAll,
  onExport,
  className,
  customExportLabel = "Save & Download PDF",
}: OrganizeToolbarProps) {
  const isActionDisabled = isExporting || isLoadingThumbnails || totalPages === 0;
  const isExportDisabled = isActionDisabled || activePagesCount === 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-5 backdrop-blur-md shadow-sm space-y-3.5 transition-all",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Left Side: Page Status Counter & Badges */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              {activePagesCount} of {totalPages} {totalPages === 1 ? "page" : "pages"} remaining
            </span>
          </div>

          {deletedPagesCount > 0 && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-600 dark:text-red-400">
              <Trash2 className="h-3.5 w-3.5 shrink-0" />
              <span>{deletedPagesCount} deleted</span>
            </div>
          )}

          {activePagesCount === 0 && totalPages > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              All pages deleted. Restore at least one page to save.
            </span>
          )}
        </div>

        {/* Right Side: Bulk Actions & CTA */}
        <div className="flex items-center flex-wrap gap-2 justify-start lg:justify-end">
          {onRotateAllCounterClockwise && (
            <Button
              variant="outline"
              size="sm"
              disabled={isActionDisabled}
              onClick={onRotateAllCounterClockwise}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              title="Rotate all pages 90° counter-clockwise"
              className="text-xs"
            >
              Rotate Left
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={isActionDisabled}
            onClick={onRotateAllClockwise}
            leftIcon={<RotateCw className="h-3.5 w-3.5" />}
            title="Rotate all pages 90° clockwise"
            className="text-xs"
          >
            Rotate All Clockwise
          </Button>

          <Button
            variant="ghost"
            size="sm"
            disabled={isActionDisabled || !hasModifications}
            onClick={onResetAll}
            leftIcon={<ResetIcon className="h-3.5 w-3.5" />}
            title="Reset all rotations and restore deleted pages"
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            Reset All
          </Button>

          <Button
            variant="primary"
            size="md"
            isLoading={isExporting}
            disabled={isExportDisabled}
            onClick={onExport}
            leftIcon={<Download className="h-4 w-4" />}
            className="shadow-md shadow-blue-600/20 w-full sm:w-auto"
          >
            {customExportLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

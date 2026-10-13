"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { 
  FileText, 
  Download, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  RotateCw, 
  Trash2, 
  ShieldCheck, 
  Cpu, 
  Lock 
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Dropzone } from "@/components/ui/Dropzone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OrganizeToolbar } from "@/components/tools/OrganizeToolbar";
import { usePdfOrganizer } from "@/hooks/usePdfOrganizer";
import { formatBytes, truncateFileName } from "@/lib/utils";
import { HowToStep, FaqItem } from "@/types";

const OrganizeGrid = dynamic(
  () => import("@/components/tools/OrganizeGrid").then((mod) => mod.OrganizeGrid),
  { ssr: false }
);

export interface OrganizeWorkspaceProps {
  toolSlug: string;
  title: string;
  description: string;
  badgeText?: string;
  category?: string;
  dropzoneTitle?: string;
  dropzoneSubtitle?: string;
  steps: HowToStep[];
  faqItems: FaqItem[];
  seoHeading: string;
  seoDescription: string;
  seoCards?: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  customExportLabel?: string;
  defaultFileNameSuffix?: string;
}

export function OrganizeWorkspace({
  toolSlug,
  title,
  description,
  badgeText = "100% Client-Side / Secure",
  category = "Organize PDF",
  dropzoneTitle = "Drop your PDF here to organize pages",
  dropzoneSubtitle = "Rotate pages, remove unwanted sheets, or optimize page orientation",
  steps,
  faqItems,
  seoHeading,
  seoDescription,
  seoCards = [
    {
      title: "Zero-Latency CSS Transforms",
      description:
        "Every page rotates instantly at 60fps using hardware-accelerated CSS transforms without re-rendering heavyweight canvas elements.",
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      title: "Permanent PDF Rotation",
      description:
        "Rotations and deletions are permanently applied using pdf-lib on the raw document structure before export.",
      icon: <RotateCw className="h-4 w-4" />,
    },
    {
      title: "100% In-Memory Sandbox",
      description:
        "Your private documents, statements, and contracts never leave your browser memory. Zero external server uploads.",
      icon: <Lock className="h-4 w-4" />,
    },
  ],
  customExportLabel = "Save & Download PDF",
  defaultFileNameSuffix = "-organized.pdf",
}: OrganizeWorkspaceProps) {
  const {
    file,
    pages,
    totalPages,
    activePagesCount,
    deletedPagesCount,
    hasModifications,
    isLoadingThumbnails,
    renderingProgress,
    isExporting,
    exportProgress,
    downloadUrl,
    outputFileName,
    error,
    loadFile,
    rotatePage,
    rotateAll,
    deletePage,
    restorePage,
    resetAll,
    exportPdf,
    clear,
  } = usePdfOrganizer();

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    await loadFile(files[0]);
  };

  const handleExport = async () => {
    if (!file || isExporting) return;
    const baseName = file.name.replace(/\.pdf$/i, "");
    const customName = `${baseName}${defaultFileNameSuffix}`;
    await exportPdf(customName);
  };

  return (
    <ToolLayout
      title={title}
      description={description}
      badgeText={badgeText}
      category={category}
      toolSlug={toolSlug}
      steps={steps}
      faqItems={faqItems}
    >
      <div className="space-y-6">
        {/* State 1: Dropzone when no file is active */}
        {!file ? (
          <Dropzone
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            title={dropzoneTitle}
            subtitle={dropzoneSubtitle}
          />
        ) : (
          <div className="space-y-6">
            {/* Header Toolbar: Active Document Info & File Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                    {truncateFileName(file.name, 40)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatBytes(file.size)}
                    {totalPages > 0 && ` • ${totalPages} total pages`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={isExporting || isLoadingThumbnails}
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
                  disabled={isExporting}
                  onClick={clear}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Error Feedback Banner */}
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

            {/* Thumbnail Progressive Generation Progress Bar */}
            {isLoadingThumbnails && (
              <div className="pt-2 animate-fadeIn">
                <ProgressBar
                  progress={renderingProgress}
                  label={`Generating crisp browser previews (${renderingProgress}%)...`}
                  status="loading"
                />
              </div>
            )}

            {/* Top Organizing Utility Bar */}
            {pages.length > 0 && (
              <OrganizeToolbar
                totalPages={totalPages}
                activePagesCount={activePagesCount}
                deletedPagesCount={deletedPagesCount}
                hasModifications={hasModifications}
                isExporting={isExporting}
                isLoadingThumbnails={isLoadingThumbnails}
                onRotateAllClockwise={() => rotateAll(90)}
                onRotateAllCounterClockwise={() => rotateAll(-90)}
                onResetAll={resetAll}
                onExport={handleExport}
                customExportLabel={customExportLabel}
              />
            )}

            {/* Interactive Responsive Page Grid */}
            {pages.length > 0 && (
              <OrganizeGrid
                pages={pages}
                totalPages={totalPages}
                isLoadingThumbnails={isLoadingThumbnails}
                onRotatePage={rotatePage}
                onDeletePage={deletePage}
                onRestorePage={restorePage}
                disabled={isExporting}
              />
            )}

            {/* PDF Export Progress Bar */}
            {isExporting && (
              <div className="pt-2 animate-fadeIn">
                <ProgressBar
                  progress={exportProgress}
                  label="Applying permanent page transformations and assembling PDF in browser RAM..."
                  status="loading"
                />
              </div>
            )}

            {/* Success Download Card */}
            {downloadUrl && !isExporting && (
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 p-6 sm:p-8 text-center animate-fadeIn shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 mb-4">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  PDF Successfully Processed!
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Your document containing {activePagesCount} {activePagesCount === 1 ? "page" : "pages"} with permanent transformations is ready. Processed 100% locally.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={downloadUrl}
                    download={outputFileName || "organized.pdf"}
                    className="inline-block"
                  >
                    <Button
                      size="lg"
                      leftIcon={<Download className="h-4 w-4" />}
                      className="bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                    >
                      Download Processed PDF
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<RotateCcw className="h-4 w-4" />}
                    onClick={clear}
                  >
                    Process Another PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical SEO & Value Explanation Block */}
        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                100% Client-Side Architecture
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {seoHeading}
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {seoDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seoCards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 shadow-xs"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Type, 
  Zap, 
  Trash2, 
  RotateCw, 
  Scissors, 
  ArrowRight, 
  GitMerge, 
  Image as ImageIcon,
  Sparkles,
  Loader2,
  FileSpreadsheet
} from "lucide-react";
import { setTransferredFiles } from "@/lib/fileTransfer";

export interface CompletionNextActionsProps {
  downloadUrl: string;
  fileName: string;
  currentTool: string;
  fileBlob?: Blob;
  className?: string;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  color: string;
}

const ALL_ACTIONS: QuickAction[] = [
  {
    id: "edit-pdf",
    title: "Edit PDF Text",
    subtitle: "Click, type & replace text or fix typos",
    href: "/edit-pdf",
    icon: <Type className="h-4 w-4" />,
    badge: "Popular",
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/60",
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    subtitle: "Reduce file size up to 70% for email",
    href: "/compress-pdf",
    icon: <Zap className="h-4 w-4" />,
    badge: "Save 70%",
    color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-900/60",
  },
  {
    id: "delete-pdf-pages",
    title: "Delete Pages",
    subtitle: "Remove blank or unwanted pages",
    href: "/delete-pdf-pages",
    icon: <Trash2 className="h-4 w-4" />,
    color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60",
  },
  {
    id: "rotate-pdf",
    title: "Rotate PDF",
    subtitle: "Turn pages 90° or 180° permanently",
    href: "/rotate-pdf",
    icon: <RotateCw className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60",
  },
  {
    id: "split-pdf",
    title: "Split / Extract",
    subtitle: "Extract selected pages into a new file",
    href: "/split-pdf",
    icon: <Scissors className="h-4 w-4" />,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60",
  },
  {
    id: "reorder-pdf-pages",
    title: "Reorder Pages",
    subtitle: "Drag & drop page sequence",
    href: "/reorder-pdf-pages",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-900/60",
  },
  {
    id: "merge-pdf",
    title: "Merge with Another PDF",
    subtitle: "Combine this document with other files",
    href: "/merge-pdf",
    icon: <GitMerge className="h-4 w-4" />,
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900/60",
  },
  {
    id: "pdf-to-jpg",
    title: "Convert to JPG",
    subtitle: "Export pages as high-resolution images",
    href: "/pdf-to-jpg",
    icon: <ImageIcon className="h-4 w-4" />,
    color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-900/60",
  },
];

export function CompletionNextActions({
  downloadUrl,
  fileName,
  currentTool,
  fileBlob,
  className = "",
}: CompletionNextActionsProps) {
  const router = useRouter();
  const [transferringId, setTransferringId] = useState<string | null>(null);

  // Filter out the tool that the user just used
  const availableActions = ALL_ACTIONS.filter((action) => {
    if (action.id === currentTool) return false;
    // Don't show PDF to JPG if current is already PDF to images
    if ((currentTool === "pdf-to-jpg" || currentTool === "pdf-to-png") && action.id === "pdf-to-jpg") {
      return false;
    }
    return true;
  }).slice(0, 4); // Show top 4 most relevant actions for a clean grid

  const handleActionClick = async (action: QuickAction) => {
    if (transferringId) return;
    setTransferringId(action.id);

    try {
      let blob = fileBlob;
      if (!blob && downloadUrl) {
        const response = await fetch(downloadUrl);
        blob = await response.blob();
      }

      if (!blob) {
        router.push(action.href);
        return;
      }

      const safeName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
      const file = new File([blob], safeName, { type: "application/pdf" });
      setTransferredFiles([file]);

      router.push(action.href);
    } catch (err) {
      console.error("Failed to transfer file to next tool", err);
      router.push(action.href);
    } finally {
      setTransferringId(null);
    }
  };

  return (
    <div
      className={`mt-8 pt-8 border-t border-slate-200/80 dark:border-slate-800 text-left ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chained Workflow</span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Continue with this document
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pass this processed PDF straight into another tool with zero re-uploading.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {availableActions.map((action) => {
          const isLoading = transferringId === action.id;

          return (
            <button
              key={action.id}
              type="button"
              disabled={!!transferringId}
              onClick={() => handleActionClick(action)}
              className="group relative flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700/80 transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 text-left cursor-pointer disabled:opacity-60"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${action.color}`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                    ) : (
                      action.icon
                    )}
                  </div>
                  {action.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/70">
                      {action.badge}
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.title}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                  {action.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
                <span>{isLoading ? "Loading..." : "Open tool"}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

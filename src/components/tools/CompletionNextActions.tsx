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
    color: "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    subtitle: "Reduce file size up to 70% for email",
    href: "/compress-pdf",
    icon: <Zap className="h-4 w-4" />,
    badge: "Save 70%",
    color: "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
  },
  {
    id: "delete-pdf-pages",
    title: "Delete Pages",
    subtitle: "Remove blank or unwanted pages",
    href: "/delete-pdf-pages",
    icon: <Trash2 className="h-4 w-4" />,
    color: "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
  },
  {
    id: "rotate-pdf",
    title: "Rotate PDF",
    subtitle: "Turn pages 90° or 180° permanently",
    href: "/rotate-pdf",
    icon: <RotateCw className="h-4 w-4" />,
    color: "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
  },
  {
    id: "split-pdf",
    title: "Split / Extract",
    subtitle: "Extract selected pages into a new file",
    href: "/split-pdf",
    icon: <Scissors className="h-4 w-4" />,
    color: "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
  },
  {
    id: "reorder-pdf-pages",
    title: "Reorder Pages",
    subtitle: "Drag & drop page sequence",
    href: "/reorder-pdf-pages",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    color: "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
  },
  {
    id: "merge-pdf",
    title: "Merge with Another PDF",
    subtitle: "Combine this document with other files",
    href: "/merge-pdf",
    icon: <GitMerge className="h-4 w-4" />,
    color: "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
  },
  {
    id: "pdf-to-jpg",
    title: "Convert to JPG",
    subtitle: "Export pages as high-resolution images",
    href: "/pdf-to-jpg",
    icon: <ImageIcon className="h-4 w-4" />,
    color: "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
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
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
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
              className="group relative flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-200 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 text-left cursor-pointer disabled:opacity-60"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${action.color}`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-neutral-900 dark:text-white" />
                    ) : (
                      action.icon
                    )}
                  </div>
                  {action.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      {action.badge}
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {action.title}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                  {action.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-neutral-900 dark:text-white">
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

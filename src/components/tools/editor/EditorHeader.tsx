"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Crown, 
  Eye, 
  Hand, 
  Highlighter, 
  Square, 
  Image as ImageIcon, 
  Type, 
  CheckSquare, 
  HelpCircle, 
  MessageSquare, 
  Maximize2, 
  Minimize2,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Save,
  Download,
  MousePointer
} from "lucide-react";
import { cn } from "@/lib/utils";

export type EditorMode = "annotate" | "edit";
export type InteractionTool = "select" | "hand";
export type ToolCategory = "annotate" | "shapes" | "insert" | "editText" | "forms";

export interface EditorHeaderProps {
  fileName?: string;
  editorMode: EditorMode;
  onSetEditorMode: (mode: EditorMode) => void;
  interactionTool: InteractionTool;
  onSetInteractionTool: (tool: InteractionTool) => void;
  activeCategory: ToolCategory;
  onSetCategory: (cat: ToolCategory) => void;
  onAddTextBlock?: () => void;
  onInsertImage?: () => void;
  onExportPdf?: () => void;
  isExporting?: boolean;
  totalEditsCount?: number;
}

export function EditorHeader({
  fileName = "Document.pdf",
  editorMode,
  onSetEditorMode,
  interactionTool,
  onSetInteractionTool,
  activeCategory,
  onSetCategory,
  onAddTextBlock,
  onExportPdf,
  isExporting = false,
  totalEditsCount = 0,
}: EditorHeaderProps) {
  return (
    <header className="w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 select-none z-30 transition-colors">
      {/* Top Primary Navigation Bar */}
      <div className="flex items-center justify-between px-3 sm:px-5 h-14 gap-2">
        {/* Left Group: Back / Title & Mode Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to GoPDF Home"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">GoPDF</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Mode Toggle: Annotate vs Edit */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => onSetEditorMode("annotate")}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                editorMode === "annotate"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              Annotate
            </button>
            <button
              type="button"
              onClick={() => onSetEditorMode("edit")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer",
                editorMode === "edit"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <span>Edit</span>
              <span className="inline-flex items-center justify-center p-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Crown className="h-2.5 w-2.5" />
              </span>
            </button>
          </div>

          {/* Quick Canvas Interaction Tools */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => onSetInteractionTool("select")}
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                interactionTool === "select"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
              title="Select / Edit Text Tool"
            >
              <MousePointer className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSetInteractionTool("hand")}
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                interactionTool === "hand"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
              title="Hand (Pan) Tool"
            >
              <Hand className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center Group: Primary Tool Category Tabs */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { id: "annotate", label: "Annotate", icon: Highlighter },
            { id: "shapes", label: "Shapes", icon: Square },
            { id: "insert", label: "Insert", icon: Plus },
            { id: "editText", label: "Edit Text", icon: Type },
            { id: "forms", label: "Forms", icon: CheckSquare },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSetCategory(cat.id as ToolCategory)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
                  isActive
                    ? "text-red-600 dark:text-red-400 bg-red-50/70 dark:bg-red-950/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "stroke-[2.5]")} />
                <span>{cat.label}</span>

                {/* Red active indicator bar under active tab */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 dark:bg-red-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Group: Document Name & Quick Actions */}
        <div className="flex items-center gap-2">
          {totalEditsCount > 0 && (
            <span className="hidden lg:inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {totalEditsCount} edit{totalEditsCount > 1 ? "s" : ""}
            </span>
          )}

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 max-w-[180px] truncate">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>

          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Help &amp; Shortcuts"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sub-toolbar: Quick Utilities Directly Beneath Category Tabs */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-1.5 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 hidden sm:inline">
            Quick Actions:
          </span>

          {/* Add Text Trigger */}
          <button
            type="button"
            onClick={onAddTextBlock}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 transition-colors font-medium cursor-pointer"
            title="Click to drop new text block"
          >
            <Plus className="h-3.5 w-3.5 text-red-600" />
            <span>Add Text Box</span>
          </button>

          {/* Text Alignment Quick Icons */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
            <button
              type="button"
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Align Left"
            >
              <AlignLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Align Center"
            >
              <AlignCenter className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Align Right"
            >
              <AlignRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
          Click any text on the canvas to edit directly
        </div>
      </div>
    </header>
  );
}

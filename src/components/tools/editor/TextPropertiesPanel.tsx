"use client";

import React, { useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link2, 
  Undo2, 
  Redo2, 
  Plus, 
  ArrowRight, 
  X,
  Type,
  ChevronDown
} from "lucide-react";
import { EditableTextBlock } from "@/hooks/usePdfTextLayer";
import { cn } from "@/lib/utils";

export interface TextPropertiesPanelProps {
  selectedBlock: EditableTextBlock | null;
  onUpdateBlock: (id: string, updates: Partial<EditableTextBlock>) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onSaveChanges: () => void;
  isSaving?: boolean;
  isOpen: boolean;
  onClose?: () => void;
}

const PRESET_FONTS = [
  { name: "Helvetica / Arial", value: 'Arial, Helvetica, "Segoe UI", sans-serif' },
  { name: "Times New Roman", value: '"Times New Roman", Times, Georgia, serif' },
  { name: "Courier New", value: '"Courier New", Courier, monospace' },
  { name: "Georgia", value: 'Georgia, serif' },
];

const PRESET_FONT_SIZES = [9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

const DEFAULT_PALETTE = [
  "#000000",
  "#ffffff",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#475569",
];

export function TextPropertiesPanel({
  selectedBlock,
  onUpdateBlock,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onSaveChanges,
  isSaving = false,
  isOpen,
  onClose,
}: TextPropertiesPanelProps) {
  const [customColors, setCustomColors] = useState<string[]>(DEFAULT_PALETTE);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");

  if (!isOpen) return null;

  const activeColor = selectedBlock?.color || "#000000";
  const activeFontSize = selectedBlock ? Math.round(selectedBlock.fontSize) : 14;
  const activeFontFamily = selectedBlock?.cssFontFamily || PRESET_FONTS[0].value;

  const handleAddCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (!customColors.includes(newColor)) {
      setCustomColors((prev) => [...prev, newColor]);
    }
    if (selectedBlock) {
      onUpdateBlock(selectedBlock.id, { color: newColor });
    }
  };

  return (
    <aside className="w-64 sm:w-72 shrink-0 bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full select-none z-20 transition-all duration-200">
      {/* Scrollable Properties Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scrollbar-thin">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-red-600 dark:text-red-400" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              Text Styles
            </h3>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Selected Block Info Banner */}
        {selectedBlock ? (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Editing Selection:
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              &quot;{selectedBlock.currentText || "(Empty)"}&quot;
            </p>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300">
            Click any text block on the document canvas to modify its typography.
          </div>
        )}

        {/* Font Family & Size Selectors */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Font Family
            </label>
            <div className="relative">
              <select
                disabled={!selectedBlock}
                value={activeFontFamily}
                onChange={(e) => {
                  if (selectedBlock) {
                    onUpdateBlock(selectedBlock.id, {
                      cssFontFamily: e.target.value,
                    });
                  }
                }}
                className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2.5 pr-8 appearance-none outline-none focus:border-red-500 disabled:opacity-50 cursor-pointer"
              >
                {PRESET_FONTS.map((font) => (
                  <option key={font.name} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Font Size
            </label>
            <div className="relative">
              <select
                disabled={!selectedBlock}
                value={activeFontSize}
                onChange={(e) => {
                  if (selectedBlock) {
                    onUpdateBlock(selectedBlock.id, {
                      fontSize: Number(e.target.value),
                    });
                  }
                }}
                className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2.5 pr-8 appearance-none outline-none focus:border-red-500 disabled:opacity-50 cursor-pointer"
              >
                {PRESET_FONT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} px
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Typography Modifiers Button Group */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
            Format &amp; Style
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              disabled={!selectedBlock}
              onClick={() => setIsBold(!isBold)}
              className={cn(
                "p-2 rounded-lg flex items-center justify-center text-xs font-black transition-colors cursor-pointer",
                isBold
                  ? "bg-white dark:bg-slate-700 text-red-600 shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              )}
              title="Bold"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={!selectedBlock}
              onClick={() => setIsItalic(!isItalic)}
              className={cn(
                "p-2 rounded-lg flex items-center justify-center text-xs font-serif italic transition-colors cursor-pointer",
                isItalic
                  ? "bg-white dark:bg-slate-700 text-red-600 shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              )}
              title="Italic"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={!selectedBlock}
              onClick={() => setIsUnderline(!isUnderline)}
              className={cn(
                "p-2 rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer",
                isUnderline
                  ? "bg-white dark:bg-slate-700 text-red-600 shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              )}
              title="Underline"
            >
              <Underline className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={!selectedBlock}
              onClick={() => setIsStrikethrough(!isStrikethrough)}
              className={cn(
                "p-2 rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer",
                isStrikethrough
                  ? "bg-white dark:bg-slate-700 text-red-600 shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              )}
              title="Strikethrough"
            >
              <Strikethrough className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Alignment & Link Actions */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
            Alignment
          </label>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setTextAlign("left")}
                className={cn(
                  "flex-1 p-1.5 rounded-lg flex items-center justify-center text-xs transition-colors",
                  textAlign === "left"
                    ? "bg-white dark:bg-slate-700 text-red-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Align Left"
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTextAlign("center")}
                className={cn(
                  "flex-1 p-1.5 rounded-lg flex items-center justify-center text-xs transition-colors",
                  textAlign === "center"
                    ? "bg-white dark:bg-slate-700 text-red-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Align Center"
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTextAlign("right")}
                className={cn(
                  "flex-1 p-1.5 rounded-lg flex items-center justify-center text-xs transition-colors",
                  textAlign === "right"
                    ? "bg-white dark:bg-slate-700 text-red-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Align Right"
              >
                <AlignRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Insert Link"
            >
              <Link2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Color Palette Selectors */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Text Color
            </label>
            <div className="flex items-center gap-1.5">
              <span
                style={{ backgroundColor: activeColor }}
                className="h-4 w-4 rounded-full border border-slate-300 shadow-2xs"
              />
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                {activeColor}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {customColors.map((hex) => (
              <button
                key={hex}
                type="button"
                disabled={!selectedBlock}
                onClick={() => {
                  if (selectedBlock) {
                    onUpdateBlock(selectedBlock.id, { color: hex });
                  }
                }}
                style={{ backgroundColor: hex }}
                className={cn(
                  "h-7 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-transform hover:scale-110",
                  activeColor === hex && "ring-2 ring-red-500 ring-offset-1 scale-105"
                )}
                title={hex}
              />
            ))}

            {/* Custom Color Input Button */}
            <label className="relative h-7 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 cursor-pointer transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <input
                type="color"
                value={activeColor}
                onChange={handleAddCustomColor}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Add custom color"
              />
            </label>
          </div>
        </div>

        {/* Undo / Redo History Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <Redo2 className="h-3.5 w-3.5" />
            <span>Redo</span>
          </button>
        </div>
      </div>

      {/* Primary Action Button (Fixed at Bottom of Panel) */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0f172a]/95">
        <button
          type="button"
          disabled={isSaving}
          onClick={onSaveChanges}
          className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-red-600/25 transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          <span>{isSaving ? "Saving PDF..." : "Save changes"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

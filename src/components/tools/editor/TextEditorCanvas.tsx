"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Trash2, 
  RotateCcw, 
  Check, 
  Type, 
  Plus, 
  Minus, 
  Palette, 
  X,
  Sparkles
} from "lucide-react";
import { EditableTextBlock } from "@/hooks/usePdfTextLayer";
import { cn } from "@/lib/utils";

export interface TextEditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  textBlocks: EditableTextBlock[];
  viewportDimensions: { width: number; height: number } | null;
  isLoading: boolean;
  onUpdateBlock: (id: string, updates: Partial<EditableTextBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onRestoreBlock: (id: string) => void;
  onAddBlock?: (domX: number, domY: number) => void;
  isAddTextMode?: boolean;
  scale: number;
}

const COLOR_PALETTE = [
  { name: "Black", hex: "#000000" },
  { name: "Dark Slate", hex: "#1e293b" },
  { name: "Navy Blue", hex: "#1d4ed8" },
  { name: "Ruby Red", hex: "#dc2626" },
  { name: "Emerald", hex: "#15803d" },
];

export function TextEditorCanvas({
  canvasRef,
  textBlocks,
  viewportDimensions,
  isLoading,
  onUpdateBlock,
  onDeleteBlock,
  onRestoreBlock,
  onAddBlock,
  isAddTextMode = false,
  scale,
}: TextEditorCanvasProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeBlock = textBlocks.find((b) => b.id === activeBlockId) || null;

  // Auto-focus input when a block is activated
  useEffect(() => {
    if (activeBlockId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [activeBlockId]);

  // Click outside to deselect
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveBlockId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddTextMode || !containerRef.current || !onAddBlock) return;

    // Get click position relative to canvas container
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    onAddBlock(clickX, clickY);
  };

  return (
    <div className="relative flex justify-center items-start w-full overflow-auto p-4 sm:p-6 md:p-8 select-none">
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        style={{
          width: viewportDimensions ? `${viewportDimensions.width}px` : "auto",
          height: viewportDimensions ? `${viewportDimensions.height}px` : "auto",
        }}
        className={cn(
          "relative rounded-xl shadow-2xl bg-white border border-slate-200 dark:border-slate-800 transition-all duration-150 overflow-hidden",
          isAddTextMode && "cursor-crosshair ring-2 ring-blue-500/50"
        )}
      >
        {/* Layer 1: Base PDF Canvas Rendered by pdfjs-dist */}
        <canvas
          ref={canvasRef}
          className="block w-full h-full pointer-events-none"
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xs flex flex-col items-center justify-center gap-3 z-30">
            <div className="h-8 w-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Rendering Page &amp; Extracting Text...
            </span>
          </div>
        )}

        {/* Layer 2: Interactive Absolute Text Overlay */}
        {!isLoading && (
          <div className="absolute inset-0 pointer-events-auto">
            {textBlocks.map((block) => {
              const isActive = activeBlockId === block.id;
              const isHovered = hoveredBlockId === block.id;
              const isModified =
                !block.isDeleted && block.currentText !== block.originalText;
              const activeBg = block.backgroundColor || "#ffffff";
              const activeColor = block.color || "#000000";
              const shouldMask = isActive || isModified || block.isDeleted;

              return (
                <div
                  key={block.id}
                  style={{
                    left: `${block.x}px`,
                    top: `${block.y}px`,
                    width: isActive ? `${Math.max(block.width, Math.ceil((block.currentText.length + 1) * (block.fontSize * 0.6)))}px` : `${block.width}px`,
                    minHeight: `${block.height}px`,
                    fontFamily: block.cssFontFamily,
                    fontSize: `${block.fontSize}px`,
                    backgroundColor: shouldMask ? activeBg : "transparent",
                  }}
                  onMouseEnter={() => setHoveredBlockId(block.id)}
                  onMouseLeave={() => setHoveredBlockId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveBlockId(block.id);
                  }}
                  className={cn(
                    "absolute transition-all duration-75 flex items-center z-10",
                    // Interaction borders & backgrounds
                    !isActive && !block.isDeleted && isHovered && "ring-1 ring-dashed ring-blue-500 bg-blue-500/15 cursor-text",
                    !isActive && isModified && "ring-1 ring-emerald-500/80",
                    !isActive && block.isDeleted && "ring-1 ring-rose-400 opacity-90 cursor-pointer",
                    isActive && "ring-2 ring-blue-500 shadow-md z-20 rounded-xs"
                  )}
                >
                  {/* State A: Active Inline Editing Input */}
                  {isActive ? (
                    <div className="relative w-full flex items-center">
                      <input
                        ref={inputRef}
                        type="text"
                        value={block.currentText}
                        onChange={(e) =>
                          onUpdateBlock(block.id, { currentText: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setActiveBlockId(null);
                          } else if (e.key === "Escape") {
                            setActiveBlockId(null);
                          }
                        }}
                        style={{
                          color: activeColor,
                          fontSize: `${block.fontSize}px`,
                          fontFamily: block.cssFontFamily,
                          backgroundColor: "transparent",
                        }}
                        className="w-full bg-transparent px-1 py-0 outline-none font-normal leading-none"
                      />
                    </div>
                  ) : (
                    /* State B: Display / Non-Active Bounding Box */
                    <div className="w-full h-full px-0.5 overflow-hidden whitespace-nowrap select-none flex items-center">
                      {block.isDeleted ? (
                        <span
                          style={{ backgroundColor: activeBg }}
                          className="text-xs text-red-600 font-bold px-1 rounded-xs border border-red-500/30"
                        >
                          [Deleted]
                        </span>
                      ) : isModified ? (
                        <span
                          style={{
                            color: activeColor,
                            fontSize: `${block.fontSize}px`,
                            fontFamily: block.cssFontFamily,
                            backgroundColor: activeBg,
                          }}
                          className="px-0.5 rounded-xs"
                        >
                          {block.currentText}
                        </span>
                      ) : (
                        <span className="w-full h-full text-transparent hover:text-slate-900/40" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Mini Action Toolbar for Active Text Block */}
        {activeBlock && !isLoading && (
          <div
            style={{
              left: `${Math.max(10, Math.min(activeBlock.x, (viewportDimensions?.width || 600) - 260))}px`,
              top: `${Math.max(10, activeBlock.y - 48)}px`,
            }}
            className="absolute z-40 flex items-center gap-1.5 bg-slate-900/95 text-white p-1.5 rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md animate-fadeIn"
          >
            {/* Font Size Adjusters */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-1.5 py-0.5 text-xs">
              <Type className="h-3.5 w-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() =>
                  onUpdateBlock(activeBlock.id, {
                    fontSize: Math.max(8, activeBlock.fontSize - 1),
                  })
                }
                className="hover:text-blue-400 p-0.5"
                title="Decrease font size"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-[11px] font-bold w-5 text-center">
                {Math.round(activeBlock.fontSize / scale)}
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateBlock(activeBlock.id, {
                    fontSize: activeBlock.fontSize + 1,
                  })
                }
                className="hover:text-blue-400 p-0.5"
                title="Increase font size"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Quick Colors */}
            <div className="flex items-center gap-1 px-1 border-l border-slate-700">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onUpdateBlock(activeBlock.id, { color: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={cn(
                    "h-4 w-4 rounded-full border border-white/20 transition-transform hover:scale-125",
                    activeBlock.color === c.hex && "ring-2 ring-blue-400 scale-110"
                  )}
                  title={c.name}
                />
              ))}
            </div>

            {/* Delete / Restore Action */}
            <div className="flex items-center gap-1 border-l border-slate-700 pl-1">
              {activeBlock.isDeleted ? (
                <button
                  type="button"
                  onClick={() => onRestoreBlock(activeBlock.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white"
                  title="Restore text"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restore</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteBlock(activeBlock.id);
                    setActiveBlockId(null);
                  }}
                  className="flex items-center gap-1 p-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg"
                  title="Delete text block"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Done / Close Button */}
              <button
                type="button"
                onClick={() => setActiveBlockId(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
                title="Done editing"
              >
                <Check className="h-4 w-4 text-emerald-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

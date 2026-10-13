"use client";

import React, { useState, useRef, useEffect } from "react";
import { Trash2, RotateCcw, Check, Plus } from "lucide-react";
import { EditableTextBlock } from "@/hooks/usePdfTextLayer";
import { cn } from "@/lib/utils";

export interface DocumentCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  textBlocks: EditableTextBlock[];
  viewportDimensions: { width: number; height: number } | null;
  isLoading: boolean;
  selectedBlockId: string | null;
  onSelectBlockId: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: Partial<EditableTextBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onRestoreBlock: (id: string) => void;
  onAddBlock?: (domX: number, domY: number) => void;
  isAddTextMode?: boolean;
  interactionTool?: "select" | "hand";
  scale: number;
}

export function DocumentCanvas({
  canvasRef,
  textBlocks,
  viewportDimensions,
  isLoading,
  selectedBlockId,
  onSelectBlockId,
  onUpdateBlock,
  onDeleteBlock,
  onRestoreBlock,
  onAddBlock,
  isAddTextMode = false,
  interactionTool = "select",
  scale,
}: DocumentCanvasProps) {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeBlock = textBlocks.find((b) => b.id === selectedBlockId) || null;

  // Auto-focus input when a block is activated
  useEffect(() => {
    if (selectedBlockId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedBlockId]);

  // Click outside to deselect
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onSelectBlockId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onSelectBlockId]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactionTool === "hand") return;

    if (isAddTextMode && containerRef.current && onAddBlock) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      onAddBlock(clickX, clickY);
    }
  };

  return (
    <div
      className={cn(
        "relative flex-1 h-full overflow-auto p-6 sm:p-10 flex justify-center items-start bg-slate-100 dark:bg-[#0b0f19] select-none scrollbar-thin transition-colors",
        interactionTool === "hand" ? "cursor-grab active:cursor-grabbing" : isAddTextMode && "cursor-crosshair"
      )}
    >
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        style={{
          width: viewportDimensions ? `${viewportDimensions.width}px` : "auto",
          height: viewportDimensions ? `${viewportDimensions.height}px` : "auto",
        }}
        className={cn(
          "relative rounded-sm bg-white shadow-xl border border-slate-300/80 dark:border-slate-800 transition-all duration-150 overflow-hidden",
          isAddTextMode && "ring-2 ring-red-500/50"
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
            <div className="h-8 w-8 rounded-full border-3 border-red-600 border-t-transparent animate-spin" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Rendering Page &amp; Text Layer...
            </span>
          </div>
        )}

        {/* Layer 2: Interactive Absolute Text Overlay */}
        {!isLoading && interactionTool !== "hand" && (
          <div className="absolute inset-0 pointer-events-auto">
            {textBlocks.map((block) => {
              const isSelected = selectedBlockId === block.id;
              const isHovered = hoveredBlockId === block.id;
              const isModified =
                !block.isDeleted && block.currentText !== block.originalText;
              const activeBg = block.backgroundColor || "#ffffff";
              const activeColor = block.color || "#000000";
              const shouldMask = isSelected || isModified || block.isDeleted;

              return (
                <div
                  key={block.id}
                  style={{
                    left: `${block.x}px`,
                    top: `${block.y}px`,
                    width: isSelected
                      ? `${Math.max(block.width, Math.ceil((block.currentText.length + 1) * (block.fontSize * 0.6)))}px`
                      : `${block.width}px`,
                    minHeight: `${block.height}px`,
                    fontFamily: block.cssFontFamily,
                    fontSize: `${block.fontSize}px`,
                    backgroundColor: shouldMask ? activeBg : "transparent",
                  }}
                  onMouseEnter={() => setHoveredBlockId(block.id)}
                  onMouseLeave={() => setHoveredBlockId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBlockId(block.id);
                  }}
                  className={cn(
                    "absolute transition-all duration-75 flex items-center z-10",
                    // Interactive States
                    !isSelected &&
                      !block.isDeleted &&
                      isHovered &&
                      "ring-1 ring-dashed ring-red-500 bg-red-500/15 cursor-text",
                    !isSelected &&
                      isModified &&
                      "ring-1 ring-emerald-500/80",
                    !isSelected &&
                      block.isDeleted &&
                      "ring-1 ring-rose-400 opacity-90 cursor-pointer",
                    isSelected &&
                      "ring-2 ring-red-500 shadow-md z-20 rounded-xs"
                  )}
                >
                  {/* Inline Active Input */}
                  {isSelected ? (
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
                            onSelectBlockId(null);
                          } else if (e.key === "Escape") {
                            onSelectBlockId(null);
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
                    /* Display Non-Active Text */
                    <div className="w-full h-full px-0.5 overflow-hidden whitespace-nowrap select-none flex items-center">
                      {block.isDeleted ? (
                        <span
                          style={{ backgroundColor: activeBg }}
                          className="text-[10px] text-red-500 font-bold px-1 rounded-xs border border-red-500/30"
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

        {/* Floating Action Pill directly above active selection */}
        {activeBlock && !isLoading && interactionTool !== "hand" && (
          <div
            style={{
              left: `${Math.max(8, Math.min(activeBlock.x, (viewportDimensions?.width || 600) - 130))}px`,
              top: `${Math.max(8, activeBlock.y - 38)}px`,
            }}
            className="absolute z-40 flex items-center gap-1 bg-slate-900/95 text-white px-2 py-1 rounded-lg shadow-xl border border-slate-700/80 backdrop-blur-md animate-fadeIn"
          >
            {activeBlock.isDeleted ? (
              <button
                type="button"
                onClick={() => onRestoreBlock(activeBlock.id)}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                title="Restore deleted text"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restore</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onDeleteBlock(activeBlock.id)}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300"
                title="Delete text block"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            )}

            <div className="h-3 w-[1px] bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={() => onSelectBlockId(null)}
              className="text-slate-400 hover:text-white"
              title="Done editing"
            >
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

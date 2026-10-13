"use client";

import React from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy, 
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  RotateCw, 
  RotateCcw, 
  Trash2, 
  Undo2, 
  FileText, 
  Loader2, 
  GripVertical 
} from "lucide-react";
import { PageState } from "@/hooks/usePdfOrganizer";
import { cn } from "@/lib/utils";

interface SortablePageCardProps {
  page: PageState;
  positionIndex: number;
  onRotatePage: (id: string, angle: number) => void;
  onDeletePage: (id: string) => void;
  onRestorePage: (id: string) => void;
  disabled?: boolean;
}

function SortablePageCard({
  page,
  positionIndex,
  onRotatePage,
  onDeletePage,
  onRestorePage,
  disabled = false,
}: SortablePageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: page.id,
    disabled: disabled || page.isDeleted,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isPositionChanged = positionIndex + 1 !== page.pageNumber;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border p-2.5 sm:p-3 transition-all duration-200 select-none bg-white dark:bg-slate-900 shadow-xs",
        isDragging && "z-40 shadow-2xl scale-105 border-blue-500 ring-2 ring-blue-500/30 opacity-90",
        page.isDeleted
          ? "border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 opacity-60"
          : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-md",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {/* Card Header: Position, Drag Handle & Status */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {!page.isDeleted && (
            <button
              type="button"
              {...attributes}
              {...listeners}
              disabled={disabled}
              title="Drag to rearrange page order"
              aria-label={`Drag to reorder page ${page.pageNumber}`}
              className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing shrink-0"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
              #{positionIndex + 1}
            </span>
            {isPositionChanged && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                (p.{page.pageNumber})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {page.isDeleted ? (
            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60">
              Deleted
            </span>
          ) : page.rotation !== 0 ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <RotateCw className="h-2.5 w-2.5" />
              {page.rotation}°
            </span>
          ) : null}
        </div>
      </div>

      {/* Thumbnail Canvas Viewport with 60FPS CSS Transform */}
      <div 
        {...attributes}
        {...listeners}
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center p-2.5",
          !page.isDeleted && "cursor-grab active:cursor-grabbing"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page.thumbnailUrl}
          alt={`PDF Page ${page.pageNumber}`}
          style={{
            transform: `rotate(${page.rotation}deg)`,
          }}
          className={cn(
            "max-h-[85%] max-w-[85%] object-contain transition-transform duration-300 ease-out select-none pointer-events-none drop-shadow-sm",
            page.isDeleted && "grayscale"
          )}
          loading="lazy"
        />

        {/* Deleted State: Red Overlay + Diagonal Strike + Centered Restore CTA */}
        {page.isDeleted && (
          <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center overflow-hidden">
            {/* Diagonal Strike-Through */}
            <div className="absolute w-[140%] h-0.5 bg-red-500/80 rotate-[-35deg] pointer-events-none shadow-sm" />

            <button
              type="button"
              onClick={() => onRestorePage(page.id)}
              className="relative z-10 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/80 text-xs font-bold shadow-md hover:bg-red-50 dark:hover:bg-red-950 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Restore this page"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Restore</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Footer: Quick Actions Pill */}
      <div className="mt-2.5 flex items-center justify-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        {page.isDeleted ? (
          <button
            type="button"
            onClick={() => onRestorePage(page.id)}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer min-h-[32px]"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Undo Delete</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onRotatePage(page.id, -90)}
              title="Rotate 90° counter-clockwise"
              aria-label={`Rotate page ${page.pageNumber} counter-clockwise`}
              className="flex-1 flex h-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onRotatePage(page.id, 90)}
              title="Rotate 90° clockwise"
              aria-label={`Rotate page ${page.pageNumber} clockwise`}
              className="flex-1 flex h-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDeletePage(page.id)}
              title="Delete page"
              aria-label={`Delete page ${page.pageNumber}`}
              className="flex-1 flex h-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export interface OrganizeGridProps {
  pages: PageState[];
  totalPages: number;
  isLoadingThumbnails: boolean;
  onRotatePage: (id: string, angle: number) => void;
  onDeletePage: (id: string) => void;
  onRestorePage: (id: string) => void;
  onReorderPages?: (oldIndex: number, newIndex: number) => void;
  disabled?: boolean;
  className?: string;
}

export function OrganizeGrid({
  pages,
  totalPages,
  isLoadingThumbnails,
  onRotatePage,
  onDeletePage,
  onRestorePage,
  onReorderPages,
  disabled = false,
  className,
}: OrganizeGridProps) {
  const remainingSkeletons = Math.max(0, totalPages - pages.length);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorderPages) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderPages(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={pages.map((p) => p.id)}
        strategy={rectSortingStrategy}
        disabled={disabled}
      >
        <div
          className={cn(
            "grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4",
            className
          )}
        >
          {pages.map((page, index) => (
            <SortablePageCard
              key={page.id}
              page={page}
              positionIndex={index}
              onRotatePage={onRotatePage}
              onDeletePage={onDeletePage}
              onRestorePage={onRestorePage}
              disabled={disabled}
            />
          ))}

          {/* Progressive Thumbnail Skeletons */}
          {isLoadingThumbnails &&
            Array.from({ length: remainingSkeletons }).map((_, idx) => {
              const pendingPageNum = pages.length + idx + 1;
              return (
                <div
                  key={`skeleton-${pendingPageNum}`}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 p-2.5 sm:p-3 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[11px] font-medium text-slate-400">
                      #{pendingPageNum}
                    </span>
                    <div className="h-4 w-4 rounded-md bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="aspect-square w-full rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                  <div className="mt-2.5 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/40" />
                </div>
              );
            })}
        </div>
      </SortableContext>
    </DndContext>
  );
}

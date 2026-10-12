"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { cn, formatBytes, truncateFileName } from "@/lib/utils";
import { UploadedPdfFile } from "@/types";

interface SortableItemProps {
  item: UploadedPdfFile;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

function SortableFileCard({
  item,
  index,
  total,
  onRemove,
  disabled = false,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-center justify-between rounded-xl border p-2.5 sm:p-3 transition-all gap-3 select-none",
        isDragging
          ? "z-30 border-blue-500 bg-blue-50/80 dark:bg-blue-950/80 shadow-md ring-2 ring-blue-500/20"
          : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#182239] hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xs"
      )}
    >
      {/* Drag Grip Handle + Red PDF Badge + File Details */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          title="Drag to reorder"
          className={cn(
            "flex h-7 w-5 items-center justify-center rounded-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing shrink-0",
            disabled && "cursor-not-allowed opacity-40"
          )}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-red-500 text-[10px] sm:text-xs font-black text-white shadow-2xs">
          PDF
        </div>

        <div className="min-w-0 flex-1">
          <p
            title={item.name}
            className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate"
          >
            {truncateFileName(item.name, 38)}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
            {typeof item.pageCount === "number" ? `${item.pageCount} pages • ` : ""}
            {formatBytes(item.size)}
          </p>
        </div>
      </div>

      {/* Right Badges & Remove Button */}
      <div className="flex items-center gap-2 shrink-0">
        {typeof item.pageCount === "number" && (
          <span className="hidden sm:inline-flex px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            {item.pageCount} pages
          </span>
        )}
        <span className="hidden sm:inline-flex px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
          {formatBytes(item.size)}
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onRemove(item.id)}
          title="Remove from list"
          className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

export interface MergeListProps {
  files: UploadedPdfFile[];
  onReorder: (newFiles: UploadedPdfFile[]) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export function MergeList({
  files,
  onReorder,
  onRemove,
  disabled = false,
}: MergeListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(arrayMove(files, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {files.map((file, index) => (
            <SortableFileCard
              key={file.id}
              item={file}
              index={index}
              total={files.length}
              onRemove={onRemove}
              disabled={disabled}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

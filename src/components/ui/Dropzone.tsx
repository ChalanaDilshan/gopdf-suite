"use client";

import React, { useRef, useState, useCallback } from "react";
import { UploadCloud, FileText, AlertCircle, ShieldCheck } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

export interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxSizeInBytes?: number;
  disabled?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  onError?: (error: string) => void;
}

export function Dropzone({
  onFilesSelected,
  accept = [".pdf", "application/pdf"],
  maxFiles = 20,
  maxSizeInBytes = 50 * 1024 * 1024, // 50MB
  disabled = false,
  className,
  title = "Drop your PDF files here",
  subtitle = "or browse from your device",
  onError,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateAndProcessFiles = useCallback(
    (fileList: FileList | File[]) => {
      setErrorMessage(null);
      const incoming = Array.from(fileList);

      if (incoming.length === 0) return;

      if (incoming.length > maxFiles) {
        const msg = `You can only upload up to ${maxFiles} files at a time.`;
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }

      const validFiles: File[] = [];

      for (const file of incoming) {
        // Validate PDF type
        const isPdfExtension = file.name.toLowerCase().endsWith(".pdf");
        const isPdfMime = file.type === "application/pdf" || file.type === "";
        const isValidPdf = isPdfExtension && (isPdfMime || file.type === "");

        if (!isValidPdf) {
          const msg = `"${file.name}" is not a valid PDF file.`;
          setErrorMessage(msg);
          onError?.(msg);
          return;
        }

        // Validate Size
        if (file.size > maxSizeInBytes) {
          const msg = `"${file.name}" exceeds maximum allowed file size of ${formatBytes(maxSizeInBytes)}.`;
          setErrorMessage(msg);
          onError?.(msg);
          return;
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [maxFiles, maxSizeInBytes, onError, onFilesSelected]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current = 0;
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
      // Reset input value so same files can be re-selected if removed
      e.target.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-disabled={disabled}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-200 cursor-pointer select-none outline-none group",
          "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
          isDragOver
            ? "border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-glow"
            : "border-slate-300 hover:border-indigo-400 bg-white/70 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-indigo-500/80 dark:hover:bg-slate-800/40",
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
          className
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(",")}
          multiple
          disabled={disabled}
          onChange={handleInputChange}
          className="hidden"
          id="pdf-dropzone-input"
          aria-label="Upload PDF files"
        />

        <div className="relative mb-4">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 shadow-sm",
              isDragOver
                ? "bg-indigo-600 text-white scale-110 shadow-indigo-500/30"
                : "bg-indigo-100 text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/80 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white"
            )}
          >
            {isDragOver ? (
              <FileText className="h-8 w-8 animate-bounce" />
            ) : (
              <UploadCloud className="h-8 w-8 transition-transform group-hover:-translate-y-0.5" />
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300">
            PDF only
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300">
            Up to {maxFiles} files
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300">
            Max {formatBytes(maxSizeInBytes)} / file
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Client-Side Only
          </span>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-3.5 py-2.5 text-xs text-red-700 dark:text-red-300 animate-fadeIn"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

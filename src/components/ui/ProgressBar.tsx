"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  status?: "idle" | "loading" | "success" | "error";
  errorText?: string;
  onCancel?: () => void;
  onReset?: () => void;
  className?: string;
  barColor?: string;
}

export function ProgressBar({
  progress,
  label = "Processing...",
  showPercentage = true,
  status = "loading",
  errorText,
  onCancel,
  onReset,
  className,
  barColor,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const isComplete = clampedProgress >= 100 || status === "success";
  const isFailed = status === "error";

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between text-sm font-medium mb-2.5">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : isFailed ? (
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          )}
          <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-xs md:max-w-md">
            {isFailed ? errorText || "Processing failed" : label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {showPercentage && (
            <span
              className={cn(
                "tabular-nums text-xs font-semibold px-2 py-0.5 rounded-md",
                isComplete
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : isFailed
                  ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                  : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
              )}
            >
              {clampedProgress}%
            </span>
          )}

          {onCancel && !isComplete && !isFailed && (
            <button
              type="button"
              onClick={onCancel}
              title="Cancel processing"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {onReset && (isComplete || isFailed) && (
            <button
              type="button"
              onClick={onReset}
              title="Reset"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            isComplete
              ? "bg-emerald-500"
              : isFailed
              ? "bg-red-500"
              : barColor || "bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600"
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Hook to manage animated progress with cancel, reset, and step simulation capabilities.
 */
export function useProgressBar(initialProgress: number = 0) {
  const [progress, setProgress] = useState(initialProgress);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState<string | undefined>(undefined);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setProgress(0);
    setStatus("idle");
    setErrorText(undefined);
  }, [clearTimer]);

  const cancel = useCallback(() => {
    clearTimer();
    setStatus("idle");
  }, [clearTimer]);

  const fail = useCallback((err?: string) => {
    clearTimer();
    setStatus("error");
    setErrorText(err || "Operation failed");
  }, [clearTimer]);

  const complete = useCallback(() => {
    clearTimer();
    setProgress(100);
    setStatus("success");
  }, [clearTimer]);

  const simulateProgress = useCallback(
    (durationMs: number = 2500, onFinished?: () => void) => {
      clearTimer();
      setProgress(0);
      setStatus("loading");
      setErrorText(undefined);

      const intervalMs = 50;
      const stepIncrement = (100 / (durationMs / intervalMs)) * 0.9;

      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearTimer();
            return 95;
          }
          return Math.min(95, prev + stepIncrement + Math.random() * 2);
        });
      }, intervalMs);

      // Final completion
      setTimeout(() => {
        clearTimer();
        setProgress(100);
        setStatus("success");
        onFinished?.();
      }, durationMs);
    },
    [clearTimer]
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    progress,
    status,
    errorText,
    setProgress,
    setStatus,
    reset,
    cancel,
    fail,
    complete,
    simulateProgress,
  };
}

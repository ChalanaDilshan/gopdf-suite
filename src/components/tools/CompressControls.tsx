"use client";

import React from "react";
import { 
  Zap, 
  Sparkles, 
  Check, 
  ArrowDownRight, 
  FileCheck, 
  Layers, 
  ShieldCheck 
} from "lucide-react";
import { CompressionLevel } from "@/hooks/usePdfCompressor";
import { formatBytes, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface CompressControlsProps {
  originalSize: number;
  selectedLevel: CompressionLevel;
  onSelectLevel: (level: CompressionLevel) => void;
  onCompress: () => void;
  disabled?: boolean;
  isCompressing?: boolean;
}

interface LevelOption {
  id: CompressionLevel;
  name: string;
  badge: string;
  badgeColor: string;
  estimatedReduction: string;
  factor: number; // e.g. 0.3 for 70% reduction
  description: string;
  icon: React.ReactNode;
}

const LEVELS: LevelOption[] = [
  {
    id: "extreme",
    name: "Extreme Compression",
    badge: "Maximum Reduction",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    estimatedReduction: "~65% – 75% reduction",
    factor: 0.3,
    description: "Lowest file size. Ideal for strict email attachment caps and low-bandwidth sharing.",
    icon: <Zap className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
  },
  {
    id: "recommended",
    name: "Recommended Compression",
    badge: "Recommended",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
    estimatedReduction: "~40% – 50% reduction",
    factor: 0.55,
    description: "Optimal balance between crisp readability, sharp graphics, and strong file savings.",
    icon: <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    id: "basic",
    name: "Basic / Lossless Stream",
    badge: "High Quality",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    estimatedReduction: "~15% – 25% reduction",
    factor: 0.8,
    description: "Packs FlateDecode object streams & strips metadata while keeping 100% vector clarity.",
    icon: <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
  },
];

export function CompressControls({
  originalSize,
  selectedLevel,
  onSelectLevel,
  onCompress,
  disabled = false,
  isCompressing = false,
}: CompressControlsProps) {
  const activeOption = LEVELS.find((l) => l.id === selectedLevel) || LEVELS[1];
  const estimatedNewBytes = Math.round(originalSize * activeOption.factor);
  const estimatedSavedBytes = Math.max(0, originalSize - estimatedNewBytes);
  const estimatedPercent = Math.round((1 - activeOption.factor) * 100);

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header Prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Select Compression Level
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose the target balance between document file size and visual fidelity.
          </p>
        </div>

        {/* Live Savings Estimate Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-indigo-300 self-start sm:self-auto">
          <ArrowDownRight className="h-4 w-4 shrink-0" />
          <span>
            Est. Size: ~{formatBytes(estimatedNewBytes)} (-{estimatedPercent}%)
          </span>
        </div>
      </div>

      {/* 3 Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {LEVELS.map((level) => {
          const isSelected = selectedLevel === level.id;

          return (
            <div
              key={level.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={disabled ? -1 : 0}
              onClick={() => !disabled && onSelectLevel(level.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  !disabled && onSelectLevel(level.id);
                }
              }}
              className={cn(
                "group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer select-none",
                isSelected
                  ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-md scale-[1.01]"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xs",
                disabled && "opacity-50 pointer-events-none cursor-not-allowed"
              )}
            >
              {/* Radio Indicator + Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${level.badgeColor}`}>
                  {level.badge}
                </span>

                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent"
                  )}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-1.5">
                  {level.icon}
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {level.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {level.description}
                </p>
              </div>

              {/* Estimated Reduction Tag */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>Estimated:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {level.estimatedReduction}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Button Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Original file: {formatBytes(originalSize)} • Processed 100% in memory</span>
        </div>

        <Button
          size="lg"
          isLoading={isCompressing}
          disabled={disabled || isCompressing}
          onClick={onCompress}
          leftIcon={<Zap className="h-4 w-4" />}
          className="w-full sm:w-auto shadow-md shadow-indigo-600/20"
        >
          Compress PDF Now
        </Button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { 
  FileStack, 
  Scissors, 
  RotateCw, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Check, 
  Sparkles,
  Lock,
  Layers,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoToolsGrid() {
  return (
    <section className="py-12 sm:py-16">
      <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Full Client-Side Suite</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Everything You Need to Edit PDFs{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Without Cloud Uploads
          </span>
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Select a dedicated micro-tool below or drop any PDF into the workspace above to get started immediately.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Bento 1: Merge PDF (6 Columns on LG) */}
        <Link
          href="/merge-pdf"
          className="group lg:col-span-6 relative flex flex-col justify-between overflow-hidden rounded-3xl border border-indigo-100 dark:border-indigo-950/80 bg-gradient-to-br from-white via-indigo-50/20 to-indigo-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 hover:-translate-y-1"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <FileStack className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                Most Popular
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Merge PDF Files
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Combine multiple PDF documents into a clean, unified file with interactive drag-and-drop reordering. Zero page limits, infinite merges.
            </p>
          </div>

          {/* Visual Mini Mockup */}
          <div className="my-6 py-4 flex items-center justify-center">
            <div className="flex items-center -space-x-3 group-hover:space-x-1 transition-all duration-300">
              <div className="w-16 h-20 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-1.5 flex flex-col justify-between -rotate-6 group-hover:rotate-0 transition-transform">
                <span className="text-[10px] font-bold text-indigo-600">Doc 1</span>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="w-16 h-20 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-1.5 flex flex-col justify-between z-10 group-hover:scale-105 transition-transform">
                <span className="text-[10px] font-bold text-indigo-600">Doc 2</span>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="w-16 h-20 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-1.5 flex flex-col justify-between rotate-6 group-hover:rotate-0 transition-transform">
                <span className="text-[10px] font-bold text-indigo-600">Doc 3</span>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="pl-5 text-indigo-600 dark:text-indigo-400 font-black text-lg">
                ➔
              </div>
              <div className="w-20 h-24 rounded-lg bg-indigo-600 text-white shadow-md p-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold">Combined</span>
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-white/40 rounded-full" />
                  <div className="w-3/4 h-1 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Combine Documents</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Bento 2: Compress PDF (6 Columns on LG) */}
        <Link
          href="/compress-pdf"
          className="group lg:col-span-6 relative flex flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 dark:border-violet-950/80 bg-gradient-to-br from-white via-violet-50/20 to-violet-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/40 p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-800 transition-all duration-300 hover:-translate-y-1"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/30">
                <Zap className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 px-3 py-1 text-xs font-bold border border-violet-200 dark:border-violet-800">
                Save up to 70%
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Compress PDF Online
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Shrink bloated files client-side with smart canvas raster downscaling, metadata pruning, and FlateDecode object streams.
            </p>
          </div>

          {/* Visual Mini Mockup */}
          <div className="my-6 py-4 flex items-center justify-center gap-4">
            <div className="w-24 h-20 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-2 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-slate-400">Original</span>
              <div className="text-center font-black text-slate-700 dark:text-slate-300 text-xs">
                12.4 MB
              </div>
              <span className="text-[9px] text-red-500 font-bold self-center">Heavy</span>
            </div>
            <div className="text-violet-600 dark:text-violet-400 font-black text-lg">
              ➔
            </div>
            <div className="w-24 h-20 rounded-xl bg-violet-600 text-white shadow-md p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-violet-200">Optimized</span>
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <div className="text-center font-black text-white text-xs">
                3.8 MB
              </div>
              <span className="text-[9px] bg-white/20 rounded px-1 text-white font-bold self-center">
                -69% Saved
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
            <span>Compress Document</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Bento 3: Split PDF (3 Columns on LG) */}
        <Link
          href="/split-pdf"
          className="group lg:col-span-3 relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-100 dark:border-emerald-950/80 bg-gradient-to-br from-white via-emerald-50/20 to-emerald-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-800 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                <Scissors className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                Visual
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Split PDF
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Extract specific pages, odd/even sequences, or custom ranges with thumbnails.
            </p>
          </div>

          {/* Visual Mini Mockup */}
          <div className="my-5 py-2 flex items-center justify-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold">
              1 ✓
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold">
              2 ✓
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 text-[11px] font-semibold">
              3
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold">
              4 ✓
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>Extract Pages</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Bento 4: Rotate PDF (3 Columns on LG) */}
        <Link
          href="/rotate-pdf"
          className="group lg:col-span-3 relative flex flex-col justify-between overflow-hidden rounded-3xl border border-amber-100 dark:border-amber-950/80 bg-gradient-to-br from-white via-amber-50/20 to-amber-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md shadow-amber-600/30">
                <RotateCw className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-xs font-bold border border-amber-200 dark:border-amber-800">
                60fps
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Rotate PDF
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rotate single pages or the entire file 90°, 180°, or 270° instantly.
            </p>
          </div>

          {/* Visual Mini Mockup */}
          <div className="my-5 py-2 flex items-center justify-center gap-2">
            <div className="w-11 h-14 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex flex-col items-center justify-center shadow-xs">
              <span className="text-[9px] text-slate-400">0°</span>
            </div>
            <div className="text-amber-600 dark:text-amber-400 font-bold text-xs">
              ➔
            </div>
            <div className="w-14 h-11 rounded-lg bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-500 p-1 flex flex-col items-center justify-center shadow-xs">
              <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300">
                +90°
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Rotate Pages</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Bento 5: Delete PDF Pages (3 Columns on LG) */}
        <Link
          href="/delete-pdf-pages"
          className="group lg:col-span-3 relative flex flex-col justify-between overflow-hidden rounded-3xl border border-rose-100 dark:border-rose-950/80 bg-gradient-to-br from-white via-rose-50/20 to-rose-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/40 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
                <Trash2 className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 text-xs font-bold border border-rose-200 dark:border-rose-800">
                Undo Ready
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Delete Pages
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Remove unwanted sheets or blanks with visual strike and 1-click restore.
            </p>
          </div>

          {/* Visual Mini Mockup */}
          <div className="my-5 py-2 flex items-center justify-center gap-2">
            <div className="w-10 h-14 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center text-[9px] font-bold text-slate-600">
              #1
            </div>
            <div className="relative w-10 h-14 rounded-lg bg-red-100/60 dark:bg-red-950/40 border border-red-300 dark:border-red-800 p-1 flex items-center justify-center text-[9px] font-bold text-red-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500 rotate-45" />
              </div>
              <span className="relative z-10 bg-white dark:bg-slate-900 px-1 rounded-xs">
                X
              </span>
            </div>
            <div className="w-10 h-14 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center text-[9px] font-bold text-slate-600">
              #3
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
            <span>Delete Pages</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Bento 6: Reorder PDF Pages (3 Columns on LG) */}
        <Link
          href="/reorder-pdf-pages"
          className="group lg:col-span-3 relative flex flex-col justify-between overflow-hidden rounded-3xl border border-sky-100 dark:border-sky-950/80 bg-gradient-to-br from-white via-sky-50/20 to-sky-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/40 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-800 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30">
                <ArrowRight className="h-5 w-5 rotate-90" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2.5 py-0.5 text-xs font-bold border border-sky-200 dark:border-sky-800">
                Drag &amp; Drop
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Reorder Pages
            </h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag and drop to rearrange your document sequence into any order.
            </p>
          </div>

          {/* Visual Mini Mockup */}
          <div className="my-5 py-2 flex items-center justify-center gap-2">
            <div className="w-10 h-14 rounded-lg bg-white dark:bg-slate-800 border-2 border-dashed border-sky-400 p-1 flex items-center justify-center text-[9px] font-bold text-sky-600 shadow-sm scale-105">
              #2
            </div>
            <div className="text-sky-600 dark:text-sky-400 font-bold text-xs">
              ⇄
            </div>
            <div className="w-10 h-14 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center text-[9px] font-bold text-slate-600">
              #1
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
            <span>Rearrange Order</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        {/* Bento 5: Full-Width Privacy & Performance Architecture (12 Columns) */}
        <div className="lg:col-span-12 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#131b2e]/70 backdrop-blur-xl p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                Zero Cloud Uploads
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional sites upload documents to AWS or GCP cloud servers. GoPDF executes every byte locally in your device RAM sandbox.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                0-Second Upload Latency
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Skip long upload and download queues. Process 50-page documents at native WebAssembly speeds in fractions of a second.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                100% Free &amp; Clean
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No email registration, no subscription paywalls, no file watermarks, and no tracking cookies. Free forever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

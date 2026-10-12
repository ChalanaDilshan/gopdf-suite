import React from "react";
import { ShieldCheck, Zap, Lock, Check } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center">
        {/* Left Column: Headlines & Trust Badges */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-[11px] font-bold text-blue-700 dark:text-blue-300 tracking-wider uppercase">
            <span>Free PDF Tool</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Merge PDF Files{" "}
            <span className="text-blue-600 dark:text-blue-400">Online</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Combine multiple PDF files into a single document — fast, secure, and entirely in your browser.
          </p>

          {/* Trust Badges — hide last badge on very small screens */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">100% Private</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">No uploads</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Zap className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Works Offline</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">In your browser</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Lock className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Secure</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Your files stay on you device</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Graphic — hidden on mobile to reduce layout height */}
        <div className="hidden sm:flex lg:col-span-5 relative items-center justify-center min-h-[220px]">
          <div className="relative flex items-center justify-center w-full max-w-md py-4">
            {/* Input Stack (Sheets 1, 2, 3) */}
            <div className="relative flex items-center -space-x-4">
              {/* Sheet 1 */}
              <div className="relative w-20 sm:w-24 h-28 sm:h-32 rounded-xl bg-white dark:bg-[#182239] border border-slate-200 dark:border-slate-700 shadow-md p-2 flex flex-col justify-between -rotate-6 transform hover:rotate-0 transition-transform">
                <div className="flex items-center justify-between">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/80 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                    1
                  </span>
                  <div className="w-4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-xs" />
                </div>
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="w-10 h-7 rounded-sm bg-red-500 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">
                    PDF
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-xs" />
                  <div className="w-2/3 h-1 bg-slate-100 dark:bg-slate-800 rounded-xs" />
                </div>
              </div>

              {/* Plus Badge */}
              <div className="absolute left-[36%] bottom-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shadow-md border-2 border-white dark:border-[#131b2e]">
                +
              </div>

              {/* Sheet 2 */}
              <div className="relative w-20 sm:w-24 h-28 sm:h-32 rounded-xl bg-white dark:bg-[#182239] border border-slate-200 dark:border-slate-700 shadow-md p-2 flex flex-col justify-between z-10 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/80 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                    2
                  </span>
                  <div className="w-4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-xs" />
                </div>
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="w-10 h-7 rounded-sm bg-red-500 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">
                    PDF
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-xs" />
                  <div className="w-3/4 h-1 bg-slate-100 dark:bg-slate-800 rounded-xs" />
                </div>
              </div>

              {/* Sheet 3 */}
              <div className="relative w-20 sm:w-24 h-28 sm:h-32 rounded-xl bg-white dark:bg-[#182239] border border-slate-200 dark:border-slate-700 shadow-md p-2 flex flex-col justify-between rotate-6 transform hover:rotate-0 transition-transform">
                <div className="flex items-center justify-between">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/80 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                    3
                  </span>
                  <div className="w-4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-xs" />
                </div>
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="w-10 h-7 rounded-sm bg-red-600 flex items-center justify-center text-[9px] font-bold text-white shadow-2xs">
                    PDF
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-xs" />
                  <div className="w-1/2 h-1 bg-slate-100 dark:bg-slate-800 rounded-xs" />
                </div>
              </div>
            </div>

            {/* Dotted Arrow Indicator */}
            <div className="mx-3 sm:mx-4 flex items-center text-blue-500 dark:text-blue-400">
              <span className="text-xl sm:text-2xl font-black tracking-widest">···&gt;</span>
            </div>

            {/* Merged Target Sheet */}
            <div className="relative w-24 sm:w-28 h-32 sm:h-36 rounded-xl bg-white dark:bg-[#182239] border-2 border-blue-200/80 dark:border-blue-600/70 shadow-lg p-2.5 flex flex-col justify-between">
              <div className="absolute -top-2.5 -right-2.5 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md border-2 border-white dark:border-[#131b2e]">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>

              <div className="w-8 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-xs mb-1" />

              <div className="flex flex-col items-center justify-center my-auto">
                <div className="w-12 h-9 rounded-sm bg-red-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  PDF
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-xs" />
                <div className="w-4/5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-xs" />
                <div className="w-2/3 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-xs" />
              </div>
            </div>

            {/* Note Annotation */}
            <div className="absolute -bottom-5 right-2 hidden sm:flex items-center gap-1 text-blue-600 dark:text-blue-400 font-serif italic text-xs">
              <svg
                className="w-5 h-5 text-blue-500 -scale-x-100 rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <span>Multiple files → One document</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

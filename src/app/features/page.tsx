"use client";

import React from "react";
import Link from "next/link";
import { 
  FileStack, 
  Scissors, 
  RotateCw, 
  Trash2, 
  ArrowUpDown, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Cpu, 
  WifiOff, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  SlidersHorizontal, 
  CheckCircle2, 
  Eye, 
  HelpCircle 
} from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";

const CORE_TOOLS = [
  {
    id: "merge",
    name: "Merge PDF Studio",
    badge: "Unlimited Files",
    badgeColor: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: FileStack,
    accent: "from-blue-600 to-cyan-600",
    href: "/merge-pdf",
    description:
      "Combine dozens of PDF files into a single, cohesive document. Drag to reorder documents with instant thumbnail feedback, inspect page counts, and export in seconds.",
    highlights: [
      "No file quantity limit — merge 2 or 50+ documents",
      "Interactive drag-and-drop file reordering",
      "Automatic page count detection and size estimation",
      "Memory-safe stream assembly with pdf-lib",
    ],
  },
  {
    id: "split",
    name: "Split & Range Extractor",
    badge: "Visual Previews",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    icon: Scissors,
    accent: "from-emerald-600 to-teal-600",
    href: "/split-pdf",
    description:
      "Extract exact pages or page intervals from large documents. Visually check cards or type complex custom ranges with automated live synchronization.",
    highlights: [
      "Custom range syntax parsing (e.g., 1-4, 7, 10-15)",
      "Quick Select buttons: All, None, Odd, or Even pages",
      "Live thumbnail previews of every single page",
      "Preserves original formatting, fonts, and vector elements",
    ],
  },
  {
    id: "rotate",
    name: "Permanent Page Rotation",
    badge: "60fps Hardware Accelerated",
    badgeColor: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    icon: RotateCw,
    accent: "from-amber-600 to-orange-600",
    href: "/rotate-pdf",
    description:
      "Rotate pages 90° clockwise, 90° counter-clockwise, or 180° upside-down. Instant CSS transforms ensure smooth 60fps interaction without canvas redraw lags.",
    highlights: [
      "Zero-latency hardware CSS transforms for instant visual feedback",
      "Rotate individual pages or click 'Rotate All Clockwise'",
      "Modifies internal PDF geometry dictionary permanently",
      "Displays properly in Adobe Acrobat, Apple Preview, and print",
    ],
  },
  {
    id: "delete",
    name: "Non-Destructive Page Deletion",
    badge: "1-Click Instant Undo",
    badgeColor: "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    icon: Trash2,
    accent: "from-rose-600 to-red-600",
    href: "/delete-pdf-pages",
    description:
      "Remove unwanted sheets, blank pages, or sensitive appendices. Marked pages display a diagonal strike-through with an instant 'Undo' button to prevent mistakes.",
    highlights: [
      "Visual strike-through and faded card indicator",
      "One-click instant restore on any deleted page",
      "True stream stripping — discarded pages reduce final file size",
      "Reset All button restores full document with one click",
    ],
  },
  {
    id: "reorder",
    name: "Drag-and-Drop Page Reordering",
    badge: "Tactile Page Studio",
    badgeColor: "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    icon: ArrowUpDown,
    accent: "from-sky-600 to-cyan-600",
    href: "/reorder-pdf-pages",
    description:
      "Reorganize the sequence of pages in your PDF using fluid drag-and-drop powered by @dnd-kit. Combine reordering with rotation and deletion in the same view.",
    highlights: [
      "Tactile multi-column grid sorting with @dnd-kit",
      "Dynamic position badges showing new order and original page",
      "Combine with rotate and delete in a single export session",
      "Zero server roundtrips — reordered directly in local RAM",
    ],
  },
];

const ARCHITECTURE_PILLARS = [
  {
    icon: <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "100% In-Memory RAM Sandbox",
    description:
      "Your documents are never transmitted across the network. All operations run inside your browser's private memory space, guaranteeing complete compliance with HIPAA, GDPR, and non-disclosure agreements.",
  },
  {
    icon: <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "WebAssembly & Native Execution",
    description:
      "By leveraging WebAssembly and low-level byte buffers, GoPDF processes heavy documents with tens of pages at local hardware speeds — completely bypassing cloud latency.",
  },
  {
    icon: <WifiOff className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Offline-First Readiness",
    description:
      "Once loaded, GoPDF continues functioning even if your internet disconnects, in airplane mode, or on high-security air-gapped computers.",
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Decoupled 60fps UI Architecture",
    description:
      "Visual interactions (such as rotating thumbnails and dragging page cards) use hardware CSS transforms and deferred canvas operations to keep the UI fluid and responsive.",
  },
];

const FEATURE_COMPARISON_MATRIX = [
  { feature: "Maximum File Size", gopdf: "Up to 100MB per file", cloud: "Usually 15MB - 25MB (Free tier)" },
  { feature: "Network File Upload", gopdf: "0 KB (Local RAM only)", cloud: "Full file uploaded to cloud" },
  { feature: "Processing Latency", gopdf: "0s (Instant CPU)", cloud: "10s - 45s (Upload + Queue + Download)" },
  { feature: "Offline Usage", gopdf: "Supported (PWA / Browser Cache)", cloud: "Impossible without internet" },
  { feature: "Watermarks & Limits", gopdf: "None (100% Free Forever)", cloud: "Hourly limits or paid Pro plans" },
  { feature: "Combine Multiple Tools", gopdf: "Yes (Rotate + Delete + Reorder)", cloud: "Requires separate passes" },
  { feature: "Sensitive Document Safe", gopdf: "100% Private (HIPAA/GDPR safe)", cloud: "Third-party server risk" },
];

const FEATURES_FAQS = [
  {
    id: "what-operations",
    question: "What PDF operations can GoPDF perform?",
    answer:
      "GoPDF provides a full suite of client-side PDF micro-tools: merging multiple documents in custom order, splitting and extracting custom page ranges (e.g. 1-3, 5), rotating pages clockwise and counter-clockwise at 60fps, deleting unwanted sheets with 1-click undo, and drag-and-drop page reordering.",
  },
  {
    id: "free-and-limits",
    question: "Do any features require paying or creating an account?",
    answer:
      "No. All GoPDF tools and features are 100% free with no account creation, no subscriptions, no file count restrictions, and no watermarks.",
  },
  {
    id: "60fps-performance",
    question: "How does GoPDF achieve 60fps preview rotations without lag?",
    answer:
      "GoPDF decouples visual preview rendering from PDF generation. Page thumbnails are rendered into memory once, and rotations apply instant hardware-accelerated CSS transforms. The internal PDF geometry dictionary is updated during export via pdf-lib.",
  },
  {
    id: "combined-actions",
    question: "Can I combine multiple actions like reordering, rotating, and deleting in one step?",
    answer:
      "Yes. The GoPDF Page Studio allows you to reorder pages, rotate individual orientations, and delete unwanted sheets all within the same session before saving your output document.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-150">
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800/80 px-4 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-xs mb-6">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>The Next-Generation Client-Side PDF Architecture</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Engineered for Speed, Precision &amp;{" "}
              <span className="text-blue-600 dark:text-blue-500">
                Total Privacy
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover every tool and architectural innovation built into GoPDF. Merge, split, rotate, delete, and reorder pages with zero server uploads and zero latency.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/">
                <Button size="lg" className="shadow-lg shadow-blue-600/25">
                  Launch All-in-One Studio
                </Button>
              </Link>
              <Link href="/privacy-first-pdf-tools">
                <Button variant="outline" size="lg">
                  Read Security Whitepaper
                </Button>
              </Link>
            </div>

            {/* Stat Counters */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">0 KB</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Uploaded to Cloud</div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">60 FPS</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hardware Transforms</div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Offline Ready</div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">$0</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Free &amp; Watermark-Free</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Deep-Dives */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Interactive Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Core Capabilities &amp; Workflows
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Every tool is engineered to run entirely on your device with high performance.
            </p>
          </div>

          <div className="space-y-8">
            {CORE_TOOLS.map((tool, index) => {
              const Icon = tool.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={tool.id}
                  className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 sm:p-10 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shadow-xs">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${tool.badgeColor}`}>
                            {tool.badge}
                          </span>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                            {tool.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        {tool.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        <Link href={tool.href}>
                          <Button size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                            Launch {tool.name}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex items-center justify-center">
                      <div className="w-full aspect-[4/3] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <Icon className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-105 transition-transform duration-200" />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          100% In-Browser Execution
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Zero cloud uploads • Instant execution
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical Architecture Pillars */}
        <section className="border-t border-slate-200/80 dark:border-slate-800 py-16 sm:py-24 bg-white/60 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Engineering
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                The Client-Side Technology Stack
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                How GoPDF achieves desktop-grade PDF manipulation inside a modern browser sandbox.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ARCHITECTURE_PILLARS.map((pillar, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 shadow-xs space-y-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/70">
                    {pillar.icon}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Benchmarking
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              GoPDF vs Traditional Online Converters
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                    <th className="py-4 px-5 sm:px-6 font-bold text-slate-700 dark:text-slate-300">
                      Capability
                    </th>
                    <th className="py-4 px-5 sm:px-6 font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40">
                      GoPDF
                    </th>
                    <th className="py-4 px-5 sm:px-6 font-semibold text-slate-500 dark:text-slate-400">
                      Traditional Cloud Tools
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {FEATURE_COMPARISON_MATRIX.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-5 sm:px-6 font-semibold text-slate-900 dark:text-slate-200">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-5 sm:px-6 font-bold text-emerald-700 dark:text-emerald-300 bg-blue-50/20 dark:bg-blue-950/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{row.gopdf}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 sm:px-6 text-slate-600 dark:text-slate-400">
                        {row.cloud}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12" id="faq">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
              <HelpCircle className="h-4 w-4" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Features FAQ
            </h2>
          </div>

          <Accordion
            items={FEATURES_FAQS.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
            }))}
            defaultExpandedIds={[FEATURES_FAQS[0].id]}
          />
        </section>

        {/* Bottom CTA Banner */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center shadow-xs">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Ready to process PDFs with total privacy?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
              No signups, no installations, and zero cloud uploads. Open our free in-browser PDF studio now.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs">
                  Launch GoPDF Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

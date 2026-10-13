import React from "react";
import Link from "next/link";
import { 
  Lightbulb, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  HardDrive,
  Cpu
} from "lucide-react";

export interface TroubleshootingItem {
  problem: string;
  solution: string;
}

export interface RelatedToolLink {
  title: string;
  href: string;
  anchorText: string;
  description: string;
}

export interface ToolContentGuideProps {
  toolName: string;
  primaryKeyword: string;
  howToTitle: string;
  howToSteps: Array<{
    title: string;
    description: string;
  }>;
  tips: {
    fileSizeTip: string;
    pageOrderTip: string;
    commonProblems: TroubleshootingItem[];
  };
  comparison: {
    heading: string;
    summary: string;
    advantages: string[];
    honestTradeoffs: string[];
  };
  relatedTools: RelatedToolLink[];
}

export function ToolContentGuide({
  toolName,
  primaryKeyword,
  howToTitle,
  howToSteps,
  tips,
  comparison,
  relatedTools,
}: ToolContentGuideProps) {
  return (
    <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 space-y-16">
      {/* 1. Step-by-Step How-To Guide */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Step-by-Step Walkthrough
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {howToTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Follow this simple guide to master {primaryKeyword.toLowerCase()} with zero server uploads and total privacy directly in your web browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {howToSteps.map((step, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Step {idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Practical Tips: File Size, Preparation & Troubleshooting */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Lightbulb className="h-4 w-4" />
            <span>Expert Tips &amp; Troubleshooting</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Best Practices for {toolName}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* File Size & Memory Tip */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              File Size &amp; Browser Memory
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {tips.fileSizeTip}
            </p>
          </div>

          {/* Page Order & Preparation Tip */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Page Order &amp; Orientation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {tips.pageOrderTip}
            </p>
          </div>
        </div>

        {/* Common Problems / Solutions */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <span>Common Problems &amp; How to Solve Them</span>
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tips.commonProblems.map((prob, idx) => (
              <div key={idx} className="py-3.5 space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {prob.problem}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {prob.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Honest "How Is This Different" Comparison */}
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-[#131b2e] dark:via-[#0f172a] dark:to-blue-950/20 p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Zero-Cloud Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {comparison.heading}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {comparison.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Key Advantages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Why In-Browser Processing Wins
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {comparison.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Honest Trade-Offs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Honest Engineering Trade-Offs
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {comparison.honestTradeoffs.map((to, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Cpu className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{to}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Related Tools Internal Linking Mesh with Descriptive Anchors */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Complementary Workflows
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Related PDF Tools
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Combine multiple client-side utilities without leaving your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relatedTools.map((rel, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {rel.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {rel.description}
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href={rel.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                >
                  <span>{rel.anchorText}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

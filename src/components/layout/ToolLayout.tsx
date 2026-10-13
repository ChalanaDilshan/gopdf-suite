"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ChevronRight, 
  Home, 
  HelpCircle, 
  Sparkles,
  Zap,
  Lock,
  WifiOff
} from "lucide-react";
import { Accordion, AccordionItemData } from "@/components/ui/Accordion";
import { SoftwareApplicationJsonLd, FaqPageJsonLd } from "@/components/seo/JsonLd";
import { ToolContentGuide, ToolContentGuideProps } from "@/components/seo/ToolContentGuide";
import { HowToStep, FaqItem } from "@/types";

export interface ToolLayoutProps {
  title: string;
  description: string;
  badgeText?: string;
  category?: string;
  toolSlug?: string;
  children: React.ReactNode; // Interactive tool workspace
  steps?: HowToStep[];
  howToSlot?: React.ReactNode; // Custom slot override for how-to guide
  faqItems?: FaqItem[];
  faqSlot?: React.ReactNode; // Custom slot override for FAQ
  contentGuide?: ToolContentGuideProps;
  features?: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
}

export function ToolLayout({
  title,
  description,
  badgeText = "100% Client-Side / Secure",
  category = "Organize PDF",
  toolSlug = "merge-pdf",
  children,
  steps = [
    {
      stepNumber: 1,
      title: "Select your PDF files",
      description: "Drag & drop or choose your PDF documents from your device.",
    },
    {
      stepNumber: 2,
      title: "Arrange & Configure",
      description: "Reorder files, configure custom options, or remove unwanted pages.",
    },
    {
      stepNumber: 3,
      title: "Process & Save",
      description: "Generate and download your transformed file instantly without server delays.",
    },
  ],
  howToSlot,
  faqItems = [],
  faqSlot,
  contentGuide,
  features,
}: ToolLayoutProps) {
  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://gopdf.tech/${toolSlug}`;

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Schema.org JSON-LD structured data */}
      <SoftwareApplicationJsonLd
        name={title}
        description={description}
        url={currentUrl}
      />
      {faqItems.length > 0 && <FaqPageJsonLd faqs={faqItems} />}

      <main className="flex-1 pb-20">
        {/* Tool Header & Hero */}
        <section className="relative overflow-hidden pt-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-white via-slate-50/30 to-transparent dark:from-slate-900/40 dark:via-slate-950 dark:to-transparent">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6">
              <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">{category}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{title}</span>
            </nav>

            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
              {title}
            </h1>

            {/* Description */}
            <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </section>

        {/* Interactive Tool Workspace Slot */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-glass dark:shadow-glass-dark">
            {children}
          </div>
        </section>

        {/* Why Client-Side Guarantee Banner */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/80 bg-gradient-to-r from-indigo-50/70 via-slate-50 to-violet-50/70 dark:from-indigo-950/20 dark:via-slate-900/40 dark:to-violet-950/20 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Strict Zero-Upload</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Your files never touch any external server. All computations happen in your device's memory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Blazing Performance</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Zero upload or download latency. Large documents process at lightning-fast browser speeds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <WifiOff className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Works Offline</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Once loaded, utilities can continue functioning even with unstable or disconnected internet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rich SEO Content Guide Slot or 3-Step Guide */}
        {contentGuide ? (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <ToolContentGuide {...contentGuide} />
          </div>
        ) : (
          <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Simple Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                How to use this tool in 3 easy steps
              </h2>
            </div>

            {howToSlot ? (
              howToSlot
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                        {step.stepNumber}
                      </span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Step {step.stepNumber}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* FAQ Section Slot */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
              <HelpCircle className="h-4 w-4" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Everything you need to know about security, browser performance, and limits.
            </p>
          </div>

          {faqSlot ? (
            faqSlot
          ) : (
            faqItems.length > 0 && (
              <Accordion
                items={faqItems.map((item) => ({
                  id: item.id,
                  question: item.question,
                  answer: item.answer,
                }))}
                defaultExpandedIds={[faqItems[0]?.id]}
              />
            )
          )}
        </section>
      </main>
    </div>
  );
}

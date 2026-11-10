"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Upload, 
  ListOrdered, 
  FileCheck, 
  ArrowRight, 
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  {
    id: "free",
    question: "Is this tool really free to use?",
    answer: "Yes, it is 100% free with no hidden subscriptions, trial limits, watermarks, or account registration required.",
  },
  {
    id: "server-upload",
    question: "Are my files uploaded to a server?",
    answer: "No. All document processing runs locally in your web browser via client-side Web Workers and WebAssembly. Your files never leave your device.",
  },
  {
    id: "limits",
    question: "What file size limits apply?",
    answer: "You can combine up to 20 files at once with individual files up to 50MB each. Processing speed depends strictly on your device's local memory and CPU.",
  },
  {
    id: "rearrange",
    question: "Can I rearrange the PDF files?",
    answer: "Yes. Simply grab the drag handle icon on any document card and move it up or down to set your preferred merge order.",
  },
  {
    id: "mobile",
    question: "Does it work on mobile devices?",
    answer: "Yes. GoPDF is fully responsive and compatible with iOS (Safari/Chrome), Android (Chrome/Firefox), tablets, and all desktop browsers.",
  },
];

export function HowItWorksAndFaq() {
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(["free"]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 pb-12">
      {/* Left Card: How It Works */}
      <div className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-neutral-900 p-6 shadow-xs flex flex-col justify-between transition-colors">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">How It Works</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
            Merge your PDF files in just a few simple steps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
            {/* Step 1 */}
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-neutral-800/60 p-4 flex flex-col justify-between relative group hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs">
                    1
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                    <Upload className="h-3.5 w-3.5" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Select PDF Files
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload or drag and drop your PDF files. You can add multiple files at once.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-neutral-800/60 p-4 flex flex-col justify-between relative group hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs">
                    2
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                    <ListOrdered className="h-3.5 w-3.5" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Arrange & Merge
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Reorder the files if needed, then click the merge button to combine them.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-neutral-800/60 p-4 flex flex-col justify-between relative group hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs">
                    3
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                    <FileCheck className="h-3.5 w-3.5" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Download Result
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your merged PDF will be generated instantly. Download and use it right away.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Card: Frequently Asked Questions */}
      <div id="faq" className="lg:col-span-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-neutral-900 p-6 shadow-xs flex flex-col transition-colors">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <Link
            href="/#faq"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
          >
            View all FAQs <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Everything you need to know about our PDF merger.
        </p>

        {/* Accordion */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 flex-1 flex flex-col justify-center">
          {FAQS.map((faq) => {
            const isOpen = openFaqIds.includes(faq.id);

            return (
              <div key={faq.id} className="py-2.5">
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-neutral-900 dark:hover:text-white transition-colors py-1 cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0",
                      isOpen && "rotate-180 text-neutral-900 dark:text-white"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "pt-1.5 pb-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
                    !isOpen && "hidden"
                  )}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  className,
}: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const isAlreadyExpanded = prev.includes(id);
      if (allowMultiple) {
        return isAlreadyExpanded ? prev.filter((item) => item !== id) : [...prev, id];
      } else {
        return isAlreadyExpanded ? [] : [id];
      }
    });
  };

  return (
    <div className={cn("divide-y divide-slate-200/80 dark:divide-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm overflow-hidden", className)}>
      {items.map((item, index) => {
        const isOpen = expandedIds.includes(item.id);
        const headingId = `faq-heading-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <div key={item.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
            <h3>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between p-5 text-left font-medium text-slate-900 dark:text-slate-100 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="text-base font-semibold leading-relaxed pr-4">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-transform duration-200",
                    isOpen && "rotate-180 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isOpen}
              className={cn(
                "px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 transition-all",
                isOpen ? "block animate-fadeIn" : "hidden"
              )}
            >
              <div className="pt-1">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ArrowRight, 
  Type, 
  Trash2, 
  RotateCw, 
  ArrowUpDown, 
  RefreshCw, 
  Copy, 
  ArrowDownToLine, 
  Columns,
  Image as ImageIcon,
  FileStack
} from "lucide-react";

export type ToolCategory = "all" | "organize" | "edit" | "optimize" | "convert";

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  actionText: string;
  href: string;
  category: "organize" | "edit" | "optimize" | "convert";
  badge?: string;
  icon: React.ReactNode;
  keywords: string[];
}

export const TOOLS_DATA: ToolItem[] = [
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF documents into a single file with ease.",
    actionText: "Merge Files",
    href: "/merge-pdf",
    category: "organize",
    badge: "Popular",
    icon: <Copy className="h-5 w-5" />,
    keywords: ["merge", "combine", "join", "unite", "append", "concat"],
  },
  {
    id: "edit-pdf",
    title: "Edit PDF Text",
    description: "Click, type, and replace existing text with matching fonts, sizes and colors.",
    actionText: "Edit PDF",
    href: "/edit-pdf",
    category: "edit",
    icon: <Type className="h-5 w-5" />,
    keywords: ["edit", "text", "type", "font", "write", "replace", "modify"],
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce file size with smart compression while maintaining quality.",
    actionText: "Compress PDF",
    href: "/compress-pdf",
    category: "optimize",
    badge: "Fast",
    icon: <ArrowDownToLine className="h-5 w-5" />,
    keywords: ["compress", "shrink", "reduce", "size", "smaller", "email", "mb"],
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Extract specific pages, split into multiple files, or create custom page ranges.",
    actionText: "Split PDF",
    href: "/split-pdf",
    category: "organize",
    icon: <Columns className="h-5 w-5" />,
    keywords: ["split", "extract", "separate", "pages", "range"],
  },
  {
    id: "rotate-pdf",
    title: "Rotate PDF",
    description: "Rotate pages or the entire document 90°, 180° or 270° instantly.",
    actionText: "Rotate PDF",
    href: "/rotate-pdf",
    category: "organize",
    icon: <RotateCw className="h-5 w-5" />,
    keywords: ["rotate", "turn", "orientation", "landscape", "portrait", "flip"],
  },
  {
    id: "delete-pdf-pages",
    title: "Delete Pages",
    description: "Remove unwanted pages or blank pages with a single click.",
    actionText: "Delete Pages",
    href: "/delete-pdf-pages",
    category: "organize",
    icon: <Trash2 className="h-5 w-5" />,
    keywords: ["delete", "remove", "blank", "unwanted", "cut", "exclude"],
  },
  {
    id: "reorder-pdf-pages",
    title: "Reorder Pages",
    description: "Drag and drop to rearrange your PDF pages in any order.",
    actionText: "Reorder Pages",
    href: "/reorder-pdf-pages",
    category: "organize",
    icon: <ArrowUpDown className="h-5 w-5" />,
    keywords: ["reorder", "rearrange", "drag", "drop", "sort", "sequence", "order"],
  },
  {
    id: "convert-pdf",
    title: "Convert PDF",
    description: "Convert PDFs to and from different formats (e.g. Word, Images) directly in your browser.",
    actionText: "Convert PDF",
    href: "/jpg-to-pdf",
    category: "convert",
    icon: <RefreshCw className="h-5 w-5" />,
    keywords: ["convert", "images", "jpg", "png", "word", "format"],
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG and JPEG images to clean PDF documents in seconds.",
    actionText: "Convert JPG",
    href: "/jpg-to-pdf",
    category: "convert",
    icon: <ImageIcon className="h-5 w-5" />,
    keywords: ["jpg", "jpeg", "image", "photo", "pictures", "convert"],
  },
  {
    id: "png-to-pdf",
    title: "PNG to PDF",
    description: "Convert PNG screenshots and graphics into PDF with crisp transparency.",
    actionText: "Convert PNG",
    href: "/png-to-pdf",
    category: "convert",
    icon: <ImageIcon className="h-5 w-5" />,
    keywords: ["png", "screenshot", "graphic", "image", "convert"],
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Extract PDF pages as high-resolution JPG images individually or as a ZIP.",
    actionText: "Extract JPG",
    href: "/pdf-to-jpg",
    category: "convert",
    icon: <FileStack className="h-5 w-5" />,
    keywords: ["pdf to jpg", "extract", "images", "photo", "zip"],
  },
  {
    id: "pdf-to-png",
    title: "PDF to PNG",
    description: "Extract pages into lossless, pixel-perfect PNG images.",
    actionText: "Extract PNG",
    href: "/pdf-to-png",
    category: "convert",
    icon: <FileStack className="h-5 w-5" />,
    keywords: ["pdf to png", "lossless", "high res", "extract", "transparent"],
  },
];

export function ToolsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  const categories: Array<{ id: ToolCategory; label: string }> = [
    { id: "all", label: "All tools" },
    { id: "organize", label: "Organize" },
    { id: "edit", label: "Edit" },
    { id: "optimize", label: "Optimize" },
    { id: "convert", label: "Convert" },
  ];

  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      // If we are on "all" and not searching, show the 8 core tools from the mockup
      if (!searchQuery && selectedCategory === "all") {
        return [
          "merge-pdf",
          "edit-pdf",
          "compress-pdf",
          "split-pdf",
          "rotate-pdf",
          "delete-pdf-pages",
          "reorder-pdf-pages",
          "convert-pdf",
        ].includes(tool.id);
      }

      // Filter by category
      if (selectedCategory !== "all" && tool.category !== selectedCategory) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = tool.title.toLowerCase().includes(query);
        const matchesDesc = tool.description.toLowerCase().includes(query);
        const matchesKeywords = tool.keywords.some((k) => k.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesKeywords;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section className="py-6 sm:py-10" id="tools">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Column Tools Grid matching the design */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700/80 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div>
                {/* Top: Icon + Optional Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100/70 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>

                  {tool.badge && (
                    <span className="rounded-full bg-blue-100/80 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 border border-blue-200/60 dark:border-blue-800/60">
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              {/* Action Link at Bottom */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>{tool.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No tools found matching &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try searching for merge, compress, edit, rotate, or convert.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}

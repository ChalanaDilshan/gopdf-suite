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
  Copy, 
  ArrowDownToLine, 
  Columns,
  Image as ImageIcon,
  FileStack,
  Sparkles
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
    description: "Combine multiple PDF documents into a single file with visual drag-and-drop reordering.",
    actionText: "Merge Files",
    href: "/merge-pdf",
    category: "organize",
    badge: "Popular",
    icon: <Copy className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["merge", "combine", "join", "unite", "append", "concat"],
  },
  {
    id: "edit-pdf",
    title: "Edit PDF Text",
    description: "Click, type, and replace existing text with matching fonts, sizes, and colors in-place.",
    actionText: "Edit PDF Text",
    href: "/edit-pdf",
    category: "edit",
    badge: "New",
    icon: <Type className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["edit", "text", "type", "font", "write", "replace", "modify"],
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce file size up to 70% with smart downscaling while preserving visual crispness.",
    actionText: "Compress Size",
    href: "/compress-pdf",
    category: "optimize",
    badge: "Fast",
    icon: <ArrowDownToLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["compress", "shrink", "reduce", "size", "smaller", "email", "mb"],
  },
  {
    id: "split-pdf",
    title: "Split & Extract",
    description: "Extract specific page ranges, extract single pages, or separate documents cleanly.",
    actionText: "Split Pages",
    href: "/split-pdf",
    category: "organize",
    icon: <Columns className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["split", "extract", "separate", "pages", "range"],
  },
  {
    id: "rotate-pdf",
    title: "Rotate PDF",
    description: "Permanently rotate individual pages or entire documents 90°, 180°, or 270° clockwise.",
    actionText: "Rotate Pages",
    href: "/rotate-pdf",
    category: "organize",
    icon: <RotateCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["rotate", "turn", "orientation", "landscape", "portrait", "flip"],
  },
  {
    id: "delete-pdf-pages",
    title: "Delete Pages",
    description: "Remove blank, sensitive, or redundant pages with visual thumbnail previews.",
    actionText: "Delete Pages",
    href: "/delete-pdf-pages",
    category: "organize",
    icon: <Trash2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["delete", "remove", "blank", "unwanted", "cut", "exclude"],
  },
  {
    id: "reorder-pdf-pages",
    title: "Reorder Pages",
    description: "Drag and drop thumbnails to rearrange your document into the exact page sequence.",
    actionText: "Reorder Pages",
    href: "/reorder-pdf-pages",
    category: "organize",
    icon: <ArrowUpDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["reorder", "rearrange", "drag", "drop", "sort", "sequence", "order"],
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert digital photographs and JPEG images into clean, standardized PDF files.",
    actionText: "Convert JPG",
    href: "/jpg-to-pdf",
    category: "convert",
    icon: <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["jpg", "jpeg", "image", "photo", "pictures", "convert"],
  },
  {
    id: "png-to-pdf",
    title: "PNG to PDF",
    description: "Convert PNG screenshots and graphics into high-resolution PDFs with lossless clarity.",
    actionText: "Convert PNG",
    href: "/png-to-pdf",
    category: "convert",
    icon: <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["png", "screenshot", "graphic", "image", "convert"],
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Extract PDF pages into high-definition JPG images individually or as a packed ZIP.",
    actionText: "Extract JPG",
    href: "/pdf-to-jpg",
    category: "convert",
    icon: <FileStack className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["pdf to jpg", "extract", "images", "photo", "zip"],
  },
  {
    id: "pdf-to-png",
    title: "PDF to PNG",
    description: "Render pages into pixel-perfect PNG images with pristine sharpness.",
    actionText: "Extract PNG",
    href: "/pdf-to-png",
    category: "convert",
    icon: <FileStack className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    keywords: ["pdf to png", "lossless", "high res", "extract", "transparent"],
  },
];

export function ToolsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");

  const categories: Array<{ id: ToolCategory; label: string }> = [
    { id: "all", label: "All Tools (11)" },
    { id: "organize", label: "Organize" },
    { id: "edit", label: "Edit Text" },
    { id: "optimize", label: "Optimize" },
    { id: "convert", label: "Convert & Extract" },
  ];

  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
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
    <section className="py-8 sm:py-14" id="tools">
      {/* Header with Title and Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Complete Toolkit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Specialized PDF Utilities
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Single-purpose micro-tools running directly on your CPU. Choose a capability below or drop a file anywhere.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. merge, compress, edit)..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-10 text-base sm:text-sm min-h-[44px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills - Horizontally scrollable on mobile */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 mb-6 sm:mb-8 pb-2 overflow-x-auto scrollbar-none sm:flex-wrap">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-3.5 sm:px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 min-h-[36px] sm:min-h-0 ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 hover:border-blue-600 dark:hover:border-blue-500 transition-colors"
            >
              <div>
                {/* Top: Icon + Optional Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400">
                    {tool.icon}
                  </div>

                  {tool.badge && (
                    <span className="rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 border border-blue-200 dark:border-blue-800">
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              {/* Action Link at Bottom */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span className="group-hover:underline">{tool.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
            No tools found matching &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for merge, compress, edit, rotate, split, or convert.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}

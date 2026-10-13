import React from "react";
import Link from "next/link";
import { 
  FolderLock, 
  FileStack, 
  Scissors, 
  Minimize2, 
  RotateCw, 
  Trash2, 
  ArrowUpDown,
  Type 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

const TOOLS: ToolItem[] = [
  {
    id: "merge",
    name: "Merge PDF",
    desc: "Combine multiple PDFs",
    href: "/merge-pdf",
    icon: FileStack,
    active: true,
  },
  {
    id: "edit",
    name: "Edit PDF",
    desc: "Click, type & replace text",
    href: "/edit-pdf",
    icon: Type,
    active: false,
  },
  {
    id: "split",
    name: "Split PDF",
    desc: "Extract pages",
    href: "/split-pdf",
    icon: Scissors,
    active: false,
  },
  {
    id: "compress",
    name: "Compress PDF",
    desc: "Reduce file size",
    href: "/compress-pdf",
    icon: Minimize2,
    active: false,
  },
  {
    id: "rotate",
    name: "Rotate PDF",
    desc: "Rotate pages",
    href: "/rotate-pdf",
    icon: RotateCw,
    active: false,
  },
  {
    id: "delete",
    name: "Delete Pages",
    desc: "Remove unwanted pages",
    href: "/delete-pdf-pages",
    icon: Trash2,
    active: false,
  },
  {
    id: "reorder",
    name: "Reorder Pages",
    desc: "Drag and drop to arrange",
    href: "/reorder-pdf-pages",
    icon: ArrowUpDown,
    active: false,
  },
];

export function PdfToolsSidebar({
  currentTool = "merge",
  className,
}: {
  currentTool?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-3.5 shadow-xs flex flex-col transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2 mb-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
        <FolderLock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <span>PDF Tools</span>
      </div>

      <nav className="flex flex-col gap-1">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.id === currentTool;

          return (
            <Link
              key={tool.id}
              href={tool.href}
              className={cn(
                "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all text-left",
                isActive
                  ? "bg-blue-50/90 dark:bg-blue-950/60 border-l-[3.5px] border-blue-600 dark:border-blue-500 text-blue-950 dark:text-blue-300 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-l-[3.5px] border-transparent"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors mt-0.5",
                  isActive
                    ? "bg-blue-100/80 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    isActive
                      ? "text-blue-950 dark:text-blue-200"
                      : "text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                  )}
                >
                  {tool.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {tool.desc}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Github, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown 
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  const tools = [
    { name: "Merge PDF", href: "/merge-pdf", desc: "Combine multiple PDFs in order" },
    { name: "Split PDF", href: "/split-pdf", desc: "Extract or separate PDF pages" },
    { name: "Compress PDF", href: "#", desc: "Reduce file size without quality loss" },
    { name: "Rotate PDF", href: "/rotate-pdf", desc: "Rotate pages 90, 180, or 270 degrees" },
    { name: "Delete Pages", href: "/delete-pdf-pages", desc: "Remove unwanted pages from documents" },
    { name: "Reorder Pages", href: "#", desc: "Drag and drop to arrange pages" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md transition-colors duration-150">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Go<span className="text-blue-600 dark:text-blue-400">PDF</span>
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                v1.0
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Tools
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-1 animate-fadeIn z-50">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl shadow-slate-950/10">
                    {tools.map((t) => (
                      <Link
                        key={t.name}
                        href={t.href}
                        className="block rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {t.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="#features"
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Features
            </a>

            <Link
              href="/privacy-first-pdf-tools"
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Security
            </Link>

            <Link
              href="/privacy"
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Privacy Policy
            </Link>

            <a
              href="#faq"
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* 100% Private Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-900/60 text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <div className="flex flex-col text-left leading-tight">
              <span className="font-semibold text-emerald-900 dark:text-emerald-300 text-[11px]">
                100% Private
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                No server uploads
              </span>
            </div>
          </div>

          {/* GitHub Icon Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Github className="h-4 w-4" />
          </a>

          {/* Interactive Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-1 animate-fadeIn max-h-[80vh] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            PDF Tools
          </div>
          {tools.map((t) => (
            <Link
              key={t.name}
              href={t.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[48px]"
            >
              {t.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[48px]"
            >
              Features
            </a>
            <Link
              href="/privacy-first-pdf-tools"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[48px]"
            >
              Security Architecture
            </Link>
            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[48px]"
            >
              Privacy Policy
            </Link>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[48px]"
            >
              FAQ
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

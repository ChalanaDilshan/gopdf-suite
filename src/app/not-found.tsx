import React from "react";
import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-[#fafafa] dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100">
      <div className="max-w-md mx-auto space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
          <FileQuestion className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been moved, or the URL might be mistyped.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-white text-xs font-bold px-5 py-3 shadow-xs transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-bold px-5 py-3 transition-colors"
          >
            <span>Explore All Tools</span>
          </Link>
        </div>

        {/* Quick links */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Popular PDF Utilities:
          </span>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link
              href="/merge-pdf"
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-400 text-neutral-700 dark:text-neutral-200 transition-colors"
            >
              Merge PDF
            </Link>
            <Link
              href="/split-pdf"
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-400 text-neutral-700 dark:text-neutral-200 transition-colors"
            >
              Split PDF
            </Link>
            <Link
              href="/compress-pdf"
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-400 text-neutral-700 dark:text-neutral-200 transition-colors"
            >
              Compress PDF
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

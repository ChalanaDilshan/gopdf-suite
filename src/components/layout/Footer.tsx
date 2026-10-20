import React from "react";
import Link from "next/link";
import { FileText, ShieldCheck, Github, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f19]/90 backdrop-blur-sm transition-colors mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Go<span className="text-blue-600 dark:text-blue-400">PDF</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              High-performance, zero-upload PDF utilities. Every byte is processed strictly in your local browser sandbox for total confidentiality.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>No Cloud Uploads Ever</span>
            </div>
            <div className="pt-2">
              <a
                href="https://www.saashub.com/gopdf-tools?utm_source=badge&utm_campaign=badge&utm_content=gopdf-tools&badge_variant=color&badge_kind=approved"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
                title="GoPDF approved on SaaSHub"
              >
                <img
                  src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1"
                  alt="GoPDF.tech badge"
                  style={{ maxWidth: "140px" }}
                  className="rounded"
                />
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              PDF Tools
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/merge-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/edit-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Edit PDF Text
                </Link>
              </li>
              <li>
                <Link href="/split-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/rotate-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Rotate PDF
                </Link>
              </li>
              <li>
                <Link href="/delete-pdf-pages" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Delete PDF Pages
                </Link>
              </li>
              <li>
                <Link href="/reorder-pdf-pages" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Reorder PDF Pages
                </Link>
              </li>
              <li>
                <Link href="/jpg-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  JPG to PDF
                </Link>
              </li>
              <li>
                <Link href="/png-to-pdf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  PNG to PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-jpg" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  PDF to JPG
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-png" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  PDF to PNG
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Security & Trust
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features &amp; Capabilities
                </Link>
              </li>
              <li>
                <Link href="/privacy-first-pdf-tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Client-Side Architecture
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/ChalanaDilshan/gopdf-suite" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  GitHub Source <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.saashub.com/gopdf-tools?utm_source=badge&utm_campaign=badge&utm_content=gopdf-tools&badge_variant=color&badge_kind=approved" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Verified on SaaSHub <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Spec */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Architecture
            </h4>
            <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Built on Next.js 14 App Router, WebAssembly, and Web Worker threads. Zero tracking cookies, zero remote file transmission.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://github.com/ChalanaDilshan/gopdf-suite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <Github className="h-3.5 w-3.5" />
                Star on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom separator */}
        <div className="mt-12 border-t border-slate-200/80 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} GoPDF. All rights reserved. 100% Client-side execution guaranteed.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for privacy & speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

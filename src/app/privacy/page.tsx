import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, ServerOff, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - 100% Client-Side Guarantee | GoPDF",
  description:
    "GoPDF Privacy Policy: We do not collect, store, transmit, or process your files on any remote server. Read our complete zero-data privacy commitment.",
  alternates: {
    canonical: "https://gopdf.tech/privacy/",
  },
  openGraph: {
    title: "Privacy Policy - 100% Client-Side Guarantee | GoPDF",
    description:
      "GoPDF Privacy Policy: 100% client-side document processing with zero server uploads and zero tracking.",
    url: "https://gopdf.tech/privacy/",
    siteName: "GoPDF",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 13, 2026";

  return (
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-4">
            <ShieldCheck className="h-4 w-4" />
            <span>Zero-Transmission Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last Updated: {lastUpdated} · Effective Immediately
          </p>
        </div>

        {/* Key Highlights Card */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 space-y-3">
          <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>The GoPDF Zero-Data Commitment in Brief</span>
          </h2>
          <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc list-inside">
            <li><strong>Zero Document Uploads:</strong> Your PDF documents never leave your computer or smartphone.</li>
            <li><strong>Zero Server Storage:</strong> We do not operate storage buckets, cloud databases, or temporary caches for your documents.</li>
            <li><strong>Zero Tracking Cookies:</strong> We do not deploy invasive marketing trackers, advertising cookies, or fingerprinting scripts.</li>
            <li><strong>100% In-Memory Execution:</strong> PDF tasks are handled in your device’s volatile RAM and destroyed when you close the tab.</li>
          </ul>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ServerOff className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>1. Information We Do NOT Collect</span>
            </h2>
            <p>
              Unlike traditional cloud software, GoPDF is architected entirely around client-side execution using modern WebAssembly and HTML5 web workers. Consequently:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
              <li>We do not collect or view the contents, text, images, or metadata of any PDF document you process.</li>
              <li>We do not record file names, file sizes, or page counts on any remote server.</li>
              <li>We do not require account registration, passwords, email addresses, or payment cards.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>2. How Document Processing Works (Technical Sandbox)</span>
            </h2>
            <p>
              When you drag and drop a PDF into GoPDF or click &quot;Choose Files&quot;, the file is loaded directly into your web browser&apos;s isolated sandbox environment via the browser&apos;s standard <code>FileReader</code> API. All operations—including merging pages, rearranging sheets, splitting ranges, and rendering visual previews—are computed locally by your CPU.
            </p>
            <p>
              Once processing completes, a localized <code>blob:</code> URL is generated inside your browser session to download your resulting file. As soon as you refresh or close the tab, the memory is instantly freed by your operating system.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>3. Cookies and Local Storage</span>
            </h2>
            <p>
              GoPDF does not use tracking cookies. The only client storage mechanism we use is the browser&apos;s standard <code>localStorage</code> API for a single operational preference:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
              <li><code>theme</code>: Remembers whether you selected Light Mode or Dark Mode.</li>
            </ul>
            <p>
              This value contains no personally identifiable information (PII) and never leaves your browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Regulatory and Industry Compliance
            </h2>
            <p>
              Because GoPDF never accesses, handles, transfers, or stores user documents, it satisfies the strict data privacy requirements of major worldwide frameworks:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
              <li><strong>GDPR (General Data Protection Regulation):</strong> No personal data processing takes place outside the user&apos;s jurisdiction.</li>
              <li><strong>HIPAA (Health Insurance Portability and Accountability Act):</strong> Electronic Protected Health Information (ePHI) is never transmitted to or stored on third-party servers.</li>
              <li><strong>CCPA (California Consumer Privacy Act):</strong> We do not sell, share, or monetize any personal information.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              5. Open Architecture & Verification
            </h2>
            <p>
              You can verify GoPDF&apos;s zero-upload architecture at any time using your web browser&apos;s built-in Developer Tools (F12):
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-300">
              <li>Open Developer Tools and switch to the <strong>Network</strong> tab.</li>
              <li>Drop multiple PDF documents into the merge or split tool.</li>
              <li>Process the files and observe the Network log: no file payload or document bytes are transmitted to any external server.</li>
            </ol>
          </section>

          <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Contact Information
            </h2>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, feel free to reach out via our GitHub repository or contact:
            </p>
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              privacy@gopdf.tech
            </p>
            <div className="pt-2">
              <Link
                href="/privacy-first-pdf-tools"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Learn more about our Client-Side Security Architecture →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

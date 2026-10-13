import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service – Free Client-Side Utilities",
  description:
    "Terms of Service for GoPDF: Free client-side document utilities, user responsibilities, and guidelines.",
  alternates: {
    canonical: "https://gopdf.tech/terms/",
  },
  openGraph: {
    title: "Terms of Service – Free Client-Side Utilities | GoPDF",
    description: "Terms of Service and usage guidelines for GoPDF client-side utilities.",
    url: "https://gopdf.tech/terms/",
    siteName: "GoPDF",
    type: "website",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 13, 2026";

  return (
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs font-bold text-blue-700 dark:text-blue-300 mb-4">
            <FileText className="h-4 w-4" />
            <span>Usage Guidelines & Disclaimers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Last Updated: {lastUpdated} · Effective Immediately
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using GoPDF (available at <code>https://gopdf.tech</code>), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the service immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Description of Service
            </h2>
            <p>
              GoPDF provides free, client-side web utility tools to merge, split, and manipulate PDF documents directly within the user&apos;s web browser. All file processing occurs locally on the user&apos;s machine without transmitting file contents to any remote server.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. User Responsibilities & Lawful Use
            </h2>
            <p>
              You agree that you will only use GoPDF for lawful purposes. You retain full responsibility for the documents you choose to process. You agree not to use GoPDF in connection with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
              <li>Documents that infringe upon any third-party copyright, patent, or intellectual property rights.</li>
              <li>Unlawful, fraudulent, or harmful materials.</li>
              <li>Any attempt to reverse engineer or disrupt the operational integrity of the site infrastructure.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Intellectual Property & File Ownership
            </h2>
            <p>
              <strong>You retain 100% ownership of your files.</strong> Because GoPDF operates entirely client-side, we never possess, claim, license, or retain any rights to your documents or data.
            </p>
            <p>
              The GoPDF website design, trademarks, software code, and logo are the intellectual property of the GoPDF project and protected under applicable copyright laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <span>5. Disclaimer of Warranties</span>
            </h2>
            <p>
              GoPDF is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. While we strive to ensure that our client-side tools function accurately across all modern browsers, we do not warrant that the service will be error-free, uninterrupted, or that document outputs will satisfy all specific formatting requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Limitation of Liability
            </h2>
            <p>
              In no event shall GoPDF or its contributors be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service, including data corruption or loss of business.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              7. Changes and Inquiries
            </h2>
            <p>
              We reserve the right to revise these Terms of Service at any time. Continued use of GoPDF following any revisions indicates acceptance of the updated terms.
            </p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              For any questions regarding these terms, visit our{" "}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </Link>{" "}
              or contact us via our official repository.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

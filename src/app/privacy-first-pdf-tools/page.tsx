import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  ServerOff, 
  FileCheck2, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Building2, 
  Stethoscope, 
  Scale, 
  Briefcase,
  AlertTriangle
} from "lucide-react";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Why Client-Side PDF Processing is the Safest Choice",
  description:
    "Discover why zero-upload client-side PDF processing is the safest solution for sensitive legal & financial documents. 100% private in-browser execution.",
  alternates: {
    canonical: "https://gopdf.tech/privacy-first-pdf-tools/",
  },
  openGraph: {
    title: "Why Client-Side PDF Processing is the Safest Choice | GoPDF",
    description:
      "Explore why zero-upload in-browser PDF utilities guarantee 100% data security for sensitive and confidential documents.",
    url: "https://gopdf.tech/privacy-first-pdf-tools/",
    siteName: "GoPDF",
    type: "article",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF Security Architecture - Zero-Cloud Client-Side PDF Processing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Client-Side PDF Processing is the Safest Choice | GoPDF",
    description: "Zero server uploads. 100% browser sandbox security for sensitive documents.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const SECURITY_FAQS = [
  {
    question: "How does client-side PDF processing work without uploading files?",
    answer:
      "GoPDF runs modern WebAssembly and JavaScript PDF engines directly inside your web browser. When you select a document, it is loaded into your local computer's RAM. The processing occurs on your CPU, and the output is generated locally without a single byte ever being transmitted across the internet.",
  },
  {
    question: "Is GoPDF compliant with HIPAA, GDPR, and confidentiality NDAs?",
    answer:
      "Yes. Because GoPDF operates under a Zero-Transmission model where no electronic protected health information (ePHI) or personal data leaves your endpoint, it inherently eliminates third-party data processing risks, data retention vulnerabilities, and vendor data breaches.",
  },
  {
    question: "Can I use GoPDF completely offline without an active internet connection?",
    answer:
      "Yes. Once you load GoPDF in your web browser, all required code is cached locally. You can disconnect Wi-Fi or unplug your network cable, and you can still merge and split PDF files without interruption.",
  },
  {
    question: "What is the difference between GoPDF and cloud PDF services like iLovePDF or Smallpdf?",
    answer:
      "Traditional online PDF tools upload your sensitive documents to remote servers in foreign data centers, process them in their cloud infrastructure, store them temporarily on disk, and then provide a download link. GoPDF never receives, views, or stores your documents on any server.",
  },
];

export default function PrivacyFirstPage() {
  return (
    <div className="bg-[#f4f7fb] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "Privacy First PDF Tools", item: "https://gopdf.tech/privacy-first-pdf-tools/" },
        ]}
      />
      <FaqJsonLd faqs={SECURITY_FAQS} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-900/60 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span>Zero-Cloud Architecture · 100% In-Browser Execution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Why Client-Side PDF Processing is the{" "}
            <span className="text-blue-600 dark:text-blue-400">Safest Choice</span> for Sensitive Documents
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Every day, millions of confidential contracts, tax returns, and medical records are inadvertently exposed to remote cloud servers. Learn how GoPDF’s client-side architecture keeps your private data entirely in your local memory.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/merge-pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 shadow-md transition-colors"
              >
                <span>Merge PDFs Privately</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/split-pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 font-bold px-6 py-3.5 transition-colors"
              >
                <span>Split PDFs Privately</span>
              </Link>
            </div>
            <div className="mt-2 flex items-center justify-center">
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
                  className="h-8 w-auto rounded shadow-2xs"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Cloud Risk vs Client-Side Sandbox */}
      <section className="py-16 sm:py-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            The Hidden Risks of Conventional Online PDF Converters
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Most popular online PDF services appear harmless, but behind the scenes, your private documents undergo significant risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-red-200/80 dark:border-red-950/60 bg-red-50/30 dark:bg-red-950/20 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
              <ServerOff className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Third-Party Cloud Uploads</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When you upload a document to typical cloud PDF sites, your unencrypted PDF travels across the public internet to unknown servers located across various jurisdictions.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200/80 dark:border-amber-950/60 bg-amber-50/30 dark:bg-amber-950/20 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Temporary Server Disk Storage</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Most platforms store your files on their hard drives for 1 to 24 hours before automatic deletion, creating a wide attack window for data breaches and unauthorized access.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200/80 dark:border-blue-950/60 bg-blue-50/30 dark:bg-blue-950/20 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">The GoPDF Zero-Cloud Solution</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              GoPDF eliminates the server entirely. The PDF manipulation algorithms run inside your local browser tab. Zero network bytes are transmitted.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 border-y border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0d1322]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Cloud PDF Converters vs. GoPDF Client-Side Engine
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              A direct comparison of data security, privacy compliance, and speed.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-4 sm:px-6 font-bold text-slate-700 dark:text-slate-300">Feature</th>
                  <th className="py-4 px-4 sm:px-6 font-bold text-red-600 dark:text-red-400">Cloud PDF Tools (iLovePDF, Smallpdf)</th>
                  <th className="py-4 px-4 sm:px-6 font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40">GoPDF (Client-Side)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold">Where documents are processed</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">Remote Cloud Server</td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">Your Local Device (Browser)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold">Network transmission</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400 flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4 shrink-0" /> Full file uploaded over internet
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 shrink-0" /> 0 bytes transmitted
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold">Server-side retention time</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">Stored on disk for 1–2 hours</td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 shrink-0" /> 0 seconds (never stored)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold">Offline capability</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400 flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4 shrink-0" /> No (requires active internet)
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 shrink-0" /> Works completely offline
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold">HIPAA / NDA Compliance</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">Requires signed BAA agreement</td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 shrink-0" /> Fully Compliant by design
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 sm:px-6 font-semibold">Processing Speed</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">Slowed by upload and download queues</td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 shrink-0" /> Instant local CPU execution
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Industries that Depend on Client-Side Processing */}
      <section className="py-16 sm:py-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Who Needs Zero-Cloud PDF Processing?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Critical industries bound by strict confidentiality and regulatory compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Legal Practitioners & Law Firms</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Attorneys handling sensitive court evidence, client NDAs, and privileged mergers cannot risk third-party data breaches. GoPDF ensures attorney-client privilege remains unbroken.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Healthcare Providers (HIPAA Compliance)</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Patient health records and medical billing contain Protected Health Information (PHI). Because GoPDF never transmits records across the wire, HIPAA compliance requirements are naturally preserved.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Accountants & Financial Advisors</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Tax returns, banking statements, and corporate balance sheets contain critical identity and financial data. Combining client tax documents in local browser memory avoids cloud leaks.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#131b2e] p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Corporate Enterprise & IP R&D</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Proprietary software architecture blueprints, engineering patents, and executive memos are protected from external web scrapers or cloud compromise.
            </p>
          </div>
        </div>
      </section>

      {/* Security FAQ Section */}
      <section className="py-16 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0d1322]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Security & Privacy Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Answers to technical compliance, sandboxing, and data handling inquiries.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {SECURITY_FAQS.map((faq, idx) => (
              <div key={idx} className="py-5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {faq.question}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Experience 100% Private PDF Processing Today
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            No signup. No subscriptions. No cloud uploads. Completely free.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/merge-pdf"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 text-sm shadow-md transition-colors"
            >
              Launch Merge PDF
            </Link>
            <Link
              href="/split-pdf"
              className="rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-6 py-3 text-sm transition-colors"
            >
              Launch Split PDF
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

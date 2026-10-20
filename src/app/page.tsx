import type { Metadata } from "next";
import { WebApplicationJsonLd, FaqJsonLd, HowToJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SmartDropzone } from "@/components/home/SmartDropzone";
import { ToolsSection } from "@/components/home/ToolsSection";
import { PrivacyComparison } from "@/components/home/PrivacyComparison";
import { Accordion } from "@/components/ui/Accordion";
import { ShieldCheck, HelpCircle, Sparkles, FileText, Lock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "GoPDF – Free & Private Client-Side PDF Tools",
  },
  description:
    "100% private in-browser PDF utilities. Merge, split, compress, rotate, edit and organize PDF files locally with zero server uploads.",
  alternates: {
    canonical: "https://gopdf.tech/",
  },
  openGraph: {
    title: "GoPDF – Free & Private Client-Side PDF Tools",
    description:
      "Process, merge, split, compress, and edit PDF documents locally in your browser. 100% free with zero cloud uploads.",
    url: "https://gopdf.tech/",
    siteName: "GoPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoPDF – Free & Private Client-Side PDF Tools",
    description:
      "Process PDF files right in your browser with zero server uploads and zero wait time.",
  },
};

const HOME_FAQS = [
  {
    id: "free-and-limits",
    question: "Is GoPDF completely free to use?",
    answer:
      "Yes, GoPDF is 100% free with no hidden subscriptions, paywalls, daily quotas, or watermarks. All processing runs using your computer's local resources.",
  },
  {
    id: "privacy-guarantee",
    question: "Are my documents uploaded to any remote server or cloud?",
    answer:
      "Never. GoPDF uses WebAssembly, HTML5 Canvas, and Web Workers inside your web browser. Your confidential files, legal agreements, and personal data never leave your local device memory.",
  },
  {
    id: "offline-capabilities",
    question: "Can I use GoPDF while offline or with unstable internet?",
    answer:
      "Yes. Once the web application is loaded in your browser cache, all PDF tools can process, merge, rotate, split, and delete pages completely offline without an active internet connection.",
  },
  {
    id: "file-limits",
    question: "What is the maximum file size supported?",
    answer:
      "Because processing occurs locally in memory, GoPDF comfortably handles PDF files up to 100MB and documents with hundreds of pages on modern desktop and mobile browsers.",
  },
  {
    id: "mobile-compatibility",
    question: "Does GoPDF work on iOS and Android smartphones?",
    answer:
      "Yes, GoPDF is fully mobile-responsive and optimized for touch interactions on Safari, Chrome, Edge, and Firefox across tablets and smartphones.",
  },
];

const HOME_STEPS = [
  {
    name: "Drop or select your PDF",
    text: "Drag and drop any PDF file into the universal dropzone or choose from your device.",
  },
  {
    name: "Pick your tool",
    text: "Choose whether to merge, rotate, split, or delete pages with live interactive previews.",
  },
  {
    name: "Save and download",
    text: "Download your transformed document instantly with zero server latency.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-150">
      {/* Schema.org Structured Data */}
      <WebApplicationJsonLd />
      <BreadcrumbJsonLd items={[{ name: "Home", item: "https://gopdf.tech/" }]} />
      <FaqJsonLd faqs={HOME_FAQS} />
      <HowToJsonLd
        name="How to Process PDF Documents Securely"
        description="Learn how to merge, split, rotate, and delete PDF pages locally in your web browser with zero server uploads."
        steps={HOME_STEPS}
      />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 sm:pt-14 pb-6 sm:pb-10">
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Top Simple. Fast. Private. Tag */}
            <div className="text-xs font-bold tracking-[0.25em] text-blue-600 dark:text-blue-400 uppercase mb-3">
              SIMPLE. FAST. PRIVATE.
            </div>

            {/* Main Title matching mockup */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              PDF tools, <span className="text-blue-600 dark:text-blue-500">made simple.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to manage PDFs — right in your browser.
            </p>

            {/* Universal Smart Dropzone Hero Slot */}
            <div className="mt-8 max-w-4xl mx-auto">
              <SmartDropzone />
            </div>

            {/* Trust & Verification Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="inline-flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Client-Side Privacy</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="inline-flex items-center gap-1.5 font-medium">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Zero Cloud Latency</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <a
                href="https://www.saashub.com/gopdf-tools?utm_source=badge&utm_campaign=badge&utm_content=gopdf-tools&badge_variant=color&badge_kind=approved"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center transition-transform hover:scale-105"
                title="GoPDF approved on SaaSHub"
              >
                <img
                  src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1"
                  alt="GoPDF.tech badge"
                  style={{ maxWidth: "130px" }}
                  className="h-[28px] w-auto rounded shadow-2xs"
                />
              </a>
            </div>
          </div>
        </section>

        {/* 4-Column Tools Section with Live Search & Category Filter Pills */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ToolsSection />
        </div>

        {/* Privacy & Performance Comparison Section */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <PrivacyComparison />
        </div>

        {/* Structured FAQ Section */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16" id="faq">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
              <HelpCircle className="h-4 w-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Clear answers regarding security, browser execution, and supported limits.
            </p>
          </div>

          <Accordion
            items={HOME_FAQS.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
            }))}
            defaultExpandedIds={[HOME_FAQS[0].id]}
          />
        </section>
      </main>
    </div>
  );
}

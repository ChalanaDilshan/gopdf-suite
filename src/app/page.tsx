import type { Metadata } from "next";
import Link from "next/link";
import { WebApplicationJsonLd, FaqJsonLd, HowToJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SmartDropzone } from "@/components/home/SmartDropzone";
import { ToolsSection } from "@/components/home/ToolsSection";
import { PrivacyComparison } from "@/components/home/PrivacyComparison";
import { Accordion } from "@/components/ui/Accordion";
import { 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Infinity as InfinityIcon
} from "lucide-react";

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

const ARCHITECTURE_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Total Memory Isolation",
    badge: "100% Private",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    description:
      "Your documents are processed strictly in your local device RAM. Zero bytes are ever transmitted over the network or saved to remote databases.",
  },
  {
    icon: Zap,
    title: "Instant WebAssembly Speed",
    badge: "0ms Network Lag",
    badgeColor: "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    description:
      "Bypasses the 30-60 second cloud upload queue. Manipulation begins the millisecond you choose your file, powered by multi-core CPU threads.",
  },
  {
    icon: InfinityIcon,
    title: "Unlimited Free Execution",
    badge: "Zero Paywalls",
    badgeColor: "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    description:
      "No daily caps, no 3-file restrictions, no watermarks, and no mandatory account signups. A true desktop-grade utility inside your web browser.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-150">
      {/* Schema.org Structured Data */}
      <WebApplicationJsonLd />
      <BreadcrumbJsonLd items={[{ name: "Home", item: "https://gopdf.tech/" }]} />
      <FaqJsonLd faqs={HOME_FAQS} />
      <HowToJsonLd
        name="How to Process PDF Documents Securely"
        description="Learn how to merge, split, rotate, and delete PDF pages locally in your web browser with zero server uploads."
        steps={HOME_STEPS}
      />

      <main className="flex-1 pb-24 relative">
        {/* Hero Section */}
        <section className="relative pt-10 sm:pt-16 pb-8 sm:pb-12">
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Top Category Badge Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>100% In-Browser Engine · Zero Cloud Uploads</span>
            </div>

            {/* Main Title - Solid Crisp Colors, 0 Gradients */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-4xl mx-auto">
              The Private PDF Studio{" "}
              <span className="text-blue-600 dark:text-blue-500">
                Inside Your Browser.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Merge, edit, compress, and convert confidential documents locally in your device memory. Lightning fast, zero server uploads, and completely free.
            </p>

            {/* Universal Smart Dropzone Hero Slot */}
            <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
              <SmartDropzone />
            </div>

            {/* Trust & Verification Badges Strip */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-slate-600 dark:text-slate-400">
              <div className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Client-Side Privacy</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <div className="inline-flex items-center gap-1.5 font-semibold">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                  style={{ maxWidth: "135px" }}
                  className="h-[30px] w-auto rounded shadow-2xs"
                />
              </a>
            </div>
          </div>
        </section>

        {/* Architectural Superpowers Bento Section */}
        <section className="py-8 sm:py-12 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ARCHITECTURE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs hover:border-blue-600 dark:hover:border-blue-500 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 shadow-2xs">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-bold border ${pillar.badgeColor}`}>
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
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

        {/* Bottom CTA Callout Card - Solid Clean Color, 0 Gradients */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
          <div className="rounded-2xl border border-blue-600 bg-blue-600 p-8 sm:p-12 text-white text-center shadow-md">
            <div className="max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Zero Setup · Instant Access
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Experience Private PDF Processing Today
              </h2>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                No signups, no credit cards, no tracking cookies. Choose any tool and begin working in seconds.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/merge-pdf"
                  className="rounded-xl bg-white hover:bg-slate-100 text-blue-600 font-bold px-6 py-3 text-sm shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <span>Launch Merge Studio</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/edit-pdf"
                  className="rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 text-sm transition-colors"
                >
                  Edit PDF Text
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

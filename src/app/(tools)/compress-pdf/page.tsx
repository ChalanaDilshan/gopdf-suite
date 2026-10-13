"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  RotateCcw, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Layers, 
  ArrowDownRight 
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Dropzone } from "@/components/ui/Dropzone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CompressControls } from "@/components/tools/CompressControls";
import { usePdfCompressor, CompressionLevel } from "@/hooks/usePdfCompressor";
import { formatBytes, truncateFileName } from "@/lib/utils";
import { HowToStep, FaqItem } from "@/types";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload your PDF",
    description:
      "Drop your PDF file into the secure dropzone. The file is analyzed strictly within your local browser memory.",
  },
  {
    stepNumber: 2,
    title: "Choose compression level",
    description:
      "Select Recommended (balanced), Extreme (smallest size for email), or Basic (lossless vector preservation).",
  },
  {
    stepNumber: 3,
    title: "Compress and download",
    description:
      "Click 'Compress PDF Now' to optimize object streams and download your reduced document immediately.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-compress-free",
    question: "How do I compress a PDF online for free without uploading?",
    answer:
      "Upload your PDF to GoPDF, choose your desired compression level (Recommended, Extreme, or Basic), and click 'Compress PDF Now'. The entire compression runs inside your browser memory using WebAssembly and HTML5 Canvas, generating a smaller file without uploading a single byte to external servers.",
  },
  {
    id: "quality-tradeoffs",
    question: "Does compressing a PDF reduce text or image quality?",
    answer:
      "Our 'Recommended' level preserves crisp, readable text and clear figures while reducing file size by ~40-50%. If you need 100% vector fidelity, the 'Basic' option strips unnecessary metadata and FlateDecode object streams without altering raster pixels. For strict email limits, 'Extreme' achieves maximum byte reduction.",
  },
  {
    id: "savings-amount",
    question: "How much can GoPDF reduce my PDF file size?",
    answer:
      "Depending on the original file content (such as high-resolution scanned pages or uncompressed photographs), GoPDF typically achieves between 40% and 75% file size reduction.",
  },
  {
    id: "privacy-safety",
    question: "Is client-side PDF compression safe for sensitive and confidential files?",
    answer:
      "Yes, 100%. Traditional PDF compressors send your files to remote cloud servers. GoPDF processes everything in your local machine's RAM sandbox, ensuring complete compliance with GDPR, HIPAA, and confidentiality NDAs.",
  },
];

export default function CompressPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CompressionLevel>("recommended");

  const {
    isCompressing,
    progress,
    statusMessage,
    downloadUrl,
    outputFileName,
    stats,
    error,
    compressPdf,
    reset: resetCompressor,
  } = usePdfCompressor();

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    resetCompressor();
  };

  const handleClear = () => {
    setSelectedFile(null);
    resetCompressor();
  };

  const handleCompress = async () => {
    if (!selectedFile || isCompressing) return;
    await compressPdf(selectedFile, selectedLevel);
  };

  // Consume transferred files if user dropped from homepage Universal Smart Dropzone
  useEffect(() => {
    import("@/lib/fileTransfer").then(({ getTransferredFiles }) => {
      const transferred = getTransferredFiles();
      if (transferred.length > 0) {
        handleFilesSelected(transferred);
      }
    });
  }, []);

  return (
    <ToolLayout
      title="Compress PDF Online"
      description="Reduce PDF file size up to 70% without sacrificing readability. 100% client-side memory execution with zero cloud uploads."
      badgeText="100% Client-Side / Secure"
      category="Organize PDF"
      toolSlug="compress-pdf"
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
    >
      <div className="space-y-6">
        {/* State 1: Dropzone when no file is active */}
        {!selectedFile ? (
          <Dropzone
            onFilesSelected={handleFilesSelected}
            maxFiles={1}
            title="Drop your PDF here to compress file size"
            subtitle="Reduce document size for email attachments and web sharing"
          />
        ) : (
          <div className="space-y-6">
            {/* Header Toolbar: Active Document Info & File Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                    {truncateFileName(selectedFile.name, 40)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Original Size: {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={isCompressing}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesSelected(Array.from(e.target.files));
                        e.target.value = "";
                      }
                    }}
                  />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors">
                    Change File
                  </span>
                </label>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isCompressing}
                  onClick={handleClear}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Error Feedback Notice */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-4 text-xs text-red-700 dark:text-red-300 animate-fadeIn"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Processing Notice</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Interactive Compression Controls (Level Selector + Live Savings Estimation) */}
            {!downloadUrl && !isCompressing && (
              <CompressControls
                originalSize={selectedFile.size}
                selectedLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
                onCompress={handleCompress}
                disabled={isCompressing}
                isCompressing={isCompressing}
              />
            )}

            {/* Progress Bar during Compression */}
            {isCompressing && (
              <div className="pt-2 animate-fadeIn">
                <ProgressBar
                  progress={progress}
                  label={statusMessage || `Compressing document in browser memory (${progress}%)...`}
                  status="loading"
                />
              </div>
            )}

            {/* Success Download Card with Live Before/After Metrics */}
            {downloadUrl && !isCompressing && stats && (
              <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 p-6 sm:p-8 text-center animate-fadeIn shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 mb-4">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  PDF Successfully Compressed!
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Your document was reduced locally with zero cloud transmission.
                </p>

                {/* Before vs After Metric Comparison Cards */}
                <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Original Size
                    </span>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {formatBytes(stats.originalSize)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Compressed Size
                    </span>
                    <p className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                      {formatBytes(stats.compressedSize)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-indigo-200 dark:border-indigo-800">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Total Saved
                    </span>
                    <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                      -{stats.savedPercentage}% ({formatBytes(stats.savedBytes)})
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={downloadUrl}
                    download={outputFileName || "compressed.pdf"}
                    className="inline-block"
                  >
                    <Button
                      size="lg"
                      leftIcon={<Download className="h-4 w-4" />}
                      className="bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                    >
                      Download Compressed PDF
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<RotateCcw className="h-4 w-4" />}
                    onClick={handleClear}
                  >
                    Compress Another PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical SEO & Value Explanation Section */}
        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Client-Side FlateDecode Engine
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                How to Reduce PDF File Size Online Without Cloud Uploads
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Most online PDF compressors upload your sensitive documents to remote servers in foreign data centers. GoPDF uses WebAssembly, HTML5 Offscreen Canvas, and pdf-lib directly inside your web browser. Embedded high-DPI images are downscaled into optimized FlateDecode object streams entirely within local device RAM, giving you fast compression with 100% privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
                  <Cpu className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  FlateDecode Stream Optimization
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Packs cross-reference tables and object streams into compressed containers for compact storage.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Zero Network Footprint
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Confidential legal records, contracts, and medical statements never leave your device memory.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Email Attachment Ready
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Shrink documents down to fit beneath 5MB or 10MB email attachment caps effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}

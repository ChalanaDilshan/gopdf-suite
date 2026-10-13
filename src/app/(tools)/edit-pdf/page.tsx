"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { 
  FileText, 
  Download, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Lock,
  Cpu,
  Layers,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Dropzone } from "@/components/ui/Dropzone";
import { Button } from "@/components/ui/Button";
import { TextEditorCanvas } from "@/components/tools/editor/TextEditorCanvas";
import { usePdfTextLayer, EditableTextBlock } from "@/hooks/usePdfTextLayer";
import { exportEditedPdf } from "@/lib/pdf/exportEditedPdf";
import { getTransferredFiles } from "@/lib/fileTransfer";
import { formatBytes, truncateFileName } from "@/lib/utils";
import { HowToStep, FaqItem } from "@/types";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload your PDF",
    description: "Drop your PDF file into the editor. The document is rendered locally inside your browser memory.",
  },
  {
    stepNumber: 2,
    title: "Click, Edit & Type",
    description: "Click on any text block on the page to edit words, change font colors, delete sentences, or add new text.",
  },
  {
    stepNumber: 3,
    title: "Export & Download",
    description: "Click 'Export & Download PDF' to execute instant in-memory whiteouts and stamp your replacement typography.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-edit-text",
    question: "How do I edit existing text in a PDF for free?",
    answer:
      "Upload your PDF into the GoPDF editor. Our engine extracts the text layer coordinates and overlays interactive inline editors. Hover over any text on the page, click to type changes or delete unwanted text, and download your updated PDF immediately.",
  },
  {
    id: "matching-fonts",
    question: "Does the editor match the original font style and size?",
    answer:
      "Yes! Our font matching engine detects whether the original text is Serif (Times Roman), Sans-serif (Helvetica/Arial), or Monospace (Courier), including Bold and Italic weights, ensuring that replacement text blends seamlessly into the original layout.",
  },
  {
    id: "privacy-safe",
    question: "Is it safe to edit confidential documents in GoPDF?",
    answer:
      "100% safe. GoPDF operates completely within your device's browser memory sandbox. Your document is never uploaded to any cloud server, ensuring absolute privacy and security for contracts, resumes, and financial reports.",
  },
  {
    id: "add-new-text",
    question: "Can I add brand-new text boxes anywhere on the page?",
    answer:
      "Yes! Toggle the 'Add Text' tool in the toolbar, then click anywhere on the page canvas to drop a new custom text block with adjustable font size and colors.",
  },
];

export default function EditPdfPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [isAddTextMode, setIsAddTextMode] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Store user modifications per page: { [pageNumber]: EditableTextBlock[] }
  const [editedPages, setEditedPages] = useState<Record<number, EditableTextBlock[]>>({});

  // Check for files transferred from homepage SmartDropzone
  useEffect(() => {
    const transferred = getTransferredFiles();
    if (transferred && transferred.length > 0) {
      handleFileSelected(transferred[0]);
    }
  }, []);

  const handleFileSelected = async (file: File) => {
    if (!file || !file.name.toLowerCase().endsWith(".pdf")) return;

    setSelectedFile(file);
    setCurrentPage(1);
    setEditedPages({});
    setExportError(null);

    try {
      const buffer = await file.arrayBuffer();
      setArrayBuffer(buffer);

      const pdfjs = await import("pdfjs-dist");
      if (typeof window !== "undefined") {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        pdfjs.GlobalWorkerOptions.workerSrc = `${basePath}/pdf.worker.min.js`;
      }

      const loadingTask = pdfjs.getDocument({
        data: buffer,
        cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
        cMapPacked: true,
        isEvalSupported: false,
      });

      const doc = await loadingTask.promise;
      setPdfDocument(doc);
      setTotalPages(doc.numPages);
    } catch (err: any) {
      console.error("Failed to load PDF:", err);
      setExportError(err?.message || "Failed to load PDF document.");
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setArrayBuffer(null);
    setPdfDocument(null);
    setCurrentPage(1);
    setTotalPages(1);
    setEditedPages({});
    setExportError(null);
  };

  // Sync edits from hook into page-level state
  const handlePageBlocksChange = useCallback(
    (blocks: EditableTextBlock[]) => {
      setEditedPages((prev) => ({
        ...prev,
        [currentPage]: blocks,
      }));
    },
    [currentPage]
  );

  // Active page's text layer hook
  const {
    canvasRef,
    textBlocks,
    updateTextBlock,
    deleteTextBlock,
    restoreTextBlock,
    addTextBlock,
    viewportDimensions,
    isLoading: isPageLoading,
  } = usePdfTextLayer({
    pdfDocument,
    pageNumber: currentPage,
    scale,
    cachedBlocks: editedPages[currentPage],
    onBlocksChange: handlePageBlocksChange,
  });

  // Calculate modifications count
  const { pageEditsCount, totalEditsCount } = useMemo(() => {
    let pageCount = 0;
    let totalCount = 0;

    Object.entries(editedPages).forEach(([pageNumStr, blocks]) => {
      const pNum = Number(pageNumStr);
      blocks.forEach((b) => {
        const isChanged = b.isDeleted || b.currentText !== b.originalText || b.isCustom;
        if (isChanged) {
          totalCount++;
          if (pNum === currentPage) {
            pageCount++;
          }
        }
      });
    });

    return { pageEditsCount: pageCount, totalEditsCount: totalCount };
  }, [editedPages, currentPage]);

  const handleResetCurrentPage = () => {
    setEditedPages((prev) => {
      const updated = { ...prev };
      delete updated[currentPage];
      return updated;
    });
  };

  const handleResetAll = () => {
    setEditedPages({});
  };

  // Export & Download PDF
  const handleExport = async () => {
    if (!arrayBuffer || !selectedFile) return;

    setIsExporting(true);
    setExportError(null);

    try {
      const editedBytes = await exportEditedPdf({
        originalArrayBuffer: arrayBuffer,
        editedPages,
        currentScale: scale,
      });

      const blob = new Blob([editedBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = url;
      const baseName = selectedFile.name.replace(/\.pdf$/i, "");
      downloadAnchor.download = `${baseName}-edited.pdf`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setIsExporting(false);
    } catch (err: any) {
      console.error("PDF Export failed:", err);
      setExportError(err?.message || "Failed to export edited PDF.");
      setIsExporting(false);
    }
  };

  const handleLoadSample = async () => {
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const helvetica = await doc.embedFont(StandardFonts.HelveticaBold);
      const times = await doc.embedFont(StandardFonts.TimesRoman);

      // Sample Page 1
      const page1 = doc.addPage([595, 842]);
      page1.drawText("INVOICE & SERVICES AGREEMENT", {
        x: 50,
        y: 780,
        size: 22,
        font: helvetica,
        color: rgb(0.1, 0.2, 0.5),
      });

      page1.drawText("Invoice Number: INV-2026-0042", {
        x: 50,
        y: 730,
        size: 14,
        font: times,
      });
      page1.drawText("Client Name: Acme Global Corporation", {
        x: 50,
        y: 700,
        size: 14,
        font: times,
      });
      page1.drawText("Amount Due: $4,500.00 USD", {
        x: 50,
        y: 670,
        size: 15,
        font: helvetica,
        color: rgb(0.1, 0.5, 0.2),
      });
      page1.drawText("Instructions: Click on any text above to edit names, numbers, or delete terms.", {
        x: 50,
        y: 620,
        size: 12,
        font: times,
      });

      // Sample Page 2
      const page2 = doc.addPage([595, 842]);
      page2.drawText("TERMS & CONDITIONS - PAGE 2", {
        x: 50,
        y: 780,
        size: 20,
        font: helvetica,
      });
      page2.drawText("1. All edits are processed 100% client-side in browser RAM.", {
        x: 50,
        y: 720,
        size: 13,
        font: times,
      });

      const bytes = await doc.save();
      const sampleFile = new File([bytes as unknown as BlobPart], "Sample_Invoice_Document.pdf", {
        type: "application/pdf",
      });

      handleFileSelected(sampleFile);
    } catch (err) {
      console.error("Failed to generate sample:", err);
    }
  };

  return (
    <ToolLayout
      title="Edit PDF Text Online"
      description="Click to edit, replace, or delete existing text inside any PDF with matching fonts and coordinates. 100% private in-browser editing."
      toolSlug="edit-pdf"
      category="Edit PDF"
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
    >
      <div className="space-y-6">
        {/* State A: File Dropzone (No File Loaded) */}
        {!selectedFile ? (
          <div className="space-y-6">
            <Dropzone
              onFilesSelected={(files) => handleFileSelected(files[0])}
              accept={[".pdf", "application/pdf"]}
              maxFiles={1}
            />

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Try with Sample Invoice Document</span>
              </button>
            </div>
          </div>
        ) : (
          /* State B: Active Multi-Page PDF Editor Workspace */
          <div className="space-y-4">
            {/* Top Workspace Toolbar */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 sm:p-5 shadow-sm space-y-4">
              {/* Row 1: File Info & Export Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {truncateFileName(selectedFile.name, 35)}
                      </h3>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Editing Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatBytes(selectedFile.size)} • {totalPages} page{totalPages > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClear}
                    disabled={isExporting}
                  >
                    Change File
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={isExporting}
                    onClick={handleExport}
                    leftIcon={<Download className="h-4 w-4" />}
                    className="shadow-md shadow-indigo-600/20"
                  >
                    Export &amp; Download PDF
                  </Button>
                </div>
              </div>

              {/* Row 2: Page Navigator & Tool Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left: Page Pagination Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1 || isExporting}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages || isExporting}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Center: Tools & Modes */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddTextMode((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isAddTextMode
                        ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400"
                        : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Type className="h-3.5 w-3.5" />
                    <span>{isAddTextMode ? "Click Canvas to Drop Text" : "Add Text Block"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCurrentPage}
                    disabled={pageEditsCount === 0 || isExporting}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 disabled:opacity-40 transition-colors cursor-pointer"
                    title="Reset changes on this page"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset Page</span>
                  </button>
                </div>

                {/* Right: Zoom Scale Controls & Edits Counter */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5">
                    <button
                      type="button"
                      disabled={scale <= 0.75}
                      onClick={() => setScale((s) => Math.max(0.75, s - 0.25))}
                      className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Zoom out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[11px] font-bold px-1.5 text-slate-700 dark:text-slate-200">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      type="button"
                      disabled={scale >= 2.5}
                      onClick={() => setScale((s) => Math.min(2.5, s + 0.25))}
                      className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Zoom in"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {totalEditsCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {totalEditsCount} edit{totalEditsCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {exportError && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}

            {/* Canvas Editor Container */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 p-2 sm:p-4">
              <TextEditorCanvas
                canvasRef={canvasRef}
                textBlocks={textBlocks}
                viewportDimensions={viewportDimensions}
                isLoading={isPageLoading}
                onUpdateBlock={updateTextBlock}
                onDeleteBlock={deleteTextBlock}
                onRestoreBlock={restoreTextBlock}
                onAddBlock={(x, y) => addTextBlock(x, y, "New Text")}
                isAddTextMode={isAddTextMode}
                scale={scale}
              />
            </div>
          </div>
        )}

        {/* Feature & Privacy Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Zero Cloud Uploads
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Text extraction, whiteout redaction, and replacement occur entirely inside your browser RAM sandbox.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Intelligent Font Matching
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Detects Serif, Sans-serif, and Monospaced fonts with exact weights to match existing layout aesthetics.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Multi-Page Workspace
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Navigate across 50+ pages with zoom controls and persistent edit states saved per page until export.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

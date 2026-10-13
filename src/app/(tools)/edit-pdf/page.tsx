"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { 
  FileText, 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Lock,
  Type,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  ArrowRight
} from "lucide-react";
import { Dropzone } from "@/components/ui/Dropzone";
import { Button } from "@/components/ui/Button";
import { EditorHeader, EditorMode, InteractionTool, ToolCategory } from "@/components/tools/editor/EditorHeader";
import { ThumbnailSidebar } from "@/components/tools/editor/ThumbnailSidebar";
import { DocumentCanvas } from "@/components/tools/editor/DocumentCanvas";
import { FloatingBottomBar } from "@/components/tools/editor/FloatingBottomBar";
import { TextPropertiesPanel } from "@/components/tools/editor/TextPropertiesPanel";
import { usePdfTextLayer, EditableTextBlock } from "@/hooks/usePdfTextLayer";
import { exportEditedPdf } from "@/lib/pdf/exportEditedPdf";
import { getTransferredFiles } from "@/lib/fileTransfer";
import { formatBytes, truncateFileName } from "@/lib/utils";

export default function EditPdfPage() {
  // Document state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);

  // Editor modes & tool categories
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");
  const [interactionTool, setInteractionTool] = useState<InteractionTool>("select");
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("editText");
  const [isAddTextMode, setIsAddTextMode] = useState<boolean>(false);

  // Selection & Panels state
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);

  // Edit history & modified pages map: { [pageNumber]: EditableTextBlock[] }
  const [editedPages, setEditedPages] = useState<Record<number, EditableTextBlock[]>>({});
  const [undoStack, setUndoStack] = useState<Array<Record<number, EditableTextBlock[]>>>([]);
  const [redoStack, setRedoStack] = useState<Array<Record<number, EditableTextBlock[]>>>([]);

  // Export state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

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
    setUndoStack([]);
    setRedoStack([]);
    setExportError(null);
    setSaveSuccessMessage(null);

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
    setUndoStack([]);
    setRedoStack([]);
    setExportError(null);
    setSaveSuccessMessage(null);
  };

  // Sync edits from hook into page-level state
  const handlePageBlocksChange = useCallback(
    (blocks: EditableTextBlock[]) => {
      setEditedPages((prev) => {
        // Record undo history
        setUndoStack((u) => [...u.slice(-15), prev]);
        setRedoStack([]);
        return {
          ...prev,
          [currentPage]: blocks,
        };
      });
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

  const selectedBlock =
    textBlocks.find((b) => b.id === selectedBlockId) || null;

  // Calculate modifications count
  const totalEditsCount = useMemo(() => {
    let count = 0;
    Object.values(editedPages).forEach((blocks) => {
      blocks.forEach((b) => {
        if (b.isDeleted || b.currentText !== b.originalText || b.isCustom) {
          count++;
        }
      });
    });
    return count;
  }, [editedPages]);

  // Undo / Redo Handlers
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((r) => [...r, editedPages]);
    setUndoStack((u) => u.slice(0, -1));
    setEditedPages(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((u) => [...u, editedPages]);
    setRedoStack((r) => r.slice(0, -1));
    setEditedPages(next);
  };

  // Export & Download PDF (Save changes action)
  const handleExport = async () => {
    if (!arrayBuffer || !selectedFile) return;

    setIsExporting(true);
    setExportError(null);
    setSaveSuccessMessage(null);

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
      setSaveSuccessMessage("Your edited PDF has been downloaded successfully!");
      setTimeout(() => setSaveSuccessMessage(null), 6000);
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
      page1.drawText("PROFESSIONAL INVOICE & PROPOSAL", {
        x: 50,
        y: 780,
        size: 20,
        font: helvetica,
        color: rgb(0.85, 0.15, 0.15), // Crimson Red
      });

      page1.drawText("Project: Website Redesign & Cloud Migration", {
        x: 50,
        y: 730,
        size: 13,
        font: times,
      });
      page1.drawText("Client: Acme Global Enterprises", {
        x: 50,
        y: 700,
        size: 13,
        font: times,
      });
      page1.drawText("Agreed Total: $8,500.00 USD", {
        x: 50,
        y: 670,
        size: 15,
        font: helvetica,
        color: rgb(0.1, 0.45, 0.2),
      });
      page1.drawText("Click any text block in this workspace to edit pricing, names, or terms directly.", {
        x: 50,
        y: 620,
        size: 11,
        font: times,
        color: rgb(0.3, 0.3, 0.3),
      });

      // Sample Page 2
      const page2 = doc.addPage([595, 842]);
      page2.drawText("TERMS OF AGREEMENT & SIGNATURES", {
        x: 50,
        y: 780,
        size: 18,
        font: helvetica,
      });
      page2.drawText("1. All changes are executed 100% client-side with zero cloud uploads.", {
        x: 50,
        y: 720,
        size: 12,
        font: times,
      });
      page2.drawText("2. Matching fonts (Helvetica, Times, Courier) are stamped in place.", {
        x: 50,
        y: 690,
        size: 12,
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
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 dark:bg-[#0b0f19]">
      {/* State A: File Dropzone (No File Loaded Yet) */}
      {!selectedFile ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                <Type className="h-3.5 w-3.5" />
                <span>Client-Side PDF Text Editor</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Edit Existing Text in Any PDF
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Click on any text block to edit words, change font colors, delete sentences, or add brand-new text directly in your browser.
              </p>
            </div>

            <Dropzone
              onFilesSelected={(files) => handleFileSelected(files[0])}
              accept={[".pdf", "application/pdf"]}
              maxFiles={1}
            />

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Try with Sample Invoice Document</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* State B: Professional Feature-Rich PDF Editor Workspace */
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* 1. Top Navigation Header */}
          <EditorHeader
            fileName={selectedFile.name}
            editorMode={editorMode}
            onSetEditorMode={setEditorMode}
            interactionTool={interactionTool}
            onSetInteractionTool={setInteractionTool}
            activeCategory={activeCategory}
            onSetCategory={setActiveCategory}
            onAddTextBlock={() => setIsAddTextMode((prev) => !prev)}
            onExportPdf={handleExport}
            isExporting={isExporting}
            totalEditsCount={totalEditsCount}
          />

          {/* Toast Alert Notifications */}
          {saveSuccessMessage && (
            <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shadow-md animate-fadeIn z-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{saveSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveSuccessMessage(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {exportError && (
            <div className="bg-red-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shadow-md animate-fadeIn z-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{exportError}</span>
              </div>
              <button
                type="button"
                onClick={() => setExportError(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* 2. Main 3-Column Studio Workspace Area */}
          <div className="relative flex flex-1 h-full overflow-hidden">
            {/* Left Sidebar: Thumbnail Navigation & Zoom */}
            <ThumbnailSidebar
              pdfDocument={pdfDocument}
              currentPage={currentPage}
              totalPages={totalPages}
              onSelectPage={setCurrentPage}
              isOpen={leftSidebarOpen}
              onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
            />

            {/* Center Canvas: Document Workspace */}
            <DocumentCanvas
              canvasRef={canvasRef}
              textBlocks={textBlocks}
              viewportDimensions={viewportDimensions}
              isLoading={isPageLoading}
              selectedBlockId={selectedBlockId}
              onSelectBlockId={setSelectedBlockId}
              onUpdateBlock={updateTextBlock}
              onDeleteBlock={deleteTextBlock}
              onRestoreBlock={restoreTextBlock}
              onAddBlock={(x, y) => addTextBlock(x, y, "New Text")}
              isAddTextMode={isAddTextMode}
              interactionTool={interactionTool}
              scale={scale}
            />

            {/* Right Sidebar: Text Styles Inspector Panel */}
            <TextPropertiesPanel
              selectedBlock={selectedBlock}
              onUpdateBlock={updateTextBlock}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={undoStack.length > 0}
              canRedo={redoStack.length > 0}
              onSaveChanges={handleExport}
              isSaving={isExporting}
              isOpen={rightSidebarOpen}
              onClose={() => setRightSidebarOpen(false)}
            />

            {/* Floating Bottom Navigation & Zoom Pill Bar */}
            <FloatingBottomBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              scale={scale}
              onScaleChange={setScale}
              onResetZoom={() => setScale(1.0)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

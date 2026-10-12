"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

export interface UsePdfSplitterReturn {
  isSplitting: boolean;
  progress: number;
  downloadUrl: string | null;
  outputFileName: string | null;
  error: string | null;
  splitPdf: (file: File, selectedPages: number[], customName?: string) => Promise<string | null>;
  reset: () => void;
}

export function usePdfSplitter(): UsePdfSplitterReturn {
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeBlobUrlRef = useRef<string | null>(null);

  const revokeActiveBlob = useCallback(() => {
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    setDownloadUrl(null);
  }, []);

  const reset = useCallback(() => {
    revokeActiveBlob();
    setIsSplitting(false);
    setProgress(0);
    setOutputFileName(null);
    setError(null);
  }, [revokeActiveBlob]);

  useEffect(() => {
    return () => {
      revokeActiveBlob();
    };
  }, [revokeActiveBlob]);

  const splitPdf = useCallback(
    async (file: File, selectedPages: number[], customName?: string): Promise<string | null> => {
      if (!file) {
        setError("Please provide a valid PDF document.");
        return null;
      }

      if (!selectedPages || selectedPages.length === 0) {
        setError("Please select at least one page to extract.");
        return null;
      }

      reset();
      setIsSplitting(true);
      setProgress(10);
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        setProgress(30);

        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
        setProgress(50);

        const totalPages = srcDoc.getPageCount();

        // Convert 1-based page numbers to 0-based indices and validate bounds
        const indicesToCopy = selectedPages
          .map((p) => p - 1)
          .filter((idx) => idx >= 0 && idx < totalPages);

        if (indicesToCopy.length === 0) {
          throw new Error("Selected page numbers are outside the page range of this document.");
        }

        const newDoc = await PDFDocument.create();
        setProgress(70);

        const copiedPages = await newDoc.copyPages(srcDoc, indicesToCopy);
        for (const page of copiedPages) {
          newDoc.addPage(page);
        }

        setProgress(90);
        const pdfBytes = await newDoc.save();

        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        activeBlobUrlRef.current = url;

        const baseName = file.name.replace(/\.pdf$/i, "");
        const finalName = customName || `${baseName}-extracted-pages.pdf`;

        setDownloadUrl(url);
        setOutputFileName(finalName);
        setProgress(100);
        setIsSplitting(false);

        return url;
      } catch (err: any) {
        const msg = err?.message?.toLowerCase() || "";
        if (msg.includes("encrypt") || msg.includes("password")) {
          setError("This PDF is password-protected. Please remove the password before splitting.");
        } else {
          setError(err?.message || "Failed to extract pages from the PDF document.");
        }
        setIsSplitting(false);
        return null;
      }
    },
    [reset]
  );

  return {
    isSplitting,
    progress,
    downloadUrl,
    outputFileName,
    error,
    splitPdf,
    reset,
  };
}

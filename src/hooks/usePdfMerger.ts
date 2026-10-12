"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { WorkerOutgoingMessage } from "@/workers/merge.worker";

export interface UsePdfMergerReturn {
  isProcessing: boolean;
  progress: number;
  currentStep: { current: number; total: number } | null;
  downloadUrl: string | null;
  error: string | null;
  mergeFiles: (files: File[]) => Promise<void>;
  cancelMerge: () => void;
  reset: () => void;
}

export function usePdfMerger(): UsePdfMergerReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<{ current: number; total: number } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const activeBlobUrlRef = useRef<string | null>(null);

  // Helper to safely revoke old object URLs to prevent memory leaks
  const revokeActiveBlob = useCallback(() => {
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    setDownloadUrl(null);
  }, []);

  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  // Cleanup worker and blob on unmount
  useEffect(() => {
    return () => {
      terminateWorker();
      revokeActiveBlob();
    };
  }, [terminateWorker, revokeActiveBlob]);

  const cancelMerge = useCallback(() => {
    terminateWorker();
    setIsProcessing(false);
    setProgress(0);
    setCurrentStep(null);
    setError(null);
  }, [terminateWorker]);

  const reset = useCallback(() => {
    cancelMerge();
    revokeActiveBlob();
    setError(null);
    setProgress(0);
    setCurrentStep(null);
  }, [cancelMerge, revokeActiveBlob]);

  const mergeFiles = useCallback(
    async (files: File[]) => {
      if (!files || files.length < 2) {
        setError("Please supply at least 2 PDF files to merge.");
        return;
      }

      // Cleanup prior results & errors
      revokeActiveBlob();
      terminateWorker();
      setError(null);
      setProgress(0);
      setCurrentStep({ current: 0, total: files.length });
      setIsProcessing(true);

      try {
        // Read file ArrayBuffers sequentially
        const buffers: ArrayBuffer[] = [];
        const fileNames: string[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const buffer = await file.arrayBuffer();
          buffers.push(buffer);
          fileNames.push(file.name);
        }

        // Initialize Web Worker
        const worker = new Worker(
          new URL("../workers/merge.worker.ts", import.meta.url)
        );
        workerRef.current = worker;

        worker.onmessage = (event: MessageEvent<WorkerOutgoingMessage>) => {
          const message = event.data;

          if (message.type === "PROGRESS") {
            setProgress(message.percent);
            setCurrentStep({ current: message.current, total: message.total });
          } else if (message.type === "SUCCESS") {
            const blob = new Blob([message.data as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            activeBlobUrlRef.current = url;
            setDownloadUrl(url);
            setProgress(100);
            setIsProcessing(false);
            terminateWorker();
          } else if (message.type === "ERROR") {
            setError(message.message);
            setIsProcessing(false);
            terminateWorker();
          }
        };

        worker.onerror = (err) => {
          setError(
            err.message || "An unexpected error occurred inside the PDF Web Worker."
          );
          setIsProcessing(false);
          terminateWorker();
        };

        // Transfer array buffers to worker for zero-copy memory efficiency
        worker.postMessage(
          {
            buffers,
            fileNames,
          },
          buffers
        );
      } catch (err: any) {
        setError(err?.message || "Failed to read PDF files for processing.");
        setIsProcessing(false);
        terminateWorker();
      }
    },
    [revokeActiveBlob, terminateWorker]
  );

  return {
    isProcessing,
    progress,
    currentStep,
    downloadUrl,
    error,
    mergeFiles,
    cancelMerge,
    reset,
  };
}

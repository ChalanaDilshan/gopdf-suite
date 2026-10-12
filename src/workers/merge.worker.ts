import { PDFDocument } from "pdf-lib";

export interface WorkerProgressMessage {
  type: "PROGRESS";
  percent: number;
  current: number;
  total: number;
}

export interface WorkerSuccessMessage {
  type: "SUCCESS";
  data: Uint8Array;
}

export interface WorkerErrorMessage {
  type: "ERROR";
  message: string;
}

export type WorkerOutgoingMessage =
  | WorkerProgressMessage
  | WorkerSuccessMessage
  | WorkerErrorMessage;

export interface MergeInputPayload {
  buffers: ArrayBuffer[];
  fileNames?: string[];
}

addEventListener("message", async (event: MessageEvent<ArrayBuffer[] | MergeInputPayload>) => {
  try {
    let buffers: ArrayBuffer[] = [];
    let fileNames: string[] = [];

    // Support both raw ArrayBuffer[] and { buffers, fileNames } payloads
    if (Array.isArray(event.data)) {
      buffers = event.data;
    } else if (event.data && Array.isArray(event.data.buffers)) {
      buffers = event.data.buffers;
      fileNames = event.data.fileNames || [];
    } else {
      postMessage({
        type: "ERROR",
        message: "Invalid input payload received by PDF Worker.",
      } as WorkerErrorMessage);
      return;
    }

    if (buffers.length === 0) {
      postMessage({
        type: "ERROR",
        message: "No PDF documents provided to merge.",
      } as WorkerErrorMessage);
      return;
    }

    // Initialize new merged PDF document
    const mergedPdf = await PDFDocument.create();
    const total = buffers.length;

    for (let i = 0; i < total; i++) {
      const buffer = buffers[i];
      const fileName = fileNames[i] || `File #${i + 1}`;

      let srcDoc: PDFDocument;
      try {
        srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
      } catch (loadError: any) {
        const errorMsg = loadError?.message?.toLowerCase() || "";
        if (errorMsg.includes("encrypt") || errorMsg.includes("password")) {
          postMessage({
            type: "ERROR",
            message: `"${fileName}" is password-protected. Please remove the password before merging.`,
          } as WorkerErrorMessage);
          return;
        }

        postMessage({
          type: "ERROR",
          message: `"${fileName}" could not be parsed: it may be corrupted or not a valid PDF.`,
        } as WorkerErrorMessage);
        return;
      }

      // Copy all pages sequentially
      const pageIndices = srcDoc.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);

      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }

      // Dispatch progress message after processing each file
      const current = i + 1;
      const percent = Math.round((current / total) * 100);

      postMessage({
        type: "PROGRESS",
        percent,
        current,
        total,
      } as WorkerProgressMessage);
    }

    // Save final merged document
    const mergedPdfBytes = await mergedPdf.save();

    // Post successful Uint8Array payload back to main thread
    postMessage({
      type: "SUCCESS",
      data: mergedPdfBytes,
    } as WorkerSuccessMessage);
  } catch (globalError: any) {
    postMessage({
      type: "ERROR",
      message:
        globalError?.message || "An unexpected error occurred during client-side PDF merging.",
    } as WorkerErrorMessage);
  }
});

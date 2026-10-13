"use client";

/**
 * In-memory client-side file transfer bridge.
 * Allows files dropped in the Universal Smart Dropzone on the homepage
 * to seamlessly carry over to destination tool workspaces without page reload.
 */

let transferredFiles: File[] = [];
const listeners = new Set<(files: File[]) => void>();

export function setTransferredFiles(files: File[]): void {
  transferredFiles = [...files];
  listeners.forEach((listener) => {
    try {
      listener(transferredFiles);
    } catch {
      // Ignore listener error
    }
  });
}

export function getTransferredFiles(): File[] {
  const files = [...transferredFiles];
  transferredFiles = []; // Consume on retrieval
  return files;
}

export function peekTransferredFiles(): File[] {
  return [...transferredFiles];
}

export function clearTransferredFiles(): void {
  transferredFiles = [];
}

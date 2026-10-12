import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely with Tailwind CSS conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format raw byte values into human-readable strings (KB, MB, GB).
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Truncate filename preserving extension
 */
export function truncateFileName(fileName: string, maxLength: number = 28): string {
  if (fileName.length <= maxLength) return fileName;
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) return `${fileName.slice(0, maxLength)}...`;

  const ext = fileName.slice(dotIndex);
  const name = fileName.slice(0, dotIndex);
  const charsToShow = maxLength - ext.length - 3;
  return `${name.slice(0, Math.max(charsToShow, 4))}...${ext}`;
}

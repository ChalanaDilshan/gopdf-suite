"use client";

import React from "react";
import { ImagesToPdfWorkspace } from "@/components/tools/conversion/ImagesToPdfWorkspace";
import { HowToStep, FaqItem } from "@/types";
import { PNG_TO_PDF_GUIDE } from "@/lib/toolGuides";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload PNG screenshots",
    description: "Drop your PNG files into the secure dropzone. Sharp previews render instantly in browser memory.",
  },
  {
    stepNumber: 2,
    title: "Adjust sequence & sizing",
    description: "Reorder graphics with arrows, configure orientation, and choose clean presentation margins.",
  },
  {
    stepNumber: 3,
    title: "Export PDF",
    description: "Click 'Convert to PDF' to compile your PNG graphics into an instant, high-quality document.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-convert-png-free",
    question: "How do I convert PNG screenshots to PDF for free?",
    answer:
      "Drop your PNG files into GoPDF, configure your preferred order and page format, and click 'Convert to PDF'. The file is created directly in your browser memory and downloads immediately with zero wait time.",
  },
  {
    id: "transparency-handling",
    question: "How does GoPDF handle transparent PNG backgrounds?",
    answer:
      "Transparent PNG graphics are composited onto clean white document pages so your design mockups, logos, and UI screenshots look crisp and readable without black backgrounds.",
  },
  {
    id: "privacy-safety",
    question: "Are my proprietary screenshots safe from data leaks?",
    answer:
      "Yes, 100%. All processing runs locally inside your browser sandbox. Your images and documents are never uploaded to any remote server or third-party cloud.",
  },
];

export default function PngToPdfPage() {
  return (
    <ImagesToPdfWorkspace
      toolSlug="png-to-pdf"
      title="Convert PNG to PDF Online Free"
      description="Convert PNG screenshots, graphics, and diagrams to clean PDF documents. Preserve sharp pixel edges and transparent graphics with zero cloud uploads."
      badgeText="100% Client-Side / Secure"
      defaultFormatLabel="PNG"
      acceptedTypes={["image/png", "image/jpeg", "image/webp", ".png", ".jpg", ".jpeg", ".webp"]}
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
      contentGuide={PNG_TO_PDF_GUIDE}
    />
  );
}

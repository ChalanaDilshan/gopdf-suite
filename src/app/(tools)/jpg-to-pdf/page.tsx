"use client";

import React from "react";
import { ImagesToPdfWorkspace } from "@/components/tools/conversion/ImagesToPdfWorkspace";
import { HowToStep, FaqItem } from "@/types";
import { JPG_TO_PDF_GUIDE } from "@/lib/toolGuides";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload JPG files",
    description: "Drop your JPG or JPEG images into the dropzone. Visual cards render immediately in browser memory.",
  },
  {
    stepNumber: 2,
    title: "Configure layout",
    description: "Reorder images with arrows, rotate if needed, and choose your preferred page margins and A4 or fit formatting.",
  },
  {
    stepNumber: 3,
    title: "Download PDF",
    description: "Click 'Convert to PDF' to compile your photos into a single PDF document and download instantly.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-convert-free",
    question: "How do I convert JPG images to PDF online for free?",
    answer:
      "Drop your JPG images into GoPDF, rearrange them in sequence, choose your preferred page orientation and margin, and click 'Convert to PDF'. The file is created directly in your browser memory and downloads immediately with zero wait time.",
  },
  {
    id: "multiple-photos",
    question: "Can I combine multiple JPG photos into a single multi-page PDF?",
    answer:
      "Yes. You can select dozens of images at once. GoPDF compiles them into a unified multi-page PDF document with full native clarity.",
  },
  {
    id: "privacy-guarantee",
    question: "Are my confidential photos uploaded to any external cloud server?",
    answer:
      "No, never. All image conversion and PDF compilation execute locally in your computer or phone's memory sandbox using client-side JavaScript. Your photos are completely private.",
  },
  {
    id: "quality-preservation",
    question: "Will converting JPG to PDF reduce photo quality?",
    answer:
      "No. GoPDF preserves full native resolution without artificial downsampling or blurriness.",
  },
];

export default function JpgToPdfPage() {
  return (
    <ImagesToPdfWorkspace
      toolSlug="jpg-to-pdf"
      title="Convert JPG to PDF Online Free"
      description="Convert JPG and JPEG images to clean PDF documents right in your browser. Reorder photos, adjust margins and page size with zero cloud uploads."
      badgeText="100% Client-Side / Secure"
      defaultFormatLabel="JPG"
      acceptedTypes={["image/jpeg", "image/png", "image/webp", ".jpg", ".jpeg", ".png", ".webp"]}
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
      contentGuide={JPG_TO_PDF_GUIDE}
    />
  );
}

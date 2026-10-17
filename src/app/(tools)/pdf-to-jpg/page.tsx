"use client";

import React from "react";
import { PdfToImagesWorkspace } from "@/components/tools/conversion/PdfToImagesWorkspace";
import { HowToStep, FaqItem } from "@/types";
import { PDF_TO_JPG_GUIDE } from "@/lib/toolGuides";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload your PDF",
    description: "Drop your PDF file into the dropzone. Page count and file info load immediately in browser memory.",
  },
  {
    stepNumber: 2,
    title: "Select pages & resolution",
    description: "Choose all pages or toggle specific sheets. Select HD (144 DPI) for crisp text or standard web scale.",
  },
  {
    stepNumber: 3,
    title: "Download JPG or ZIP",
    description: "Click 'Convert to JPG'. Download individual page photos or save all images in a unified .ZIP package.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-convert-pdf-to-jpg",
    question: "How do I convert PDF pages to JPG images online for free?",
    answer:
      "Upload your PDF to GoPDF, choose your desired resolution scale, and click 'Convert to JPG'. The pages are rendered to high-resolution JPEG images directly in your browser without uploading to any remote server.",
  },
  {
    id: "bulk-zip-download",
    question: "Can I download all extracted page images at once?",
    answer:
      "Yes! GoPDF features an instant 'Download All as ZIP (.zip)' button that packages every converted page into a single archive with 1 click.",
  },
  {
    id: "privacy-security",
    question: "Is client-side PDF to image conversion safe for confidential files?",
    answer:
      "Yes, 100%. Traditional online converters send your files across the internet. GoPDF processes everything inside your device memory sandbox, ensuring total privacy.",
  },
];

export default function PdfToJpgPage() {
  return (
    <PdfToImagesWorkspace
      toolSlug="pdf-to-jpg"
      title="Convert PDF to JPG Online Free"
      description="Extract PDF pages into high-resolution JPG images. Download single page pictures or save all in a convenient .ZIP archive with zero cloud uploads."
      badgeText="100% Client-Side / Secure"
      defaultFormat="jpg"
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
      contentGuide={PDF_TO_JPG_GUIDE}
    />
  );
}

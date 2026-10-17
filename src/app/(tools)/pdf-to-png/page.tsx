"use client";

import React from "react";
import { PdfToImagesWorkspace } from "@/components/tools/conversion/PdfToImagesWorkspace";
import { HowToStep, FaqItem } from "@/types";
import { PDF_TO_PNG_GUIDE } from "@/lib/toolGuides";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload your PDF",
    description: "Drop your PDF file into the dropzone. Page count and file info load immediately in browser memory.",
  },
  {
    stepNumber: 2,
    title: "Select PNG resolution",
    description: "Choose HD or Ultra 2.5x sharpness for lossless graphic and typography fidelity.",
  },
  {
    stepNumber: 3,
    title: "Download PNG or ZIP",
    description: "Click 'Convert to PNG'. Save individual images or download all as a complete .zip package.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-convert-pdf-to-png",
    question: "How do I convert PDF pages to lossless PNG images for free?",
    answer:
      "Upload your PDF to GoPDF, choose your desired resolution scale, and click 'Convert to PNG'. The pages are rendered to lossless PNG images directly in your browser without uploading to any remote server.",
  },
  {
    id: "bulk-zip-download-png",
    question: "Can I download all extracted PNG pages at once?",
    answer:
      "Yes! GoPDF features an instant 'Download All as ZIP (.zip)' button that packages every converted page into a single archive with 1 click.",
  },
  {
    id: "why-png",
    question: "Why should I convert PDF to PNG instead of JPG?",
    answer:
      "PNG is a lossless format that prevents compression artifacts around fine text, barcodes, charts, and vector diagrams, making it the superior choice for presentation graphics and technical schematics.",
  },
];

export default function PdfToPngPage() {
  return (
    <PdfToImagesWorkspace
      toolSlug="pdf-to-png"
      title="Convert PDF to PNG Online Free"
      description="Extract PDF pages into lossless, pixel-perfect PNG images. Download single page pictures or save all in a convenient .ZIP archive with zero cloud uploads."
      badgeText="100% Client-Side / Secure"
      defaultFormat="png"
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
      contentGuide={PDF_TO_PNG_GUIDE}
    />
  );
}

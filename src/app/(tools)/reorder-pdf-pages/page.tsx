"use client";

import React from "react";
import { OrganizeWorkspace } from "@/components/tools/OrganizeWorkspace";
import { HowToStep, FaqItem } from "@/types";
import { ArrowUpDown, Lock, Cpu } from "lucide-react";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload your PDF",
    description:
      "Drop your PDF file into the secure dropzone. Visual thumbnails will generate automatically on your machine.",
  },
  {
    stepNumber: 2,
    title: "Drag & drop to rearrange",
    description:
      "Grab any page card and drag it into its new position. Combine with rotation or deletion in the same view.",
  },
  {
    stepNumber: 3,
    title: "Save and download",
    description:
      "Click 'Save & Download Reordered PDF' to compile your restructured document with zero server wait time.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-reorder-free",
    question: "How do I rearrange or reorder pages in a PDF for free?",
    answer:
      "Upload your PDF to GoPDF, hover over any page card, and drag the grip handle or thumbnail to move it to your desired position. Once you are satisfied with the sequence, click 'Save & Download Reordered PDF' to export your updated document immediately.",
  },
  {
    id: "rotate-delete-while-reordering",
    question: "Can I rotate or delete pages while reordering them?",
    answer:
      "Yes. GoPDF's unified workspace allows you to reorder, rotate 90/180/270 degrees, and delete unwanted sheets in the same interactive session before exporting.",
  },
  {
    id: "permanent-order",
    question: "Is drag-and-drop page reordering permanent in the downloaded PDF?",
    answer:
      "Yes. The export engine uses pdf-lib to physically assemble the new PDF document according to your custom page sequence. The resulting file preserves your custom order across all PDF viewers and printers.",
  },
  {
    id: "privacy-reordering",
    question: "Are my files uploaded to a remote server when reordering pages?",
    answer:
      "No. All page thumbnail rendering and PDF restructuring occur strictly in your local device memory using WebAssembly. Your files are never transmitted to cloud servers or stored externally.",
  },
];

const SEO_CARDS = [
  {
    title: "Drag-and-Drop Page Sorting",
    description:
      "Seamlessly grab and move pages to any position in the grid with intuitive visual placement feedback.",
    icon: <ArrowUpDown className="h-4 w-4" />,
  },
  {
    title: "Permanent PDF Assembly",
    description:
      "Generates a fresh PDF document reflecting your exact page sequence with preserved fonts, graphics, and metadata.",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    title: "100% In-Memory Privacy",
    description:
      "Everything happens locally in your device RAM. Complete confidentiality for contracts, legal filings, and records.",
    icon: <Lock className="h-4 w-4" />,
  },
];

import { REORDER_TOOL_GUIDE } from "@/lib/toolGuides";

export default function ReorderPdfPagesPage() {
  return (
    <OrganizeWorkspace
      toolSlug="reorder-pdf-pages"
      title="Reorder PDF Pages Online"
      description="Drag and drop pages to rearrange your document sequence with instant visual previews. 100% client-side with zero server uploads."
      badgeText="100% Client-Side / Drag & Drop"
      category="Organize PDF"
      dropzoneTitle="Drop your PDF here to reorder pages"
      dropzoneSubtitle="Select a PDF document to preview and drag pages into your desired sequence"
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
      contentGuide={REORDER_TOOL_GUIDE}
      customExportLabel="Save & Download Reordered PDF"
      defaultFileNameSuffix="-reordered.pdf"
    />
  );
}

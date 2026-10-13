"use client";

import React from "react";
import { OrganizeWorkspace } from "@/components/tools/OrganizeWorkspace";
import { HowToStep, FaqItem } from "@/types";
import { Trash2, Lock, ShieldCheck } from "lucide-react";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload your PDF",
    description:
      "Drop your PDF document into the browser dropzone. Visual thumbnails will generate automatically on your machine.",
  },
  {
    stepNumber: 2,
    title: "Mark unwanted pages",
    description:
      "Click the trash icon on any page card to mark it as deleted. You can click 'Restore' anytime if you change your mind.",
  },
  {
    stepNumber: 3,
    title: "Save and download",
    description:
      "Click 'Save & Download Clean PDF' to create a new document excluding all deleted pages with zero waiting.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-delete-free",
    question: "How do I delete pages from a PDF for free?",
    answer:
      "Upload your document to GoPDF, hover or view the page cards, and click the trash icon on any pages you wish to remove. Then click 'Save & Download Clean PDF' to receive your new file without the deleted pages.",
  },
  {
    id: "undo-support",
    question: "Can I undo or restore a page if I deleted it by mistake?",
    answer:
      "Yes. When you delete a page, it is marked with a diagonal strike-through and a red indicator. Click the 'Restore' button on any deleted page or use 'Reset All' at any point before exporting to recover them instantly.",
  },
  {
    id: "file-size-reduction",
    question: "Does deleting pages reduce the overall PDF file size?",
    answer:
      "Yes. The export engine extracts and copies only the retained pages into a fresh, optimized PDF document. All graphics, text streams, and resources belonging exclusively to deleted pages are discarded, resulting in a smaller file.",
  },
  {
    id: "safe-confidential",
    question: "Is client-side page deletion safe for confidential files?",
    answer:
      "Yes, 100%. Processing is executed strictly inside your local browser sandbox via WebAssembly and HTML5 Canvas. Your documents never touch external cloud servers, ensuring complete compliance and privacy.",
  },
];

const SEO_CARDS = [
  {
    title: "Instant One-Click Undo",
    description:
      "Marked pages are visibly struck-through and faded. Easily restore any page individually or reset all at once before downloading.",
    icon: <Trash2 className="h-4 w-4" />,
  },
  {
    title: "True Stream Stripping",
    description:
      "Deleted pages are completely omitted from the new PDF stream, reducing overall file size and ensuring deleted content cannot be recovered.",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    title: "Guaranteed Local Privacy",
    description:
      "Everything happens inside your device's browser memory. Your sensitive files and private records never leave your machine.",
    icon: <Lock className="h-4 w-4" />,
  },
];

import { DELETE_TOOL_GUIDE } from "@/lib/toolGuides";

export default function DeletePdfPagesPage() {
  return (
    <OrganizeWorkspace
      toolSlug="delete-pdf-pages"
      title="Delete PDF Pages Online"
      description="Visually preview every page of your PDF and remove unwanted pages with one-click instant undo. 100% private, on-device execution."
      badgeText="100% Client-Side / Secure"
      category="Organize PDF"
      dropzoneTitle="Drop your PDF here to remove pages"
      dropzoneSubtitle="Select a PDF document to preview and remove unwanted pages"
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
      contentGuide={DELETE_TOOL_GUIDE}
      customExportLabel="Save & Download Clean PDF"
      defaultFileNameSuffix="-deleted-pages.pdf"
    />
  );
}

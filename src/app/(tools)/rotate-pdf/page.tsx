"use client";

import React from "react";
import { OrganizeWorkspace } from "@/components/tools/OrganizeWorkspace";
import { HowToStep, FaqItem } from "@/types";
import { RotateCw, Lock, Cpu } from "lucide-react";

const HOW_TO_STEPS: HowToStep[] = [
  {
    stepNumber: 1,
    title: "Upload your PDF",
    description:
      "Drop your PDF file into the secure dropzone. Crisp visual page thumbnails render directly in your browser memory.",
  },
  {
    stepNumber: 2,
    title: "Rotate pages visually",
    description:
      "Click the rotate icons on individual page cards or use 'Rotate All Clockwise' to adjust the entire document at 60fps.",
  },
  {
    stepNumber: 3,
    title: "Download permanently",
    description:
      "Click 'Save & Download Rotated PDF' to write the rotation metadata into a new PDF and save it with zero latency.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "how-to-rotate-free",
    question: "How do I rotate PDF pages for free?",
    answer:
      "Upload your PDF to GoPDF, preview every page thumbnail, and click the clockwise or counter-clockwise rotate buttons on individual pages or use 'Rotate All Clockwise'. Click 'Save & Download Rotated PDF' to download your updated document instantly.",
  },
  {
    id: "permanent-rotation",
    question: "Is the page rotation permanent in the downloaded PDF?",
    answer:
      "Yes. GoPDF updates the underlying PDF rotation dictionary using pdf-lib directly in your browser. The rotation remains permanent in Adobe Acrobat, Apple Preview, Chrome, mobile readers, and physical printouts.",
  },
  {
    id: "single-pages",
    question: "Can I rotate individual pages without changing the whole document?",
    answer:
      "Absolutely. Each page card features dedicated clockwise and counter-clockwise rotation buttons, allowing you to rotate specific pages (e.g. landscape diagrams or upside-down scans) without altering other pages.",
  },
  {
    id: "privacy-security",
    question: "Are my files uploaded to a remote server when rotating PDF pages?",
    answer:
      "No. All thumbnail generation and PDF restructuring happen strictly within your local browser memory using WebAssembly and client-side JavaScript. Your files never touch external servers or cloud storage.",
  },
];

const SEO_CARDS = [
  {
    title: "Instant 60fps Rotation",
    description:
      "Thumbnails rotate immediately via hardware-accelerated CSS transforms. No cumbersome canvas redraws or laggy UI freezes.",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    title: "Permanent Document Geometry",
    description:
      "Modifies the internal PDF rotation angle metadata so your pages display correctly in all desktop and mobile PDF viewers.",
    icon: <RotateCw className="h-4 w-4" />,
  },
  {
    title: "Absolute Privacy Sandbox",
    description:
      "Your documents are never transmitted over the internet. Complete safety for contracts, passports, statements, and IDs.",
    icon: <Lock className="h-4 w-4" />,
  },
];

export default function RotatePdfPage() {
  return (
    <OrganizeWorkspace
      toolSlug="rotate-pdf"
      title="Rotate PDF Pages Online"
      description="Rotate PDF pages 90, 180, or 270 degrees clockwise or counter-clockwise. Adjust single pages or the entire document permanently with zero server uploads."
      badgeText="100% Client-Side / Secure"
      category="Organize PDF"
      dropzoneTitle="Drop your PDF here to rotate pages"
      dropzoneSubtitle="Select a PDF document to preview and adjust page orientation"
      steps={HOW_TO_STEPS}
      faqItems={FAQ_ITEMS}
      seoHeading="How to Rotate PDF Pages Permanently for Free"
      seoDescription="Unlike basic PDF viewers that only rotate page views temporarily on your screen, GoPDF modifies the underlying PDF geometry using pdf-lib in your browser. When you save and share the file, pages remain in your desired orientation across Adobe Acrobat, Google Chrome, Apple Preview, and print drivers."
      seoCards={SEO_CARDS}
      customExportLabel="Save & Download Rotated PDF"
      defaultFileNameSuffix="-rotated.pdf"
    />
  );
}

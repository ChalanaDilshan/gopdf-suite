import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files Online - Free, Fast & 100% Private",
  description:
    "Combine multiple PDF documents into a single document in seconds. 100% free, zero server uploads, no file limits, and completely private directly in your web browser.",
  keywords: [
    "merge PDF",
    "combine PDF online",
    "join PDF files",
    "free PDF merger",
    "client-side PDF merger",
    "secure PDF joiner",
    "merge PDF without upload",
    "GoPDF merge",
  ],
  alternates: {
    canonical: "https://gopdf.tech/merge-pdf/",
  },
  openGraph: {
    title: "Merge PDF Files Online - Free, Fast & 100% Private | GoPDF",
    description:
      "Combine multiple PDF documents into one cleanly formatted file with zero server uploads and total privacy.",
    url: "https://gopdf.tech/merge-pdf/",
    siteName: "GoPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Files Online - Free, Fast & 100% Private | GoPDF",
    description:
      "Combine multiple PDF files into one in seconds. 100% client-side with zero server uploads.",
  },
};

import { FaqJsonLd, HowToJsonLd } from "@/components/seo/JsonLd";

const MERGE_FAQS = [
  {
    question: "Is this tool really free to use?",
    answer: "Yes, it is 100% free with no hidden subscriptions, trial limits, watermarks, or account registration required.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer: "No. All document processing runs locally in your web browser via client-side Web Workers and WebAssembly. Your files never leave your device.",
  },
  {
    question: "What file size limits apply?",
    answer: "You can combine up to 20 files at once with individual files up to 50MB each. Processing speed depends strictly on your device's local memory and CPU.",
  },
  {
    question: "Can I rearrange the PDF files?",
    answer: "Yes. Simply grab the drag handle icon on any document card and move it up or down to set your preferred merge order.",
  },
  {
    question: "Can I merge password-protected files?",
    answer: "Protected files must be unlocked before merging. We recommend removing restrictions prior to uploading for processing.",
  },
];

const MERGE_STEPS = [
  {
    name: "Upload PDF documents",
    text: "Select or drag and drop multiple PDF files into the upload dropzone.",
  },
  {
    name: "Arrange merge order",
    text: "Drag and drop the document cards into your preferred reading order.",
  },
  {
    name: "Merge and download",
    text: "Click Merge PDFs to combine all documents into a single PDF instantly in your browser.",
  },
];

export default function MergePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FaqJsonLd faqs={MERGE_FAQS} />
      <HowToJsonLd
        name="How to Merge PDF Files Online"
        description="A step-by-step guide to combining multiple PDF files into a single document in your browser with zero server uploads."
        steps={MERGE_STEPS}
      />
      {children}
    </>
  );
}

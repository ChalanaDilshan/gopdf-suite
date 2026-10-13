import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Merge PDF Online – Free, Private, No Upload",
  description:
    "Combine multiple PDF files into one in seconds. 100% private, free with no watermark, and zero server uploads directly in your browser.",
  alternates: {
    canonical: "https://gopdf.tech/merge-pdf/",
  },
  openGraph: {
    title: "Merge PDF Online – Free, Private, No Upload | GoPDF",
    description:
      "Combine multiple PDF documents into one cleanly formatted file with zero server uploads and total privacy.",
    url: "https://gopdf.tech/merge-pdf/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF Merge PDF Tool - Combine PDF files online privately with zero uploads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Online – Free, Private, No Upload | GoPDF",
    description:
      "Combine multiple PDF files into one in seconds. 100% client-side with zero server uploads.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

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
      <SoftwareApplicationJsonLd
        name="GoPDF Merge PDF"
        description="Merge PDF files online privately in your browser with zero server uploads."
        url="https://gopdf.tech/merge-pdf/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "Merge PDF", item: "https://gopdf.tech/merge-pdf/" },
        ]}
      />
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

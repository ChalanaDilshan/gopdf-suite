import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Split PDF – Extract & Separate Pages Free",
  description:
    "Extract pages or split PDF documents into separate files instantly in your browser. 100% private with zero file uploads.",
  alternates: {
    canonical: "https://gopdf.tech/split-pdf/",
  },
  openGraph: {
    title: "Split PDF – Extract & Separate Pages Free | GoPDF",
    description:
      "Extract selected pages or separate PDF files with live visual page thumbnails directly in your browser.",
    url: "https://gopdf.tech/split-pdf/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF Split PDF Tool - Extract pages from PDF documents privately",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF – Extract & Separate Pages Free | GoPDF",
    description:
      "Extract selected pages from PDF files with visual previews. 100% client-side.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const SPLIT_FAQS = [
  {
    question: "How does client-side PDF splitting work?",
    answer: "Using WebAssembly and pdfjs-dist directly in your browser, your document is rendered and split locally without sending byte streams to any remote servers.",
  },
  {
    question: "Are visual thumbnails generated securely?",
    answer: "Yes. Each page thumbnail is rendered to a transient HTML5 canvas in your local device memory.",
  },
  {
    question: "Can I select non-consecutive page ranges?",
    answer: "Yes. Enter custom ranges like 1-3, 5, 8-10 in the page range input or click individual thumbnails.",
  },
  {
    question: "Is there any document page or file size limit?",
    answer: "GoPDF allows splitting PDF files up to 100MB directly in your browser.",
  },
];

const SPLIT_STEPS = [
  {
    name: "Upload your PDF",
    text: "Drop your PDF file into the secure dropzone. Visual thumbnails generate automatically in your browser.",
  },
  {
    name: "Select pages to extract",
    text: "Click thumbnails to check specific pages, use Quick Select (odd/even), or enter custom ranges.",
  },
  {
    name: "Extract and Save",
    text: "Click Extract Pages to assemble your custom document and download immediately.",
  },
];

export default function SplitPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF Split PDF"
        description="Split and extract PDF pages online privately in your browser with zero server uploads."
        url="https://gopdf.tech/split-pdf/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "Split PDF", item: "https://gopdf.tech/split-pdf/" },
        ]}
      />
      <FaqJsonLd faqs={SPLIT_FAQS} />
      <HowToJsonLd
        name="How to Split PDF Pages Online"
        description="A complete guide to extracting and splitting PDF pages with visual thumbnails directly in your web browser."
        steps={SPLIT_STEPS}
      />
      {children}
    </>
  );
}

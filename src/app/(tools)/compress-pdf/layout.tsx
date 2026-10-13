import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Compress PDF Online – Reduce File Size Free",
  description:
    "Compress PDF files directly in your browser. Reduce file size up to 70% with zero server uploads and sharp vector text. 100% free and private.",
  alternates: {
    canonical: "https://gopdf.tech/compress-pdf/",
  },
  openGraph: {
    title: "Compress PDF Online – Reduce File Size Free | GoPDF",
    description:
      "Compress PDF files directly in your web browser. Reduce file size up to 70% with zero server uploads.",
    url: "https://gopdf.tech/compress-pdf/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF Compress PDF Tool - Reduce PDF file size online privately",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online – Reduce File Size Free | GoPDF",
    description:
      "Compress PDF files with zero cloud uploads. 100% client-side memory execution.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const COMPRESS_FAQS = [
  {
    question: "How do I compress a PDF online for free without uploading?",
    answer:
      "Upload your PDF to GoPDF, choose your desired compression level (Recommended, Extreme, or Basic), and click 'Compress PDF Now'. The entire compression runs inside your browser memory using WebAssembly and HTML5 Canvas, generating a smaller file without uploading a single byte to external servers.",
  },
  {
    question: "Does compressing a PDF reduce text or letter quality?",
    answer:
      "No! GoPDF uses vector-preserving compression: your document's text, fonts, character glyphs, and typography remain 100% native vector streams. Letters are never rasterized into blurry pixels, remaining pin-sharp and selectable at any zoom level. Only heavy embedded raster images and redundant metadata streams are optimized.",
  },
  {
    question: "How much can GoPDF reduce my PDF file size?",
    answer:
      "Depending on the original file content (such as high-resolution scanned pages or uncompressed photographs), GoPDF typically achieves between 40% and 75% file size reduction.",
  },
  {
    question: "Is client-side PDF compression safe for sensitive and confidential files?",
    answer:
      "Yes, 100%. Traditional PDF compressors send your files to remote cloud servers. GoPDF processes everything in your local machine's RAM sandbox, ensuring complete compliance with GDPR, HIPAA, and confidentiality NDAs.",
  },
];

const COMPRESS_STEPS = [
  {
    name: "Upload your PDF",
    text: "Drop your PDF file into the secure dropzone to inspect its size and page count.",
  },
  {
    name: "Choose compression level",
    text: "Select Recommended (balanced), Extreme (smallest size), or Basic (lossless vector).",
  },
  {
    name: "Compress and download",
    text: "Click Compress PDF Now to process your file in browser memory and download immediately.",
  },
];

export default function CompressPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF Compress PDF"
        description="Compress PDF documents online in your browser. Reduce file size up to 70% with zero server uploads."
        url="https://gopdf.tech/compress-pdf/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "Compress PDF", item: "https://gopdf.tech/compress-pdf/" },
        ]}
      />
      <FaqJsonLd faqs={COMPRESS_FAQS} />
      <HowToJsonLd
        name="How to Compress PDF Files Online for Free"
        description="A step-by-step guide to reducing PDF file size securely in your web browser with zero server uploads."
        steps={COMPRESS_STEPS}
      />
      {children}
    </>
  );
}

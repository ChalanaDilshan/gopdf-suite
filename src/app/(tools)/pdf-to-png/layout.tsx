import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Convert PDF to PNG Online Free – Lossless & High Fidelity",
  description:
    "Convert PDF pages to lossless PNG images online directly in your browser. Download pages individually or save all in a single ZIP. 100% free and client-side.",
  alternates: {
    canonical: "https://gopdf.tech/pdf-to-png/",
  },
  openGraph: {
    title: "Convert PDF to PNG Online Free | GoPDF",
    description:
      "Convert PDF documents to lossless PNG images in your browser. 100% private with zero server uploads.",
    url: "https://gopdf.tech/pdf-to-png/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF PDF to PNG Tool - Convert PDF pages to lossless PNG images privately",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert PDF to PNG Online Free | GoPDF",
    description:
      "Convert PDF pages to lossless PNG images with zero cloud uploads. 100% client-side memory execution.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const PDF_TO_PNG_FAQS = [
  {
    question: "Why should I convert PDF to PNG instead of JPG?",
    answer:
      "PNG is a lossless format that prevents compression artifacts around fine text, barcodes, charts, and vector diagrams, making it the superior choice for presentation graphics and technical schematics.",
  },
  {
    question: "Can I download all converted PNG pages as a single ZIP file?",
    answer:
      "Yes! GoPDF features an instant 'Download All as ZIP (.zip)' button that packages every converted page into a single archive with 1 click.",
  },
  {
    question: "Are my documents uploaded to any remote server or cloud?",
    answer:
      "Never. All rendering operations execute strictly within your local browser memory sandbox. Your files never leave your computer.",
  },
];

const PDF_TO_PNG_STEPS = [
  {
    name: "Upload PDF",
    text: "Select any PDF from your device to load pages into memory.",
  },
  {
    name: "Choose PNG resolution",
    text: "Select High Definition (144 DPI) or Ultra Sharpness for maximum quality.",
  },
  {
    name: "Save PNG files or ZIP",
    text: "Download individual page pictures or save all images in a unified .ZIP package.",
  },
];

export default function PdfToPngLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF PDF to PNG Converter"
        description="Convert PDF pages to lossless PNG images online in your browser. Fast, private, and 100% client-side."
        url="https://gopdf.tech/pdf-to-png/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "PDF to PNG", item: "https://gopdf.tech/pdf-to-png/" },
        ]}
      />
      <FaqJsonLd faqs={PDF_TO_PNG_FAQS} />
      <HowToJsonLd
        name="How to Convert PDF to PNG Online Free"
        description="A step-by-step guide to converting PDF pages to lossless PNG images in your browser."
        steps={PDF_TO_PNG_STEPS}
      />
      {children}
    </>
  );
}

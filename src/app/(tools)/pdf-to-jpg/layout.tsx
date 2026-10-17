import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Convert PDF to JPG Online Free – High Resolution & Private",
  description:
    "Convert PDF pages to high-resolution JPG images online directly in your browser. Download pages individually or save all in a single ZIP. 100% free and client-side.",
  alternates: {
    canonical: "https://gopdf.tech/pdf-to-jpg/",
  },
  openGraph: {
    title: "Convert PDF to JPG Online Free | GoPDF",
    description:
      "Convert PDF documents to high-resolution JPG images in your browser. 100% private with zero server uploads.",
    url: "https://gopdf.tech/pdf-to-jpg/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF PDF to JPG Tool - Convert PDF pages to images privately",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert PDF to JPG Online Free | GoPDF",
    description:
      "Convert PDF pages to crisp JPG photos with zero cloud uploads. 100% client-side memory execution.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const PDF_TO_JPG_FAQS = [
  {
    question: "How do I convert PDF pages to JPG images for free?",
    answer:
      "Upload your PDF to GoPDF, select the pages you want to convert (or keep All Pages selected), choose your preferred DPI resolution, and click 'Convert to JPG'. You can download individual page photos or save all images as a unified .ZIP archive.",
  },
  {
    question: "Can I download all converted pages in a single ZIP file?",
    answer:
      "Yes! GoPDF includes a built-in 'Download All as ZIP (.zip)' button that packages every converted page image into one convenient archive with zero server delays.",
  },
  {
    question: "Are my confidential PDF documents uploaded to a remote server?",
    answer:
      "Never. All page rendering executes locally inside your web browser using HTML5 Canvas and WebAssembly. Your documents stay 100% private in local device RAM.",
  },
];

const PDF_TO_JPG_STEPS = [
  {
    name: "Upload your PDF",
    text: "Drop your PDF file into the secure dropzone to inspect pages.",
  },
  {
    name: "Configure quality",
    text: "Choose Standard or HD resolution and select specific pages if desired.",
  },
  {
    name: "Download images or ZIP",
    text: "Download single pictures or click Download All as ZIP to save all pages.",
  },
];

export default function PdfToJpgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF PDF to JPG Converter"
        description="Convert PDF pages to high-resolution JPG images online in your browser. Fast, private, and 100% client-side."
        url="https://gopdf.tech/pdf-to-jpg/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "PDF to JPG", item: "https://gopdf.tech/pdf-to-jpg/" },
        ]}
      />
      <FaqJsonLd faqs={PDF_TO_JPG_FAQS} />
      <HowToJsonLd
        name="How to Convert PDF to JPG Online Free"
        description="A step-by-step guide to converting PDF pages to JPG images in your browser without cloud uploads."
        steps={PDF_TO_JPG_STEPS}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Convert PNG to PDF Online Free – Crisp & Transparent Support",
  description:
    "Convert PNG graphics, screenshots, and diagrams to PDF online. Preserve transparent backgrounds and sharp vector clarity with zero server uploads.",
  alternates: {
    canonical: "https://gopdf.tech/png-to-pdf/",
  },
  openGraph: {
    title: "Convert PNG to PDF Online Free | GoPDF",
    description:
      "Convert PNG images to PDF online in your browser. 100% private, free, and lossless client-side execution.",
    url: "https://gopdf.tech/png-to-pdf/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF PNG to PDF Tool - Convert PNG screenshots to PDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert PNG to PDF Online Free | GoPDF",
    description:
      "Convert PNG graphics and screenshots to PDF documents in your browser with zero cloud uploads.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const PNG_FAQS = [
  {
    question: "How do I convert PNG screenshots to PDF for free?",
    answer:
      "Upload your PNG images to GoPDF, adjust sequence and page margins if needed, and click 'Convert to PDF'. The PDF is assembled in browser memory without sending files over the web.",
  },
  {
    question: "Does converting PNG to PDF preserve transparent backgrounds?",
    answer:
      "Yes. Transparent PNG graphics are composited onto clean white document pages so your logos and UI mockups look crisp and readable.",
  },
  {
    question: "Can I combine multiple PNGs into one single PDF?",
    answer:
      "Absolutely. You can add dozens of PNG graphics or screenshots and compile them into a unified multi-page document.",
  },
];

const PNG_STEPS = [
  {
    name: "Upload PNG screenshots",
    text: "Drag and drop your PNG graphics into the browser workspace.",
  },
  {
    name: "Reorder and configure",
    text: "Set page margins and orientation to suit your mockups.",
  },
  {
    name: "Save PDF",
    text: "Download your unified PDF immediately with zero cloud latency.",
  },
];

export default function PngToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF PNG to PDF Converter"
        description="Convert PNG graphics and screenshots to PDF online. Fast, private, and 100% client-side."
        url="https://gopdf.tech/png-to-pdf/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "PNG to PDF", item: "https://gopdf.tech/png-to-pdf/" },
        ]}
      />
      <FaqJsonLd faqs={PNG_FAQS} />
      <HowToJsonLd
        name="How to Convert PNG Images to PDF Online Free"
        description="A step-by-step guide to converting PNG screenshots and graphics to PDF in your browser."
        steps={PNG_STEPS}
      />
      {children}
    </>
  );
}

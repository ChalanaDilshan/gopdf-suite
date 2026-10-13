import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Reorder PDF Pages – Organize & Sort PDF Free",
  description:
    "Rearrange PDF pages visually with drag-and-drop. Change page sequence, rotate or delete sheets directly in your browser. 100% free & private.",
  alternates: {
    canonical: "https://gopdf.tech/reorder-pdf-pages/",
  },
  openGraph: {
    title: "Reorder PDF Pages – Organize & Sort PDF Free | GoPDF",
    description:
      "Drag and drop to rearrange PDF pages in custom sequence with live visual thumbnails. 100% client-side with zero server uploads.",
    url: "https://gopdf.tech/reorder-pdf-pages/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF Reorder PDF Pages Tool - Rearrange PDF pages visually with drag and drop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reorder PDF Pages – Organize & Sort PDF Free | GoPDF",
    description:
      "Rearrange PDF page sequence with smooth drag-and-drop. 100% in-browser processing.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const REORDER_FAQS = [
  {
    question: "How do I rearrange or reorder pages in a PDF for free?",
    answer:
      "Upload your PDF to GoPDF, hover over any page card, and drag the grip handle or thumbnail to move it to your desired position. Once you are satisfied with the sequence, click 'Save & Download Reordered PDF' to export your updated document immediately.",
  },
  {
    question: "Can I rotate or delete pages while reordering them?",
    answer:
      "Yes. GoPDF's unified workspace allows you to reorder, rotate 90/180/270 degrees, and delete unwanted sheets in the same interactive session before exporting.",
  },
  {
    question: "Is drag-and-drop page reordering permanent in the downloaded PDF?",
    answer:
      "Yes. The export engine uses pdf-lib to physically assemble the new PDF document according to your custom page sequence. The resulting file preserves your custom order across all PDF viewers and printers.",
  },
  {
    question: "Are my files uploaded to a remote server when reordering pages?",
    answer:
      "No. All page thumbnail rendering and PDF restructuring occur strictly in your local device memory using WebAssembly. Your files are never transmitted to cloud servers or stored externally.",
  },
];

const REORDER_STEPS = [
  {
    name: "Upload your PDF",
    text: "Drop your PDF into the secure browser dropzone to render interactive visual page cards.",
  },
  {
    name: "Drag & drop pages",
    text: "Drag page thumbnails into your preferred sequence. You can also rotate or delete pages at the same time.",
  },
  {
    name: "Save and download",
    text: "Click 'Save & Download Reordered PDF' to compile your restructured document with zero waiting.",
  },
];

export default function ReorderPdfPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF Reorder PDF Pages"
        description="Rearrange and organize PDF pages visually with drag-and-drop in your browser with zero server uploads."
        url="https://gopdf.tech/reorder-pdf-pages/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "Reorder PDF Pages", item: "https://gopdf.tech/reorder-pdf-pages/" },
        ]}
      />
      <FaqJsonLd faqs={REORDER_FAQS} />
      <HowToJsonLd
        name="How to Reorder PDF Pages Online"
        description="A complete guide to rearranging PDF pages with drag-and-drop visual thumbnails directly in your web browser."
        steps={REORDER_STEPS}
      />
      {children}
    </>
  );
}

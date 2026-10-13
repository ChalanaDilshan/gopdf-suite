import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Reorder PDF Pages Online - Rearrange Pages for Free & 100% Private",
  description:
    "Drag and drop to rearrange PDF pages in custom order. Visually rotate or delete unwanted pages in the same workspace. 100% free with zero server uploads.",
  keywords: [
    "reorder PDF pages",
    "rearrange PDF pages",
    "reorder PDF online",
    "change PDF page order",
    "organize PDF pages",
    "client-side PDF reorder",
    "drag and drop PDF pages",
    "GoPDF reorder",
  ],
  alternates: {
    canonical: "https://gopdf.tech/reorder-pdf-pages/",
  },
  openGraph: {
    title: "Reorder PDF Pages Online - Rearrange Pages for Free & 100% Private | GoPDF",
    description:
      "Drag and drop to rearrange PDF pages in custom sequence with live visual thumbnails. 100% client-side with zero server uploads.",
    url: "https://gopdf.tech/reorder-pdf-pages/",
    siteName: "GoPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reorder PDF Pages Online - Rearrange Pages for Free | GoPDF",
    description:
      "Rearrange PDF page sequence with smooth drag-and-drop. 100% in-browser processing.",
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

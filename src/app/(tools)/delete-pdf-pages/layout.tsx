import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Delete Pages from PDF – Free Page Remover",
  description:
    "Remove unwanted pages from PDF files with visual thumbnails and one-click undo. 100% free with zero server uploads.",
  alternates: {
    canonical: "https://gopdf.tech/delete-pdf-pages/",
  },
  openGraph: {
    title: "Delete Pages from PDF – Free Page Remover | GoPDF",
    description:
      "Remove unwanted pages from your PDF with visual previews and instant undo. 100% client-side with zero server uploads.",
    url: "https://gopdf.tech/delete-pdf-pages/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF Delete PDF Pages Tool - Remove pages from PDF documents privately",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete Pages from PDF – Free Page Remover | GoPDF",
    description:
      "Delete unwanted PDF pages with instant visual previews and zero server uploads.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const DELETE_FAQS = [
  {
    question: "How do I delete pages from a PDF for free?",
    answer:
      "Upload your document to GoPDF, hover or view the page cards, and click the trash icon on any pages you wish to remove. Then click 'Save & Download Clean PDF' to receive your new file without the deleted pages.",
  },
  {
    question: "Can I undo or restore a page if I deleted it by mistake?",
    answer:
      "Yes. When you delete a page, it is marked with a diagonal strike-through and a red indicator. Click the 'Restore' button on any deleted page or use 'Reset All' at any point before exporting to recover them instantly.",
  },
  {
    question: "Does deleting pages reduce the overall PDF file size?",
    answer:
      "Yes. The export engine extracts and copies only the retained pages into a fresh, optimized PDF document. All graphics, text streams, and resources belonging exclusively to deleted pages are discarded, resulting in a smaller file.",
  },
  {
    question: "Is client-side page deletion safe for confidential files?",
    answer:
      "Yes, 100%. Processing is executed strictly inside your local browser sandbox via WebAssembly and HTML5 Canvas. Your documents never touch external cloud servers, ensuring complete compliance and privacy.",
  },
];

const DELETE_STEPS = [
  {
    name: "Upload your PDF",
    text: "Drop your PDF file into the secure dropzone to generate instant visual page previews in your browser.",
  },
  {
    name: "Select pages to remove",
    text: "Click the trash icon on unwanted pages to mark them for deletion. You can restore any page with one click.",
  },
  {
    name: "Save and download",
    text: "Click 'Save & Download Clean PDF' to compile your new document without the deleted pages immediately.",
  },
];

export default function DeletePdfPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF Delete PDF Pages"
        description="Delete and remove unwanted PDF pages online with instant visual thumbnails."
        url="https://gopdf.tech/delete-pdf-pages/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "Delete PDF Pages", item: "https://gopdf.tech/delete-pdf-pages/" },
        ]}
      />
      <FaqJsonLd faqs={DELETE_FAQS} />
      <HowToJsonLd
        name="How to Delete Pages from a PDF Online"
        description="A complete guide to removing unwanted pages from PDF files with visual thumbnails and instant undo directly in your web browser."
        steps={DELETE_STEPS}
      />
      {children}
    </>
  );
}

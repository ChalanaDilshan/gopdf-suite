import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Edit PDF Online – Edit Existing Text Free",
  description:
    "Edit existing PDF text directly in your browser. Modify words, type new text, and delete sentences with matching fonts and zero cloud uploads.",
  alternates: {
    canonical: "https://gopdf.tech/edit-pdf/",
  },
  openGraph: {
    title: "Edit PDF Online – Edit Existing Text Free | GoPDF",
    description:
      "Edit existing text in your PDF directly in your browser. Matching fonts, sizes, and colors with zero server uploads.",
    url: "https://gopdf.tech/edit-pdf/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF Edit PDF Tool - Edit existing text in PDF files privately",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edit PDF Online – Edit Existing Text Free | GoPDF",
    description:
      "Click to edit, replace, or delete existing PDF text with matching fonts directly in your browser.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const EDIT_FAQS = [
  {
    question: "Can I edit existing text in a PDF directly online for free?",
    answer:
      "Yes! GoPDF extracts text layer bounding boxes using pdfjs-dist and overlays interactive editable blocks. You can click on any text to modify words, change font colors, delete unwanted sentences, or add brand-new text blocks directly in your browser.",
  },
  {
    question: "How does GoPDF match the original font and styling?",
    answer:
      "Our intelligent fontMatcher engine analyzes raw font metrics, weights, and styles (Serif, Sans-serif, Monospace, Bold, Italic) extracted from the PDF, automatically mapping them to the closest standard PDF typography (Helvetica, Times Roman, Courier).",
  },
  {
    question: "Are my documents uploaded to external servers?",
    answer:
      "Never. The entire editing, whiteout redaction, and re-stamping process runs 100% locally in your device's RAM memory using WebAssembly. Your files never leave your computer.",
  },
  {
    question: "How do I save and export my edited PDF?",
    answer:
      "When you're finished making edits, click 'Export & Download PDF'. GoPDF executes an in-memory redaction pass to white out modified regions and stamps your new text in place, downloading a crisp, updated PDF file instantly.",
  },
];

const EDIT_STEPS = [
  {
    name: "Upload your PDF",
    text: "Drop any PDF document into the GoPDF editor. The file is analyzed strictly within your local browser memory.",
  },
  {
    name: "Click and Edit Text",
    text: "Hover over any text block on the page, click to activate the inline editor, and type your changes or delete text.",
  },
  {
    name: "Export & Download",
    text: "Click 'Export & Download PDF' to apply in-memory whiteouts and stamp your replacement text into a clean new document.",
  },
];

export default function EditPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF Edit PDF"
        description="Edit existing text in PDF documents online in your browser with zero server uploads."
        url="https://gopdf.tech/edit-pdf/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "Edit PDF", item: "https://gopdf.tech/edit-pdf/" },
        ]}
      />
      <FaqJsonLd faqs={EDIT_FAQS} />
      <HowToJsonLd
        name="How to Edit PDF Text Online with GoPDF"
        description="Step-by-step guide to editing, modifying, and deleting existing text inside a PDF document client-side."
        steps={EDIT_STEPS}
      />
      {children}
    </>
  );
}

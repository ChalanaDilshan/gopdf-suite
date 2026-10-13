import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Rotate PDF Online - Free, Permanent & 100% Private",
  description:
    "Rotate PDF pages 90, 180, or 270 degrees clockwise or counter-clockwise. Instant visual preview, zero file uploads, 100% free client-side processing.",
  keywords: [
    "rotate PDF",
    "rotate PDF pages online",
    "rotate PDF permanently",
    "free PDF rotator",
    "turn PDF pages",
    "client-side rotate PDF",
    "rotate PDF 90 degrees",
    "GoPDF rotate",
  ],
  alternates: {
    canonical: "https://gopdf.tech/rotate-pdf/",
  },
  openGraph: {
    title: "Rotate PDF Online - Free, Permanent & 100% Private | GoPDF",
    description:
      "Rotate PDF pages clockwise or counter-clockwise with instant visual feedback. 100% client-side with zero server uploads.",
    url: "https://gopdf.tech/rotate-pdf/",
    siteName: "GoPDF",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate PDF Online - Free, Permanent & 100% Private | GoPDF",
    description:
      "Rotate PDF pages with instant 60fps visual previews. Zero server uploads.",
  },
};

const ROTATE_FAQS = [
  {
    question: "How do I rotate PDF pages for free?",
    answer:
      "Upload your PDF to GoPDF, preview every page thumbnail, and click the clockwise or counter-clockwise rotate buttons on individual pages or use 'Rotate All Clockwise'. Click 'Save & Download Rotated PDF' to download your updated document instantly.",
  },
  {
    question: "Is the page rotation permanent in the downloaded PDF?",
    answer:
      "Yes. GoPDF updates the underlying PDF rotation dictionary using pdf-lib directly in your browser. The rotation remains permanent in Adobe Acrobat, Apple Preview, Chrome, mobile readers, and physical printouts.",
  },
  {
    question: "Can I rotate individual pages without changing the whole document?",
    answer:
      "Absolutely. Each page card features dedicated clockwise and counter-clockwise rotation buttons, allowing you to rotate specific pages (e.g. landscape diagrams or upside-down scans) without altering other pages.",
  },
  {
    question: "Are my files uploaded to a remote server when rotating PDF pages?",
    answer:
      "No. All thumbnail generation and PDF restructuring happen strictly within your local browser memory using WebAssembly and client-side JavaScript. Your files never touch external servers or cloud storage.",
  },
];

const ROTATE_STEPS = [
  {
    name: "Upload your PDF",
    text: "Drag and drop your PDF into the secure browser dropzone to generate instant visual page thumbnails.",
  },
  {
    name: "Rotate pages visually",
    text: "Click the rotate buttons on individual page cards or click 'Rotate All Clockwise' to adjust all pages at once.",
  },
  {
    name: "Save and download",
    text: "Click 'Save & Download Rotated PDF' to permanently compile your transformed PDF and download it with zero wait time.",
  },
];

export default function RotatePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FaqJsonLd faqs={ROTATE_FAQS} />
      <HowToJsonLd
        name="How to Rotate PDF Pages Online"
        description="A step-by-step guide to rotating PDF pages permanently in your web browser with zero server uploads."
        steps={ROTATE_STEPS}
      />
      {children}
    </>
  );
}

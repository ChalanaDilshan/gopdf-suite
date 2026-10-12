import type { Metadata } from "next";
import MergePdfPage from "@/app/(tools)/merge-pdf/page";
import { FaqJsonLd, HowToJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "GoPDF - 100% Client-Side PDF Utilities & Micro-Tools",
  description:
    "Combine, split, and manage PDF documents directly in your browser. 100% free, zero server uploads, completely private, and ultra-fast client-side processing.",
  alternates: {
    canonical: "https://gopdf.tech/",
  },
};

const HOME_FAQS = [
  {
    question: "Is GoPDF free to use?",
    answer: "Yes, GoPDF is 100% free with no subscription, watermark, or file quantity limits.",
  },
  {
    question: "Are my documents uploaded to any remote server?",
    answer: "No. All PDF processing is executed 100% in your local browser sandbox via WebAssembly and Web Workers. Your documents never touch a remote server.",
  },
  {
    question: "Can I use GoPDF on mobile devices?",
    answer: "Yes, GoPDF is fully mobile-responsive and works smoothly on modern smartphone and tablet browsers.",
  },
];

const HOME_STEPS = [
  {
    name: "Upload your PDFs",
    text: "Select or drop your PDF documents into the browser dropzone.",
  },
  {
    name: "Organize files",
    text: "Rearrange files in your preferred sequence with instant drag-and-drop.",
  },
  {
    name: "Merge instantly",
    text: "Process and download your combined document locally in seconds.",
  },
];

export default function HomePage() {
  return (
    <>
      <FaqJsonLd faqs={HOME_FAQS} />
      <HowToJsonLd
        name="How to Combine PDF Documents Securely"
        description="Learn how to merge and manage PDF documents locally in your web browser with zero server uploads."
        steps={HOME_STEPS}
      />
      <MergePdfPage />
    </>
  );
}

import type { Metadata } from "next";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "GoPDF Features – Complete Client-Side PDF Tools",
  description:
    "Explore all GoPDF features: merge multiple files, extract page ranges, rotate, delete sheets, and reorder pages with 100% in-browser privacy.",
  alternates: {
    canonical: "https://gopdf.tech/features/",
  },
  openGraph: {
    title: "GoPDF Features – Complete Client-Side PDF Tools | GoPDF",
    description:
      "Explore GoPDF's 100% client-side PDF capabilities: merge, split, rotate, delete, and reorder pages with zero cloud uploads.",
    url: "https://gopdf.tech/features/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF Features - Client-Side PDF manipulation capabilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoPDF Features – Complete Client-Side PDF Tools | GoPDF",
    description:
      "Merge, split, rotate, delete, and reorder PDF pages directly in your browser. 100% private, 0s latency.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const FEATURES_FAQS = [
  {
    question: "What PDF operations can GoPDF perform?",
    answer:
      "GoPDF provides a full suite of client-side PDF micro-tools: merging multiple documents in custom order, splitting and extracting custom page ranges (e.g. 1-3, 5), rotating pages clockwise and counter-clockwise at 60fps, deleting unwanted sheets with 1-click undo, and drag-and-drop page reordering.",
  },
  {
    question: "Do any features require paying or creating an account?",
    answer:
      "No. All GoPDF tools and features are 100% free with no account creation, no subscriptions, no file count restrictions, and no watermarks.",
  },
  {
    question: "How does GoPDF achieve 60fps preview rotations without lag?",
    answer:
      "GoPDF decouples visual preview rendering from PDF generation. Page thumbnails are rendered into memory once, and rotations apply instant hardware-accelerated CSS transforms. The internal PDF geometry dictionary is updated during export via pdf-lib.",
  },
  {
    question: "Can I combine multiple actions like reordering, rotating, and deleting in one step?",
    answer:
      "Yes. The GoPDF Page Studio allows you to reorder pages, rotate individual orientations, and delete unwanted sheets all within the same session before saving your output document.",
  },
];

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "Features", item: "https://gopdf.tech/features/" },
        ]}
      />
      <FaqJsonLd faqs={FEATURES_FAQS} />
      {children}
    </>
  );
}

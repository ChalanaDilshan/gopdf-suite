import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Convert JPG to PDF Online Free – Fast & Private",
  description:
    "Convert JPG and JPEG images to PDF online directly in your browser. Reorder photos, adjust orientation and margins with zero server uploads.",
  alternates: {
    canonical: "https://gopdf.tech/jpg-to-pdf/",
  },
  openGraph: {
    title: "Convert JPG to PDF Online Free | GoPDF",
    description:
      "Convert JPG images to PDF in your web browser. 100% private, free, with zero server uploads.",
    url: "https://gopdf.tech/jpg-to-pdf/",
    siteName: "GoPDF",
    type: "website",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF JPG to PDF Tool - Convert images to PDF privately",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert JPG to PDF Online Free | GoPDF",
    description:
      "Convert JPG and JPEG photos to clean PDF documents in your browser. 100% client-side memory execution.",
    images: ["https://gopdf.tech/og-image.png"],
  },
};

const JPG_FAQS = [
  {
    question: "How do I convert JPG images to PDF online for free?",
    answer:
      "Drop your JPG or JPEG images into GoPDF, rearrange them in your desired order, select your preferred page size and margin, and click 'Convert to PDF'. The file is compiled entirely in your browser memory and downloads instantly.",
  },
  {
    question: "Can I convert multiple JPG photos into a single PDF?",
    answer:
      "Yes. You can select and drag dozens of photos at once. GoPDF compiles them into a single, multi-page document with full native image clarity.",
  },
  {
    question: "Are my photos uploaded to any external server?",
    answer:
      "No. All image processing and PDF creation take place inside your device RAM sandbox using client-side JavaScript. Your photos never leave your device.",
  },
  {
    question: "Can I adjust the orientation or margins of the converted pages?",
    answer:
      "Yes! GoPDF offers Auto, Portrait, and Landscape orientation, as well as A4, US Letter, and Fit-to-Image dimensions with borderless or padded margins.",
  },
];

const JPG_STEPS = [
  {
    name: "Upload JPG files",
    text: "Drag and drop your JPG or JPEG photos into the secure dropzone.",
  },
  {
    name: "Organize and configure",
    text: "Arrange page order, rotate orientations, and choose page format and margins.",
  },
  {
    name: "Convert and download",
    text: "Click Convert to PDF to compile your photos into a single PDF document instantly.",
  },
];

export default function JpgToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SoftwareApplicationJsonLd
        name="GoPDF JPG to PDF Converter"
        description="Convert JPG images to PDF documents online in your browser. Fast, private, and 100% client-side."
        url="https://gopdf.tech/jpg-to-pdf/"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "https://gopdf.tech/" },
          { name: "JPG to PDF", item: "https://gopdf.tech/jpg-to-pdf/" },
        ]}
      />
      <FaqJsonLd faqs={JPG_FAQS} />
      <HowToJsonLd
        name="How to Convert JPG Images to PDF Online Free"
        description="A step-by-step guide to converting JPG photos to PDF documents in your browser without cloud uploads."
        steps={JPG_STEPS}
      />
      {children}
    </>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { WebApplicationJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gopdf.tech"),
  title: {
    template: "%s | GoPDF",
    default: "GoPDF - 100% Client-Side PDF Utilities & Micro-Tools",
  },
  description:
    "Lightning-fast, private client-side PDF utilities. Merge, split, compress, and edit PDF documents directly in your browser without uploading files to remote servers.",
  keywords: [
    "gopdf",
    "GoPDF",
    "PDF tools",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "client-side PDF",
    "secure PDF editor",
    "zero upload PDF",
  ],
  authors: [{ name: "GoPDF Team" }],
  creator: "GoPDF",
  publisher: "GoPDF",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://gopdf.tech/",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gopdf.tech/",
    siteName: "GoPDF",
    title: "GoPDF - 100% Client-Side PDF Utilities & Micro-Tools",
    description:
      "Merge, split, and edit PDF files in your browser with zero server uploads and total privacy.",
    images: [
      {
        url: "https://gopdf.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoPDF - Fast, Private, 100% Client-Side PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoPDF - 100% Client-Side PDF Utilities & Micro-Tools",
    description:
      "Merge, split, and edit PDF files in your browser with zero server uploads and total privacy.",
    images: ["https://gopdf.tech/og-image.png"],
  },
  verification: {
    google: "google3d9a71f5f41ec47e",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <WebApplicationJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#f4f7fb] text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 flex flex-col min-h-screen transition-colors duration-150">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

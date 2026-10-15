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
    default: "GoPDF – Free & Private Client-Side PDF Tools",
  },
  description:
    "Lightning-fast, private client-side PDF utilities. Merge, split, compress, and edit PDF documents directly in your browser without uploading files to remote servers.",
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
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gopdf.tech/",
    siteName: "GoPDF",
    title: "GoPDF – Free & Private Client-Side PDF Tools",
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
    title: "GoPDF – Free & Private Client-Side PDF Tools",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://gopdf.tech/#website",
        name: "GoPDF",
        alternateName: ["GoPDF Tech", "gopdf.tech"],
        url: "https://gopdf.tech/",
      },
      {
        "@type": "Organization",
        "@id": "https://gopdf.tech/#organization",
        name: "GoPDF",
        url: "https://gopdf.tech/",
        logo: {
          "@type": "ImageObject",
          url: "https://gopdf.tech/icon-512.png",
          width: 512,
          height: 512,
        },
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <WebApplicationJsonLd />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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

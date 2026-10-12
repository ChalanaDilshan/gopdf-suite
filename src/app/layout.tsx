import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
  metadataBase: new URL("https://gopdf.app"),
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gopdf.app",
    siteName: "GoPDF",
    title: "GoPDF - 100% Client-Side PDF Utilities & Micro-Tools",
    description:
      "Merge, split, and edit PDF files in your browser with zero server uploads and total privacy.",
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

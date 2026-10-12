import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GoPDF - 100% Client-Side PDF Utilities & Micro-Tools",
    short_name: "GoPDF",
    description: "Combine, split, and manage PDF documents directly in your browser with zero server uploads and total privacy.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

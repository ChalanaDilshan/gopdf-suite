import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://gopdf.tech/sitemap.xml",
    host: "https://gopdf.tech",
  };
}

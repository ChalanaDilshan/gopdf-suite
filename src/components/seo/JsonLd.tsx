import React from "react";
import { SoftwareApplicationJsonLdProps, FaqItem } from "@/types";

/**
 * JSON-LD Schema for SoftwareApplication (ideal for micro-tools & utilities)
 */
export function SoftwareApplicationJsonLd({
  name,
  description,
  url,
  applicationCategory = "UtilitiesApplication",
  operatingSystem = "Web Browser (Chrome, Safari, Firefox, Edge)",
  browserRequirements = "Requires JavaScript. Requires HTML5.",
  offers = {
    price: "0",
    priceCurrency: "USD",
  },
}: SoftwareApplicationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    browserRequirements,
    offers: {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * JSON-LD Schema for FAQPage (boosts Google Rich Results visibility)
 */
export function FaqPageJsonLd({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

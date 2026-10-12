export interface UploadedPdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  lastModified: number;
  previewUrl?: string;
  pageCount?: number;
}

export interface HowToStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ToolFeature {
  title: string;
  description: string;
  iconName?: string;
}

export interface ToolMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: "organize" | "convert" | "security" | "edit";
  badgeText?: string;
  icon: string;
  popular?: boolean;
}

export interface SoftwareApplicationJsonLdProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
  browserRequirements?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

export interface FaqJsonLdProps {
  mainEntity: Array<{
    question: string;
    answer: string;
  }>;
}

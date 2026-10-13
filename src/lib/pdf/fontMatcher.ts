import { StandardFonts, rgb, RGB } from "pdf-lib";

export interface MatchedFontInfo {
  standardFont: StandardFonts;
  cssFontFamily: string;
  isBold: boolean;
  isItalic: boolean;
}

/**
 * Heuristic engine that analyzes raw font names from pdfjs-dist
 * and maps them to standard PDF-1.4 Type 1 core fonts and CSS font families.
 */
export function matchFont(rawFontName: string = "", rawFamily?: string): MatchedFontInfo {
  const combined = `${rawFontName} ${rawFamily || ""}`.toLowerCase();

  const isBold =
    combined.includes("bold") ||
    combined.includes("black") ||
    combined.includes("heavy") ||
    combined.includes("semibold") ||
    combined.includes("demi") ||
    combined.includes("w7") ||
    combined.includes("w8") ||
    combined.includes("w9");

  const isItalic =
    combined.includes("italic") ||
    combined.includes("oblique") ||
    combined.includes("slant") ||
    combined.includes("inclined");

  const isMonospace =
    combined.includes("courier") ||
    combined.includes("mono") ||
    combined.includes("console") ||
    combined.includes("fixed") ||
    combined.includes("menlo") ||
    combined.includes("monaco") ||
    combined.includes("source code");

  const isSerif =
    !isMonospace &&
    (combined.includes("times") ||
      combined.includes("georgia") ||
      combined.includes("garamond") ||
      combined.includes("cambria") ||
      combined.includes("serif") ||
      combined.includes("roman") ||
      combined.includes("baskerville") ||
      combined.includes("palatino") ||
      combined.includes("century") ||
      combined.includes("bookman"));

  // 1. Monospace Family
  if (isMonospace) {
    if (isBold && isItalic) {
      return {
        standardFont: StandardFonts.CourierBoldOblique,
        cssFontFamily: '"Courier New", Courier, monospace',
        isBold: true,
        isItalic: true,
      };
    }
    if (isBold) {
      return {
        standardFont: StandardFonts.CourierBold,
        cssFontFamily: '"Courier New", Courier, monospace',
        isBold: true,
        isItalic: false,
      };
    }
    if (isItalic) {
      return {
        standardFont: StandardFonts.CourierOblique,
        cssFontFamily: '"Courier New", Courier, monospace',
        isBold: false,
        isItalic: true,
      };
    }
    return {
      standardFont: StandardFonts.Courier,
      cssFontFamily: '"Courier New", Courier, monospace',
      isBold: false,
      isItalic: false,
    };
  }

  // 2. Serif Family
  if (isSerif) {
    if (isBold && isItalic) {
      return {
        standardFont: StandardFonts.TimesRomanBoldItalic,
        cssFontFamily: '"Times New Roman", Times, Georgia, serif',
        isBold: true,
        isItalic: true,
      };
    }
    if (isBold) {
      return {
        standardFont: StandardFonts.TimesRomanBold,
        cssFontFamily: '"Times New Roman", Times, Georgia, serif',
        isBold: true,
        isItalic: false,
      };
    }
    if (isItalic) {
      return {
        standardFont: StandardFonts.TimesRomanItalic,
        cssFontFamily: '"Times New Roman", Times, Georgia, serif',
        isBold: false,
        isItalic: true,
      };
    }
    return {
      standardFont: StandardFonts.TimesRoman,
      cssFontFamily: '"Times New Roman", Times, Georgia, serif',
      isBold: false,
      isItalic: false,
    };
  }

  // 3. Sans-Serif Family (Helvetica / Arial / Default)
  if (isBold && isItalic) {
    return {
      standardFont: StandardFonts.HelveticaBoldOblique,
      cssFontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif',
      isBold: true,
      isItalic: true,
    };
  }
  if (isBold) {
    return {
      standardFont: StandardFonts.HelveticaBold,
      cssFontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif',
      isBold: true,
      isItalic: false,
    };
  }
  if (isItalic) {
    return {
      standardFont: StandardFonts.HelveticaOblique,
      cssFontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif',
      isBold: false,
      isItalic: true,
    };
  }
  return {
    standardFont: StandardFonts.Helvetica,
    cssFontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif',
    isBold: false,
    isItalic: false,
  };
}

/**
 * Converts a CSS hex color code (e.g. #000000 or #1e293b) to pdf-lib RGB color.
 */
export function hexToPdfRgb(hexColor: string = "#000000"): RGB {
  let hex = hexColor.replace("#", "").trim();
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length !== 6) {
    return rgb(0, 0, 0);
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return rgb(
    isNaN(r) ? 0 : r,
    isNaN(g) ? 0 : g,
    isNaN(b) ? 0 : b
  );
}

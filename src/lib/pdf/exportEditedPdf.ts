import { PDFDocument, rgb, PDFFont, StandardFonts } from "pdf-lib";
import { EditableTextBlock } from "@/hooks/usePdfTextLayer";
import { matchFont, hexToPdfRgb } from "@/lib/pdf/fontMatcher";

export interface ExportEditedPdfOptions {
  originalArrayBuffer: ArrayBuffer;
  editedPages: Record<number, EditableTextBlock[]>;
  currentScale: number;
}

/**
 * Loads the original PDF into pdf-lib, applies whiteout masks over
 * modified or deleted text blocks, stamps the updated text in matching fonts,
 * and serializes the new PDF document.
 */
export async function exportEditedPdf({
  originalArrayBuffer,
  editedPages,
  currentScale,
}: ExportEditedPdfOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(originalArrayBuffer, {
    ignoreEncryption: false,
  });

  const fontCache = new Map<StandardFonts, PDFFont>();

  const getOrEmbedFont = async (standardFont: StandardFonts): Promise<PDFFont> => {
    let font = fontCache.get(standardFont);
    if (!font) {
      font = await pdfDoc.embedFont(standardFont);
      fontCache.set(standardFont, font);
    }
    return font;
  };

  const totalPages = pdfDoc.getPageCount();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const blocks = editedPages[pageNum];
    if (!blocks || blocks.length === 0) continue;

    const page = pdfDoc.getPage(pageNum - 1);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    for (const block of blocks) {
      const isModified =
        !block.isDeleted && block.currentText !== block.originalText;
      const isDeleted = block.isDeleted;
      const isCustom = block.isCustom && !block.isDeleted;

      // Only process blocks that were actually changed or deleted
      if (!isModified && !isDeleted && !isCustom) continue;

      const unscaledFontSize = Math.max(
        6,
        block.fontSize / (currentScale || 1)
      );
      const unscaledWidth = Math.max(
        8,
        block.width / (currentScale || 1)
      );
      const unscaledHeight = Math.max(
        unscaledFontSize * 1.25,
        block.height / (currentScale || 1)
      );

      // 1. Redaction / Whiteout Mask (if original text existed)
      if (!block.isCustom) {
        // In PDF coordinate space: pdfY is the baseline.
        // Descent extends below baseline by ~25% of font size.
        const rectX = Math.max(0, block.pdfX - 1.5);
        const rectY = Math.max(0, block.pdfY - unscaledFontSize * 0.28);
        const rectWidth = Math.min(pageWidth - rectX, unscaledWidth + 3);
        const rectHeight = Math.min(pageHeight - rectY, unscaledHeight + 3);

        page.drawRectangle({
          x: rectX,
          y: rectY,
          width: rectWidth,
          height: rectHeight,
          color: rgb(1, 1, 1), // Opaque whiteout mask
        });
      }

      // 2. Stamp New Replacement Text (if not deleted and not blank)
      if (!isDeleted && block.currentText.trim() !== "") {
        const fontInfo = matchFont(block.fontFamily);
        const embeddedFont = await getOrEmbedFont(fontInfo.standardFont);
        const textColor = hexToPdfRgb(block.color);

        try {
          // Sanitize non-WinAnsi characters to prevent pdf-lib encoding crash
          const sanitizedText = block.currentText.replace(/[^\x00-\xFF]/g, " ");

          page.drawText(sanitizedText, {
            x: Math.max(0, block.pdfX),
            y: Math.max(0, block.pdfY),
            size: unscaledFontSize,
            font: embeddedFont,
            color: textColor,
          });
        } catch (stampErr) {
          console.warn("Failed to stamp custom text block:", stampErr);
          // Fallback to standard Helvetica if specific font variant failed
          try {
            const fallbackFont = await getOrEmbedFont(StandardFonts.Helvetica);
            page.drawText(block.currentText, {
              x: Math.max(0, block.pdfX),
              y: Math.max(0, block.pdfY),
              size: unscaledFontSize,
              font: fallbackFont,
              color: textColor,
            });
          } catch {
            // Graceful skip
          }
        }
      }
    }
  }

  // Optimize object streams on output
  const modifiedBytes = await pdfDoc.save({ useObjectStreams: true });
  return modifiedBytes;
}

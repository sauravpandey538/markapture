/** Server-only resume text extraction from PDF / Word uploads */

const MAX_TEXT_LENGTH = 24_000;

export async function extractResumeText(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const lower = filename.toLowerCase();

  let text = "";

  if (lower.endsWith(".pdf")) {
    text = await extractPdf(buffer);
  } else if (lower.endsWith(".docx")) {
    text = await extractDocx(buffer);
  } else if (lower.endsWith(".doc")) {
    throw new Error(
      "Legacy .doc files are not supported. Please save as .docx or PDF.",
    );
  } else {
    throw new Error("Unsupported file type. Upload PDF or Word (.docx).");
  }

  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    throw new Error(
      "Could not extract text from resume. Try a text-based PDF.",
    );
  }

  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

async function extractPdf(buffer: Buffer): Promise<string> {
  // Dynamic import kept external via next.config serverComponentsExternalPackages
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text ?? "";
  } finally {
    await parser.destroy();
  }
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value ?? "";
}

import { PdfGateway } from './gateways/pdf.gateway';

export async function generatePdf(pdfGateway: PdfGateway): Promise<Buffer> {
  const pdf = await pdfGateway.generatePage(`<span>Hello</span>`);

  return pdf;
}

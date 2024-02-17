import { PdfGateway } from './gateways/pdf.gateway';

export interface PdfServiceDependencies {
  pdfGateway: PdfGateway;
}

export const pdfService = (dependencies: PdfServiceDependencies) => {
  const { pdfGateway } = dependencies;

  const service = {
    generatePdf: async (content: string): Promise<Buffer> => {
      const pdf = await pdfGateway.generatePage(content);

      return pdf;
    }
  };

  return service;
};

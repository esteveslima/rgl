import { FastifyInstance } from 'fastify/types/instance';

import { PdfServiceDependencies, pdfService } from './pdf.service';
import { PdfGateway } from './gateways/pdf.gateway';

export const pdfController = async (server: FastifyInstance) => {
  const pdfServiceDependencies: PdfServiceDependencies = {
    pdfGateway: await PdfGateway.build({ generatorsPoolSize: 2 })
  };
  const service = pdfService(pdfServiceDependencies);

  server.get('/health', async function (): Promise<any> {
    return { status: 'ok' };
  });

  server.get('/', async function (): Promise<Buffer> {
    server.log.info('Generating PDF');

    try {
      const simulatedPdfContent = `<span>Hello</span>`;
      const response = await service.generatePdf(simulatedPdfContent);
      server.log.info('Generated PDF');
      return response;
    } catch (err) {
      server.log.error(err);
      throw err;
    }
  });
};

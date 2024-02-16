import { FastifyInstance } from 'fastify/types/instance';

import { generatePdf } from './pdf.service';
import { PdfGateway } from './gateways/pdf.gateway';

export const pdfController = async (server: FastifyInstance) => {
  const pdfGateway = await PdfGateway.getInstance();

  server.get('/health', async function (): Promise<any> {
    return { status: 'ok' };
  });

  server.get('/', async function (): Promise<Buffer> {
    server.log.info('Generating PDF');

    try {
      const response = await generatePdf(pdfGateway);
      server.log.info('Generated PDF');
      return response;
    } catch (err) {
      server.log.error(err);
      throw err;
    }
  });
};

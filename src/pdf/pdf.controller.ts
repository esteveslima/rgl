import { FastifyInstance } from 'fastify/types/instance';

import { generatePdf } from './pdf.service';

export const pdfController = (server: FastifyInstance) => {
  server.get('/health', async function (): Promise<any> {
    return { status: 'ok' };
  });

  server.get('/', async function (): Promise<Buffer> {
    server.log.info('Generating PDF');

    try {
      const response = await generatePdf();
      server.log.info('Generated PDF');
      return response;
    } catch (err) {
      server.log.error(err);
      throw err;
    }
  });
};

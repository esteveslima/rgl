import fastify from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import { pdfController } from './pdf/pdf.controller';

const server = fastify({
  logger: true
});
const routes: ((httpServer: FastifyInstance) => Promise<void>)[] = [pdfController];

const listen = async () => {
  await Promise.all(routes.map((route) => route(server)));

  await server.listen({ host: '0.0.0.0', port: 4000 });
  const addresses = server.addresses();
  console.log('http server listening', addresses);
};

export const httpServer = { listen, close: server.close };

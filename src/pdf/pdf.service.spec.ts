import { pdfService } from './pdf.service';

describe('pdfService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('generatePdf', () => {
    it('expect to return the buffer on successful pdf generation', async () => {
      // prepare test parameters
      const content = '';

      // mock dependencies
      const mockPdfGateway = {
        generatePage: jest.fn(() => Promise.resolve(Buffer.from('')))
      };

      // run system under test
      const service = pdfService({ pdfGateway: mockPdfGateway as any });

      const result = await service.generatePdf(content);

      // test assertions
      expect(result).toBeInstanceOf(Buffer);
    });
  });
});

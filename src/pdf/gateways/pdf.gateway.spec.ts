import puppeteer from 'puppeteer';

import { PdfGateway, PdfGatewayConfig } from './pdf.gateway';

jest.mock('puppeteer');

describe('PdfGateway', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('build', () => {
    it('expect to return an instance on successful build', async () => {
      // prepare test parameters
      const pdfGatewayConfig: PdfGatewayConfig = {
        generatorsPoolSize: 1
      };

      // mock dependencies
      jest.spyOn(puppeteer, 'launch').mockResolvedValue(new Object() as any);

      // run system under test
      const result = await PdfGateway.build(pdfGatewayConfig);

      // test assertions
      expect(result).toBeInstanceOf(PdfGateway);
    });

    it('expect to default to a valid pdf generators pool size value', async () => {
      // prepare test parameters
      const pdfGatewayConfig: PdfGatewayConfig = {
        generatorsPoolSize: 0
      };

      // mock dependencies
      const puppeteerLaunchSpy = jest.spyOn(puppeteer, 'launch').mockResolvedValue(new Object() as any);

      // run system under test
      await PdfGateway.build(pdfGatewayConfig);

      // test assertions
      const launchCallsNumber = puppeteerLaunchSpy.mock.calls.length;
      expect(launchCallsNumber).toBeGreaterThan(0);
    });

    it('expect to fill the pdf generators pool to the size requested', async () => {
      // prepare test parameters
      const pdfGatewayConfig: PdfGatewayConfig = {
        generatorsPoolSize: 3
      };

      // mock dependencies
      const puppeteerLaunchSpy = jest.spyOn(puppeteer, 'launch').mockResolvedValue(new Object() as any);

      // run system under test
      await PdfGateway.build(pdfGatewayConfig);

      // test assertions
      expect(puppeteerLaunchSpy).toBeCalledTimes(pdfGatewayConfig.generatorsPoolSize);
    });
  });

  describe('generatePage', () => {
    let mockBrowserPage;
    let mockBrowser;

    function renewBrowserMocks() {
      mockBrowserPage = {
        setContent: jest.fn(),
        emulateMediaType: jest.fn(),
        pdf: jest.fn(() => Buffer.from('')),
        close: jest.fn()
      };
      mockBrowser = {
        newPage: jest.fn(() => mockBrowserPage),
        close: jest.fn()
      };
    }

    beforeEach(() => {
      renewBrowserMocks();
    });

    it('expect to return the buffer on successful pdf generation', async () => {
      // prepare test parameters
      const pdfGatewayConfig: PdfGatewayConfig = {
        generatorsPoolSize: 1
      };
      const content = '';

      // mock dependencies
      jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser as any);

      // run system under test
      const pdfGateway = await PdfGateway.build(pdfGatewayConfig);

      const result = await pdfGateway.generatePage(content);

      // test assertions
      expect(result).toBeInstanceOf(Buffer);
    });

    it('expect to select different pdf generators across different page generations', async () => {
      // prepare test parameters
      const pdfGatewayConfig: PdfGatewayConfig = {
        generatorsPoolSize: 2
      };
      const content = '';

      // mock dependencies
      jest.spyOn(mockBrowser, 'newPage').mockResolvedValue(mockBrowserPage as any);

      const mockBrowser1 = {
        ...mockBrowser,
        newPage: jest.fn().mockResolvedValue(mockBrowserPage)
      };
      const mockBrowser2 = {
        ...mockBrowser,
        newPage: jest.fn().mockResolvedValue(mockBrowserPage)
      };
      jest
        .spyOn(puppeteer, 'launch')
        .mockResolvedValueOnce(mockBrowser1 as any)
        .mockResolvedValueOnce(mockBrowser2 as any);

      // run system under test
      const pdfGateway = await PdfGateway.build(pdfGatewayConfig);

      await pdfGateway.generatePage(content);
      await pdfGateway.generatePage(content);

      // test assertions
      expect(mockBrowser1).not.toBe(mockBrowser2);
      expect(mockBrowser1.newPage).toBeCalledTimes(1);
      expect(mockBrowser2.newPage).toBeCalledTimes(1);
    });

    it('expect to cleanup page after pdf generation', async () => {
      // prepare test parameters
      const pdfGatewayConfig: PdfGatewayConfig = {
        generatorsPoolSize: 1
      };
      const content = '';

      // mock dependencies
      jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockBrowser as any);

      // run system under test
      const pdfGateway = await PdfGateway.build(pdfGatewayConfig);

      await pdfGateway.generatePage(content);

      // test assertions
      const cleanupFunction = mockBrowserPage.close;
      expect(cleanupFunction).toBeCalledTimes(1);
    });
  });
});

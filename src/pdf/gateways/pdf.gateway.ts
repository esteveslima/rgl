import puppeteer, { Browser } from 'puppeteer';

export class PdfGateway {
  private static instance: PdfGateway;
  private static instancesNumber = 0;
  private puppeteerBrowserInstance: Browser;

  private constructor(puppeteerBrowserInstance: Browser) {
    this.puppeteerBrowserInstance = puppeteerBrowserInstance;
  }

  private static async initInstance(): Promise<void> {
    const browser = await puppeteer.launch({
      pipe: true,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const instance = new PdfGateway(browser);
    PdfGateway.instance = instance;
    console.log(`Intialized PdfGateway instance number ${++PdfGateway.instancesNumber}`);
  }

  public static async getInstance(): Promise<PdfGateway> {
    const isInitialized = Boolean(PdfGateway.instance);
    if (!isInitialized) {
      await this.initInstance();
    }

    return PdfGateway.instance;
  }

  //

  public async generatePage(content: string): Promise<Buffer> {
    const page = await this.puppeteerBrowserInstance.newPage();

    await Promise.all([page.setContent(content, { waitUntil: 'networkidle0' }), page.emulateMediaType('screen')]);

    const pdf = await page.pdf({
      format: 'a4',
      printBackground: true
    });

    return pdf;
  }
}

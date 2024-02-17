import puppeteer, { Browser } from 'puppeteer';

export interface PdfGatewayConfig {
  generatorsPoolSize: number;
}

export class PdfGateway {
  private puppeteerBrowsersPool: Browser[] = [];
  private browsersPoolRoundRobinCounter = 0;

  private constructor(puppeteerBrowsersPool: Browser[]) {
    this.puppeteerBrowsersPool = puppeteerBrowsersPool;
  }

  public static async build(config: PdfGatewayConfig): Promise<PdfGateway> {
    const poolSize = config.generatorsPoolSize > 0 ? config.generatorsPoolSize : 1;

    const browsersPool = await Promise.all(
      Array.from(Array(poolSize)).map(() =>
        puppeteer.launch({
          pipe: true,
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
      )
    );
    console.log(`Browsers created: ${poolSize}`);

    return new PdfGateway(browsersPool);
  }

  //

  public async generatePage(content: string): Promise<Buffer> {
    const roundRobinBrowserIndex = this.browsersPoolRoundRobinCounter % (this.puppeteerBrowsersPool.length || 1);
    this.browsersPoolRoundRobinCounter++;
    console.log(`Using browser n#${roundRobinBrowserIndex}`);

    const browser = this.puppeteerBrowsersPool[roundRobinBrowserIndex];
    const page = await browser.newPage();

    await Promise.all([page.setContent(content, { waitUntil: 'networkidle0' }), page.emulateMediaType('screen')]);

    const pdf = await page.pdf({
      format: 'a4',
      printBackground: true
    });

    page.close(); // not awaiting to save time

    return pdf;
  }
}

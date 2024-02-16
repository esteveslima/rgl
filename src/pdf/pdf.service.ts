import puppeteer from 'puppeteer';

export async function generatePdf(): Promise<Buffer> {
  const browser = await puppeteer.launch({
    pipe: true,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setContent(`<span>Hello</span>`, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('screen');

  const pdf = await page.pdf({
    format: 'a4',
    printBackground: true
  });

  await browser.close();

  return pdf;
}

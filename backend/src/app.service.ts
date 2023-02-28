import { Injectable } from '@nestjs/common';
//import puppeteer from 'puppeteer';
import type { Browser, BrowserContext } from 'playwright';
import { InjectBrowser, InjectContext } from 'nestjs-playwright';

@Injectable()
export class AppService {
  constructor(
    @InjectBrowser() private readonly browser: Browser,
    @InjectContext() private readonly browserContext: BrowserContext,
  ) {}

  async getHello(): Promise<void> {
    await (async () => {
      try {
        const page = await this.browserContext.newPage();
        await page.goto('https://auto.ohholding.com.ua/');
        await page.type('#user', 'Azov-Avtotrans');
        await page.type('#passw', '067777023614');
        await page.click('#submit');
        await page.waitForSelector('#hb_mi_monitoring > div > span');
        await page.click('#hb_mi_monitoring > div > span');
        await page
          .locator(`xpath=//span[contains(text(), 'DAF АР 3097 КА Гармаш')]`)
          .nth(0)
          .click();
        //.click('#monitoring_units_custom_name_130153 > span');
        const res = await page.locator(
          `xpath=//div[@id='tooltip']//div[@data-element="speedEl"]`,
        );
        await console.log(res);
        await page.close();
        await this.browserContext.close();
      } catch (e) {}
      ////span[contains(text(), 'DAF AP 9771 IX Калина')]
    })();
  }
}

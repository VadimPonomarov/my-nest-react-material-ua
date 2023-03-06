import { Prisma } from '@prisma/client';
import { _bcrypt } from '../../../src/common/utils';
import { chromium } from 'playwright';
import config from '../../../src/config/configuration';
import { CreateTruckDto } from '../../../src/modules/truck/dto';

export const userAdminData: Prisma.UserCreateInput = {
  name: 'admin',
  email: 'admin@gmail.com',
  password: _bcrypt('12345'),
  activated: true,
};

export const _truckList: () => Promise<CreateTruckDto[]> = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(config().scrapeProvider.goTo);
  await page.type('#user', config().scrapeProvider.logName);
  await page.type('#passw', config().scrapeProvider.pass);
  await page.click('#submit');
  //await page.waitForSelector('#hb_mi_monitoring > div > span');
  await page.locator('#hb_mi_monitoring > div > span').click();
  const trucks = await page
    .locator("xpath=//span[contains(@dir,'auto')]")
    .allInnerTexts();
  await browser.close();
  const _trucksMapped = [];
  trucks.map(
    async (item) =>
      await (item.match('^.*\\d{4}.*$')
        ? _trucksMapped.push({ name: item })
        : false),
  );
  return _trucksMapped;
};

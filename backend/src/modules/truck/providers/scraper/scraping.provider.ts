import {InjectBrowser, InjectContext} from 'nestjs-playwright';
import {Browser, BrowserContext, Page} from 'playwright';
import {Injectable} from '@nestjs/common';
import config from '../../../../config/configuration';
import {TruckEntity} from '../../dto';
import {TruckNamesListDto} from '../../dto';
import {PrismaService} from 'src/core/prisma.service';
import {Cron, CronExpression} from '@nestjs/schedule';
import {TruckService} from '../../truck.service';

@Injectable()
export class ScrapingProvider {
    private page: Page;

    constructor(
        @InjectBrowser() private readonly browser: Browser,
        @InjectContext() private readonly browserContext: BrowserContext,
        private readonly prismaService: PrismaService,
    ) {
    }

    async getPass(): Promise<void> {
        this.page = await this.browserContext.newPage();
        await this.page.setViewportSize(config().scrapeProvider.viewport);
        await this.page.goto(config().scrapeProvider.goTo);
        await this.page.type('#user', config().scrapeProvider.logName);
        await this.page.type('#passw', config().scrapeProvider.pass);
        await this.page.click('#submit');
        await this.page.waitForSelector('#hb_mi_monitoring > div > span');
        await this.page.click('#hb_mi_monitoring > div > span');
    }

    async getTruckListAll(): Promise<Partial<TruckEntity>[]> {
        try {
            await this.page.waitForSelector('#hb_mi_monitoring > div > div');
            await this.page.click('#hb_mi_monitoring > div > div');
            await this.page.waitForSelector(
                '//*[@id="monitoring_units_custom_name_96321"]/span',
            );
            await this.page.click('#monitoring_units_custom_name_96321 > span');
            const trucks = await this.page
                .locator("xpath=//span[contains(@dir,'auto')]")
                .allInnerTexts();
            const _trucksMapped = [];
            trucks.map(
                async (item) =>
                    await (item.match('^.*\\d{4}.*$') ? _trucksMapped.push(item) : false),
            );
            return _trucksMapped;
        } catch (e) {
            console.log(e)
        } finally {
            if (this.page) this.page.close();
        }
    }

    async updateTruckCoordinates(truckList: TruckNamesListDto[]): Promise<void> {
        await this.getPass();
        const arr = [];
        try {
            for (const item of truckList as TruckNamesListDto[]) {
                await this.page
                    .locator(`xpath=//span[contains(text(), "${item.name}")]`)
                    .nth(0)
                    .click()
                    .catch((e) => console.log(e));
                await this.page
                    .waitForSelector(`#tooltip .coordinates .coordinates`)
                    .catch((e) => console.log(e));
                const res = await this.page
                    .$$eval('#tooltip .coordinates .coordinates', (e) =>
                        e.map((item) => item.innerHTML),
                    )
                    .catch((e) => console.log(e));
                const _res = await res[0]
                    .replace('<div>', '')
                    .replace('</div>', ',')
                    .replace('<div>', '')
                    .replace('</div>', ',');
                const [lat, lng] = await _res.split(',');
                const info: { stop: string, tracing: string } = {stop: '', tracing: ''};
                await this.page.locator(`//span[contains(text(), "Бражко")]/../../following-sibling::td[2]/span/span`)
                    .nth(0).getAttribute('class').then(res => info.stop = res.split(/\s+/)[1]);
                await this.page.locator(`//span[contains(text(), "Бражко")]/../../following-sibling::td[4]/span`).nth(0)
                    .getAttribute('class').then(res => info.tracing = res.split(/\s+/)[1]);
                await arr.push({name: item.name, latLng: {lat, lng}});
                await this.prismaService.truck.update({
                    where: {name: item.name},
                    data: {lat, lng, stop: info.stop, tracing: info.tracing},
                });
                await console.log({name: item.name, stop: info.stop, tracing: info.tracing, latLng: {lat, lng}});
            }
        } catch (e) {
            console.log(e)
        } finally {
            if (this.page) this.page.close();
        }
    }

    async updateTruckCodes(truckList: TruckNamesListDto[]): Promise<void> {
        await this.getPass();
        try {
            for (const item of truckList) {
                await this.page
                    .locator(
                        `xpath=//span[contains(text(), "${item.name}")]/../self::div`,
                    )
                    .nth(0)
                    .getAttribute('id')
                    .then(async (id) => {
                        return id.match('\\d{5,7}');
                    })
                    .then(async (code) => {
                        await this.prismaService.truck.update({
                            where: {name: item.name},
                            data: {code: code[0].toString()},
                        });
                    })
                    .catch((e) => console.log('error'));
            }
            return;
        } catch (e) {
            console.log(e);
        } finally {
            if (this.page) this.page.close();
        }
    }
}

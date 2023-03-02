import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {PrismaService} from '../../core/prisma.service';
import {TruckNamesListDto} from './dto';
import {ScrapingProvider} from './providers';

@Injectable()
export class TruckService {
    constructor(
        private prismaService: PrismaService,
        private scrapingProvider: ScrapingProvider,
    ) {
    }

    async getTruckListAll(): Promise<TruckNamesListDto[] | void> {
        try {
            return await this.prismaService.truck
                .findMany({
                    where: {watch: true},
                })
                .catch((e) => {});
        } catch (e) {
            throw new Error(e);
        }
    }

    /*
        * * * * * *
        | | | | | |
        | | | | | day of week
        | | | | months
        | | | day of month
        | | hours
        | minutes
        seconds (optional)
      * */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async updateTruckCoordinates(
        truckList: TruckNamesListDto[] = [],
    ): Promise<void> {
        try {
            if (!truckList.length) {
                truckList = (await this.prismaService.truck
                    .findMany({
                        where: {AND: {watch: true, updatedAt: {lte: new Date(Date.now() - 15 * 60 * 1000)}}},
                    })
                    .catch((e) => {})) as TruckNamesListDto[];
            }
            await this.scrapingProvider
                .updateTruckCoordinates(truckList)
                .catch((e) => {
                });
            return;
        } catch (e) {
            throw new Error(e);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async updateTruckCodes(truckList: TruckNamesListDto[] = []): Promise<void> {
        try {
            if (!truckList.length) {
                truckList = (await this.prismaService.truck
                    .findMany({
                        where: {code: {equals: null}},
                    })
                    .catch((e) => {})) as TruckNamesListDto[];
            }
            await this.scrapingProvider.updateTruckCodes(truckList).catch((e) => {
            });
            return;
        } catch (e) {
            throw new Error(e);
        }
    }

    async createMany(truckList: TruckNamesListDto[]): Promise<void> {
        try {
            const _trucks = truckList.map(({name}) => ({name}));
            await this.prismaService.truck.createMany({
                data: _trucks,
                skipDuplicates: true,
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteMany(truckList: TruckNamesListDto[]): Promise<void> {
        try {
            for (const {name} of truckList) {
                await this.prismaService.truck.delete({where: {name}});
            }
        } catch (e) {
            throw new Error(e);
        }
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { TruckNamesListDto } from './dto';
import { ScrapingProvider } from './providers';

@Injectable()
export class TruckService {
  constructor(
    private prismaService: PrismaService,
    private scrapingProvider: ScrapingProvider,
  ) {}

  async getTruckListAll(): Promise<TruckNamesListDto[] | void> {
    try {
      return await this.prismaService.truck
        .findMany({
          where: { AND: { inactive: false, tracing: true } },
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async updateTruckCoordinates(
    truckList: TruckNamesListDto[] = [],
  ): Promise<void> {
    try {
      if (!truckList.length) {
        truckList = (await this.getTruckListAll()) as TruckNamesListDto[];
      }
      await this.scrapingProvider
        .updateTruckCoordinates(truckList)
        .catch((e) => {
          console.log(e);
        });
      return;
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateTruckCodes(truckList: TruckNamesListDto[] = []): Promise<void> {
    try {
      if (!truckList.length) {
        truckList = (await this.getTruckListAll()) as TruckNamesListDto[];
      }
      await this.scrapingProvider.updateTruckCodes(truckList).catch((e) => {
        console.log(e);
      });
      return;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async createMany(truckList: TruckNamesListDto[]): Promise<void> {
    try {
      const _trucks = truckList.map(({ name }) => ({ name }));
      await this.prismaService.truck.createMany({
        data: _trucks,
        skipDuplicates: true,
      });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }

  async deleteMany(truckList: TruckNamesListDto[]): Promise<void> {
    try {
      for (const { name } of truckList) {
        await this.prismaService.truck.delete({ where: { name } });
      }
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}

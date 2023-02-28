import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from './modules/auth/guards';
import { AppService } from './app.service';
import { ScrapingProvider } from './modules/truck/providers';

@ApiTags('Home')
@ApiBearerAuth('accessToken')
@UseGuards(RolesGuard)
@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly scrapingProvider: ScrapingProvider,
  ) {}

  /*@Roles(RoleEnum.ADMIN)*/
  @Get('')
  async getApi(@Res() res: Response) {
    await this.scrapingProvider
      .getTruckListAll()
      .then((result) => res.status(HttpStatus.OK).send(JSON.stringify(result)))
      .catch((e) => console.log(e));
  }
}

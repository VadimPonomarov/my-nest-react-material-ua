import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import {TruckService} from './truck.service';
import {Response} from 'express';
import {ResEnum, RoleEnum} from '../../common/constants';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import {TruckEntity, TruckNamesListDto} from './dto';
import {RolesGuard} from '../auth/guards';
import {Roles} from '../auth/decorators';
import {badRequestSchema, truckOkSchema} from './swagger';

@ApiTags('Truck')
@ApiBearerAuth('accessToken')
@UseGuards(RolesGuard)
@Controller('truck')
export class TruckController {
    constructor(private readonly truckService: TruckService) {
    }

    @ApiOperation({summary: 'Returns an array of all Truck entities'})
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: ResEnum.SUCCESS,
        schema: {example: truckOkSchema}

    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ResEnum.FAILURE,
    })
    @Roles(RoleEnum.ADMIN)
    @Get()
    async getAll(@Res() res: Response): Promise<TruckEntity[] | void> {
        await this.truckService
            .getTruckListAll()
            .then((result) =>
                res.status(HttpStatus.OK).send({message: ResEnum.SUCCESS, result}),
            )
            .catch((e) =>
                res.status(HttpStatus.FORBIDDEN).send(ResEnum.FAILURE),
            );
    }



    @ApiOperation({
        summary: 'Delete list of truck entities according to array of truck names',
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: ResEnum.SUCCESS,
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: ResEnum.FAILURE,
    })
    @ApiBody({
        type: String,
        schema: {example: ['DAF AR 3306 SF Ігнатов', 'DAF АР 0006 СТ Васюков']},
        isArray: true,
    })
    @Delete()
    async delete(
        @Body() trucks: TruckNamesListDto[],
        @Res() res: Response,
    ): Promise<void> {
        await this.truckService
            .deleteMany(trucks)
            .then(() => res.status(HttpStatus.OK).send(ResEnum.SUCCESS))
            .catch((e) =>
                res.status(HttpStatus.NOT_ACCEPTABLE).send(ResEnum.FAILURE),
            );
    }
}

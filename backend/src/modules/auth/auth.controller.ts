import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import {AuthService} from './auth.service';
import {CreateUserDto, JwtDto, LogInDto} from './dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCookieAuth,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import {Request, Response} from 'express';
import {JwtEnum, ResEnum, RoleEnum} from '../../common/constants';
import {RolesGuard} from './guards';
import {loginOkSchema} from './swagger';
import {UserEntity} from './dto/entities';
import {Roles} from './decorators';
import cookieParser from 'cookie-parser';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    /*-------------------------*/


    @ApiOkResponse({
        status: HttpStatus.OK,
        description: ResEnum.SUCCESS,
    })
    @ApiBadRequestResponse({
        status: HttpStatus.NOT_ACCEPTABLE,
        description: ResEnum.FAILURE,
    })
    @ApiOperation({summary: 'Creation / registration of a user'})
    @Post('register')
    async postCreate(
        @Body() createUserDto: CreateUserDto,
        @Res() res: Response,
    ): Promise<void> {
        await this.authService
            .create(createUserDto)
            .then((result) => res.status(HttpStatus.OK).send(ResEnum.SUCCESS))
            .catch((e) =>
                res.status(HttpStatus.NOT_ACCEPTABLE).send(ResEnum.FAILURE),
            );
    }

    /*-------------------------*/

    @ApiOkResponse({status: HttpStatus.OK, description: ResEnum.SUCCESS})
    @ApiBadRequestResponse({
        status: HttpStatus.NOT_ACCEPTABLE,
        description: ResEnum.FAILURE,
    })
    @ApiOperation({summary: 'Activation of a user'})
    @Get('activate/:jwt')
    async getActivateUser(@Param() params, @Res() res) {
        const payLoad: JwtDto = {
            type: JwtEnum.ACTIVATE,
            token: params.jwt,
        };
        await this.authService
            .activateUser(payLoad)
            .then((result) => res.status(HttpStatus.OK).send(ResEnum.SUCCESS))
            .catch((e) =>
                res.status(HttpStatus.NOT_ACCEPTABLE).send(ResEnum.FAILURE),
            );
    }

    /*-------------------------*/

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: ResEnum.SUCCESS,
        schema: {example: loginOkSchema}
    })
    @ApiBadRequestResponse({
        status: HttpStatus.NOT_ACCEPTABLE,
        description: ResEnum.FAILURE,
    })
    @ApiOperation({summary: 'Creation / registration of a user'})
    @Post('refresh')
    async postRefresh(@Req() req: Request, @Res() res: Response, @Body() body) {
        const result = await this.authService.refreshTokenPair(
            {type: JwtEnum.REFRESH, token: body.refreshToken}
        );
        if (!result)
            return res.status(HttpStatus.NOT_ACCEPTABLE).send(ResEnum.FAILURE);
        res
            .status(HttpStatus.OK)
            .send({message: ResEnum.SUCCESS, result: result});
    }

    /*-------------------------*/

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: ResEnum.SUCCESS,
        schema: {example: loginOkSchema},
    })
    @ApiBadRequestResponse({
        status: HttpStatus.NOT_ACCEPTABLE,
        description: ResEnum.FAILURE,
    })
    @ApiOperation({summary: 'Login of a user'})
    @Post('login')
    async postLogIn(
        @Req() req: Request,
        @Res() res: Response,
        @Body() logInDto: LogInDto,
    ): Promise<void> {
        await this.authService
            .logIn(logInDto)
            .then((result) => {
                res
                    .status(HttpStatus.OK)
                    .send({message: ResEnum.SUCCESS, result: result});
            })
            .catch((e) =>
                res.status(HttpStatus.NOT_ACCEPTABLE).send(ResEnum.FAILURE),
            );
    }
}

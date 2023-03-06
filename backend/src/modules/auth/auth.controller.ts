import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto, JwtDto, LogInDto} from './dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import {Request, Response} from 'express';
import {JwtEnum, ResEnum} from '../../common/constants';
import {loginOkSchema} from './swagger';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
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
    @ApiOperation({summary: 'User registration'})
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
    @ApiOperation({summary: 'User activation'})
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
    @ApiOperation({summary: 'Token pair refreshment'})
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

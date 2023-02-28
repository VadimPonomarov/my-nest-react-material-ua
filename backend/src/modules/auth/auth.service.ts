import {
    Injectable,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common';
import {CreateUserDto, JwtDto, JwtPayloadDto, LogInDto} from './dto';
import {PrismaService} from '../../core/prisma.service';
import {JwtEnum, RoleEnum} from '../../common/constants';
import {UserEntity} from './dto/entities';
import {_bcrypt, _bcryptCompare, _errorMessage} from '../../common/utils';
import {JwtProvider} from './providers';
import {MailerService} from '@nestjs-modules/mailer';
import * as process from 'process';
import {join} from 'node:path';
import config from '../../config/configuration';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtProvider: JwtProvider,
        private readonly mailerService: MailerService,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
        try {
            const isExist = await this.prismaService.user.findUnique({
                where: {email: createUserDto.email},
            });
            if (isExist && isExist.activated) throw new NotAcceptableException();
            else if (isExist) {
                const activationToken = await this.jwtProvider.getJwt(
                    JwtEnum.ACTIVATE,
                    {
                        name: isExist.name,
                        email: isExist.email,
                    },
                );

                return await this.mailerService
                    .sendMail({
                        context: {
                            message: join(
                                process.env.MAILER_ACTIVATION_LINK,
                                activationToken.token,
                            ),
                        },
                        to: isExist.email,
                        from: config().mailerOptions.defaults.from,
                    })
                    .catch(async (e) => {
                        await this.deleteByEmail(user.email);
                        console.log(_errorMessage(e));
                        throw new Error(e);
                    });
            }
            const data: CreateUserDto = {
                ...createUserDto,
                password: _bcrypt(createUserDto.password),
            };
            const user = await this.prismaService.user.create({
                data: {...data, roles: {create: {name: RoleEnum.USER}}},
            });
            const activationToken = await this.jwtProvider.getJwt(JwtEnum.ACTIVATE, {
                name: user.name,
                email: user.email,
            });

            await this.mailerService
                .sendMail({
                    context: {
                        message: join(
                            process.env.MAILER_ACTIVATION_LINK,
                            activationToken.token,
                        ),
                    },
                    to: user.email,
                    from: 'pvs.versia@gmail.com',
                })
                .catch(async (e) => {
                    await this.deleteByEmail(user.email);
                    throw new Error(e);
                });
            return user;
        } catch (e) {
            console.log(_errorMessage(e));
            throw e;
        }
    }

    async activateUser(jwt: JwtDto): Promise<void> {
        try {
            const isValid: JwtPayloadDto = await this.jwtProvider.getIsJwtValid(jwt);
            const isRegistered = await this.prismaService.token.delete({
                where: {token: jwt.token},
            });
            if (!isValid || !isRegistered) throw new NotAcceptableException();
            await this.prismaService.user.update({
                where: {email: isValid.email},
                data: {activated: true},
            });
        } catch (e) {
            console.log(_errorMessage(e));
            throw new Error(e);
        }
    }

    async logIn(loginDto: LogInDto): Promise<JwtDto[]> {
        try {
            const isExist = await this.prismaService.user.findUnique({
                where: {email: loginDto.email},
                include: {roles: {select: {name: true}}},
            });
            if (!isExist || !isExist.activated) throw new NotAcceptableException();
            const isValid = _bcryptCompare(loginDto.password, isExist.password);
            if (!isValid) throw new NotAcceptableException();
            const jwtPayload: JwtPayloadDto = {
                name: isExist.name,
                email: isExist.email,
            };
            return this.jwtProvider.getTokenPair(jwtPayload);
        } catch (e) {
            console.log(_errorMessage(e));
            throw new Error(e);
        }
    }

    refreshTokenPair(jwt: JwtDto): JwtDto[] {
        try {
            if (jwt.type !== JwtEnum.REFRESH) throw new NotAcceptableException();
            const isValid = this.jwtProvider.getIsJwtValid(jwt);
            this.jwtProvider.removeJwtFromRegister(jwt);
            if (!isValid) throw new NotAcceptableException();
            return this.jwtProvider.getTokenPair({
                email: isValid.email,
                name: isValid.name,
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    async getAll(): Promise<Partial<UserEntity>[]> {
        try {
            return this.prismaService.user.findMany();
        } catch (e) {
            console.log(_errorMessage(e));
            throw new Error(e);
        }
    }

    async deleteByEmail(email: string): Promise<void> {
        try {
            await this.prismaService.user.delete({
                where: {email},
            });
        } catch (e) {
            console.log(_errorMessage(e));
            throw new Error(e);
        }
    }

    async getOneById(id: string | number): Promise<unknown> {
        //console.log(id);
        return;
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: +id,
                },
                include: {roles: {select: {name: true}}},
            });
            if (!user) throw new NotFoundException();
            return user;
        } catch (e) {
            console.log(_errorMessage(e));
            throw new Error(e);
        }
    }
}

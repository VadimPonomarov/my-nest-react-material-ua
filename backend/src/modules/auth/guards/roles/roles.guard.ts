import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtProvider } from '../../providers';
import { JwtEnum } from '../../../../common/constants';
import { PrismaService } from '../../../../core/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtProvider: JwtProvider,
    private prismaService: PrismaService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    try {
      const authRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

      if (!authRoles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const isBearer = request.headers.authorization;
      if (!isBearer || !isBearer.includes('Bearer')) return false;
      const _jwt: string = isBearer.split(' ')[1];
      const isValid = this.jwtProvider.getIsJwtValid({
        type: JwtEnum.ACCESS,
        token: _jwt,
      });
      if (!isValid) return false;
      return this.prismaService.user
        .findUnique({
          where: { email: isValid.email },
          select: { roles: { select: { name: true } } },
        })
        .then((userRoles) =>
          userRoles.roles.filter((item) => authRoles.includes(item.name)),
        )
        .then((filtered) => !!filtered.length);
    } catch (e) {
      console.log(e.message);
    }
  }
}

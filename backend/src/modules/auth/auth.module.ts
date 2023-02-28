import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { PrismaService } from '../../core/prisma.service';
import { RolesGuard } from './guards';
import { JwtService } from '@nestjs/jwt';
import { JwtProvider } from './providers';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, RolesGuard, JwtService, JwtProvider],
  imports: [PrismaClient],
})
export class AuthModule {}

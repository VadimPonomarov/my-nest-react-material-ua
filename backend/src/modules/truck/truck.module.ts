import { Module } from '@nestjs/common';
import { TruckController } from './truck.controller';
import { TruckService } from './truck.service';
import { PrismaService } from '../../core/prisma.service';
import { ScrapingProvider } from './providers';
import { JwtProvider } from '../auth/providers';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TruckController],
  providers: [TruckService, PrismaService, ScrapingProvider, JwtProvider, JwtService],
})
export class TruckModule {}

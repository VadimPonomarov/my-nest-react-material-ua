import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BotModule} from './modules/bot/bot.module';
import {AuthModule} from './modules/auth/auth.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import config from './config/configuration';
import {SwaggerModule} from '@nestjs/swagger';
import {PrismaService} from './core/prisma.service';
import {MailerModule} from '@nestjs-modules/mailer';
import {NodeMailerService} from './common/providers';
import {JwtModule} from '@nestjs/jwt';
import {ScheduleModule} from '@nestjs/schedule';
import {JwtProvider} from './modules/auth/providers';
import {PlaywrightModule} from 'nestjs-playwright';
import {TruckModule} from './modules/truck/truck.module';
import {ScrapingProvider} from './modules/truck/providers';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards';

@Module({
    controllers: [AppController],
    providers: [
        AppService,
        ConfigService,
        PrismaService,
        NodeMailerService,
        JwtProvider,
        ScrapingProvider,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        }
    ],
    imports: [
        BotModule,
        AuthModule,
        SwaggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        MailerModule.forRoot(config().mailerOptions),
        JwtModule.register({}),
        ScheduleModule.forRoot(),
        PlaywrightModule.forRoot(config().scrapeProvider.configOptions),
        TruckModule,
    ],
    exports: [JwtModule],
})
export class AppModule {
}

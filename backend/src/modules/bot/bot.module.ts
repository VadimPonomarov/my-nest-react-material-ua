import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';
import { TELEGRAF_CONFIG } from './config/config';
import { ConfigService } from '@nestjs/config';
import { MyScene } from './scenes/scene_1';
import { MyScene_2 } from './scenes/scene_2';

const scenes = [MyScene, MyScene_2];
@Module({
  controllers: [],
  providers: [BotService, BotUpdate, ConfigService, ...scenes],
  imports: [
    TelegrafModule.forRoot({
      middlewares: [TELEGRAF_CONFIG.telegrafSessions().middleware()],
      token: TELEGRAF_CONFIG.telegrafToken,
    }),
  ],
})
export class BotModule {}

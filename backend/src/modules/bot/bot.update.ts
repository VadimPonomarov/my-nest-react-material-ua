import { Command, Ctx, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from './bot.service';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply('Hello, friend!');
    return;
  }

  @Hears(/help/)
  async onText(@Ctx() ctx: Context) {
    await ctx.reply('Can help');
    return;
  }

  @Command('/scene')
  async onSceneCommand(ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('HELLO_SCENE_ID');
    return;
  }
}

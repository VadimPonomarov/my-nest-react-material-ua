import { On, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { SceneContext } from '../interfaces/context.interface';

@Scene('HELLO_SCENE_ID_2')
export class MyScene_2 {
  @SceneEnter()
  async onSceneEnter(ctx: SceneContext, next): Promise<any> {
    ctx.state.type = 'Введите - 2:';
    await ctx.reply('Hi!\nВведите - 2: ');
    return;
  }

  @On('text')
  async onText1(ctx: SceneContext, next) {
    switch (ctx.message['text']) {
      case 'Введите - 2:':
        break;
      default:
        ctx.state.type = ctx.message['text'];
        await ctx.scene.leave();
    }
    return;
  }

  @SceneLeave()
  async onSceneLeave(ctx: SceneContext): Promise<any> {
    await ctx.reply(ctx.state.type);
    await ctx.reply('Bye-2 Bye-2 👋');
    return;
  }
}

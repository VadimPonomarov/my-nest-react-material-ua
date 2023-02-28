import { On, Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { SceneContext } from '../interfaces/context.interface';

@Scene('HELLO_SCENE_ID')
export class MyScene {
  @SceneEnter()
  async onSceneEnter(ctx: SceneContext, next): Promise<any> {
    ctx.state.type = 'Введите - 1:';
    await ctx.reply('Hi!\nВведите - 1: ');
    return;
  }

  @On('text')
  async onText1(ctx: SceneContext, next) {
    switch (ctx.message['text']) {
      case 'Введите - 1:':
        break;
      default:
        ctx.state.type = ctx.message['text'];
        await ctx.scene.leave();
        await ctx.scene.enter('HELLO_SCENE_ID_2');
    }
    return;
  }

  @SceneLeave()
  async onSceneLeave(ctx: SceneContext): Promise<any> {
    await ctx.reply(ctx.state.type);
    await ctx.reply('Bye Bye 👋');
  }
}

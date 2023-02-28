import { Markup } from 'telegraf';

export const buttons = () => {
  return Markup.keyboard(
    [
      Markup.button.callback('First!', 'First_'),
      Markup.button.callback('Second!', 'Second_'),
      Markup.button.callback('Third!', 'Third_'),
    ],
    {
      columns: 3,
    },
  );
};

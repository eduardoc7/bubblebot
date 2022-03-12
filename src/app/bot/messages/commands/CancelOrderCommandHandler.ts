import { Message } from 'whatsapp-web.js';

export const CancelOrderCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    return msg.reply(
      'Ops! Isso ainda está em desenvolvimento. Tente novamente, mais tarde. Obrigado :).',
    );
  },
};

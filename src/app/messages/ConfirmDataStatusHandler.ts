import type { Message } from 'whatsapp-web.js';
import { OrderMessageHandler } from './OrderMessageHandler';

export const ConfirmDataStatusHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const msg_body_without_acentos = msg.body
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    console.log('msg_body_without_acentos: ', msg_body_without_acentos);
    if (msg_body_without_acentos == 'sim') {
      console.log('HELLO');
      return msg.reply('FODASE');
    } else if (msg_body_without_acentos == 'nao') {
      return msg.reply(
        `Ok. Tudo bem. Atualize os itens do seu carrinho e cuidaremos do resto :).`,
      );
    }

    return OrderMessageHandler.execute(msg);
  },
};

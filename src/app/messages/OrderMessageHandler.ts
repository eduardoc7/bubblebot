import type { Message } from 'whatsapp-web.js';

export const OrderMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const order = await msg.getOrder();
    console.log(order);

    return msg.reply('Estamos processando seu pedido!');
  },
};

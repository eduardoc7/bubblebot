import type { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../cache/OrderHandlerCache';

export const OrderMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const order = await msg.getOrder();
    const data = await OrderHandlerCache.prepareOrderToCache(msg, order);
    await OrderHandlerCache.setOder('pedido:' + msg.from, data);

    console.log(order);
    console.log(await OrderHandlerCache.getOder('pedido:' + msg.from));

    return msg.reply(
      `Nós recebemos seu pedido com sucesso. ✅
      \nSe deseja finalizar o pedido digite: *#finalizar*
      `,
    );
  },
};

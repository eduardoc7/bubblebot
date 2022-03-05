import type { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import type { IOrder } from '../interfaces/Order';

export const OrderMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const order = await msg.getOrder();
    const data = await OrderHandlerCache.prepareOrderToCache(msg, order);

    await OrderHandlerCache.setOder('order:' + msg.from, data);

    return msg.reply(
      `Nós recebemos seu pedido com sucesso. ✅
      \nSe deseja finalizar o pedido digite: *#finalizar*
      `,
    );
  },

  async CheckExistsOrderToUser(msg: Message): Promise<boolean> {
    try {
      const obj: IOrder = await OrderHandlerCache.getOrderFromMessage(msg);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  },

  async getStatusOrder(msg: Message): Promise<string> {
    const obj: IOrder = await OrderHandlerCache.getOrderFromMessage(msg);

    return obj.status;
  },

  async updateStatusOder(msg: Message, status: string): Promise<boolean> {
    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg);
    } catch (e) {
      console.log(e);
      return false;
    }

    obj.status = status;
    await OrderHandlerCache.setOder('order:' + msg.from, JSON.stringify(obj));

    return true;
  },
};

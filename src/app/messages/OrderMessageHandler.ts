import type { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import { IOrder, Convert } from '../interfaces/Order';
import { redisClient } from '../../services/redis';

export const OrderMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const order = await msg.getOrder();
    const data = await OrderHandlerCache.prepareOrderToCache(msg, order);

    await OrderHandlerCache.setOder('order:' + msg.from, data);

    return msg.reply(
      `Nós recebemos seu pedido com sucesso. ✅
      \nSe deseja finalizar o pedido digite: *#ok*
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

  async setAddressLocationToOrder(
    latitude: string,
    longitude: string,
    status: string,
    msg: Message,
  ): Promise<boolean> {
    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg);
    } catch (e) {
      console.log(e);
      return false;
    }

    obj.location.latitude = `${latitude}`;
    obj.location.longitude = `${longitude}`;
    obj.total = Number(obj.total) + 10000;
    obj.status = status;

    const data = JSON.stringify(obj).replace(/\\"/g, '"');
    await redisClient.set('order:' + msg.from, data);

    return true;
  },
  async setPaymentMethodToOrder(
    payment_method: string,
    status: string,
    msg: Message,
  ): Promise<boolean> {
    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg);
    } catch (e) {
      console.log(e);
      return false;
    }

    obj.payment_method = payment_method;
    obj.status = status;

    const data = JSON.stringify(obj).replace(/\\"/g, '"');
    await redisClient.set('order:' + msg.from, data);

    return true;
  },
  async setDeliveryMethodToOrder(
    delivery_method: string,
    status: string,
    msg: Message,
  ): Promise<boolean> {
    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg);
    } catch (e) {
      console.log(e);
      return false;
    }

    obj.delivery_method = delivery_method;
    obj.status = status;

    await OrderHandlerCache.setOder('order:' + msg.from, JSON.stringify(obj));

    return true;
  },
};

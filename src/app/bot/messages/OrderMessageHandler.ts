import type { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import { IOrder } from '../interfaces/Order';
import { redisClient } from '../../../services/redis';

export const OrderMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const order = await msg.getOrder();

    const { total, products } = order;

    const contact = await msg.getContact();

    const data = await OrderHandlerCache.prepareOrderToCache({
      total: Number(total),
      name: contact.pushname,
      items: products,
      contact_number: await contact.getFormattedNumber(),
      chatId: (await contact.getChat()).id._serialized,
      location: {},
    });

    await OrderHandlerCache.setOder('order:' + msg.from, data);

    return msg.reply(
      `Nós recebemos seu pedido com sucesso. ✅
      \nSe deseja finalizar o pedido digite: *#ok*
      `,
    );
  },

  async CheckExistsOrderToUser(msg: Message): Promise<boolean> {
    try {
      const obj: IOrder = await OrderHandlerCache.getOrderFromMessage(msg.from);

      if (obj === null || obj === undefined) {
        return false;
      }
    } catch (e) {
      console.log('error in CheckExistsOrderToUser: ', e);
      return false;
    }
    return true;
  },

  async getStatusOrder(msg: Message): Promise<string> {
    const obj: IOrder = await OrderHandlerCache.getOrderFromMessage(msg.from);

    return obj.status ?? 'null';
  },

  async updateStatusOder(msg: Message, status: string): Promise<boolean> {
    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg.from);
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
      obj = await OrderHandlerCache.getOrderFromMessage(msg.from);
    } catch (e) {
      console.log(e);
      return false;
    }

    obj.location.latitude = `${latitude}`;
    obj.location.longitude = `${longitude}`;
    obj.status = status;

    const data = JSON.stringify(obj).replace(/\\"/g, '"');
    await redisClient.set('order:' + msg.from, data);

    return true;
  },

  async setBairroToOrder(
    status: string,
    taxa_entrega: number,
    msg: Message,
  ): Promise<boolean> {
    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg.from);
    } catch (e) {
      console.log(e);
      return false;
    }

    // 1. Shangrila - taxa: *R$ 5,00*
    // 2. Ipanema - taxa: *R$ 8,00*
    // 3. Pontal do Sul - taxa: *R$ 10,00*
    // 4. Santa Terezinha - taxa: *R$ 12,00*
    // 5. Praia de Leste - taxa: *R$ 15,00*
    let taxa_entrega_to_pay;
    let bairro_name;
    switch (taxa_entrega) {
      case 1:
        bairro_name = 'shangrila';
        taxa_entrega_to_pay = 5000;
        break;
      case 2:
        bairro_name = 'ipanema';
        taxa_entrega_to_pay = 8000;
        break;
      case 3:
        bairro_name = 'pontal do sul';
        taxa_entrega_to_pay = 10000;
        break;
      case 4:
        bairro_name = 'santa terezinha';
        taxa_entrega_to_pay = 12000;
        break;
      case 5:
        bairro_name = 'praia de leste';
        taxa_entrega_to_pay = 15000;
        break;
      default:
        taxa_entrega_to_pay = 15000;
    }

    obj.location.bairro = bairro_name || '';
    obj.total = Number(obj.total) + taxa_entrega_to_pay;
    obj.location.taxa_entrega = Number(taxa_entrega_to_pay);
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
      obj = await OrderHandlerCache.getOrderFromMessage(msg.from);
    } catch (e) {
      console.log(e);
      return false;
    }

    obj.payment_method = payment_method;
    obj.payment_status = 'pendente';
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
      obj = await OrderHandlerCache.getOrderFromMessage(msg.from);
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

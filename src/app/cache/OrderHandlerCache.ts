import { redisClient } from '../../services/redis';
import { Order as Orderwpp, Message } from 'whatsapp-web.js';
import type { IOrder } from '../interfaces/Order';

export default class OrderHandlerCache {
  static async setOder(Identifier: string, data: string): Promise<void> {
    await redisClient.set(Identifier, data);
  }

  /**
   * 
   * @param msg messsage from wwebjs
   * @returns example:
   * //   identifier: 'order:number@c.us',
    //   name: 'Eduardo',
    //   number: 'number',
    //   payment_method: '',
    //   payment_status: 'vazio',
    //   total: 5000,
    //   items: [
    //     {
    //       id: '5016576728399089',
    //       price: 5000,
    //       thumbnailUrl: 'url',
    //       currency: 'BRL',
    //       name: 'Testing item',
    //       quantity: 1,
    //       data: null
    //     }
    //   ],
    //   address: { cep: '', street: '', bairro: '', numero: '' },
    //   status: 'created',
    //   chatId: 'number@c.us',
    //   created_at: 1646352885
    // }
   */
  static async getOrderFromMessage(msg: Message): Promise<IOrder> {
    const order = await redisClient.get('order:' + msg.from);
    if (order === '') {
      throw `Nenhum pedido encontrado para ${msg.from}`;
    }
    const objOrder: IOrder = JSON.parse(order || '');

    return objOrder;
  }

  static async prepareOrderToCache(message: Message, order: Orderwpp) {
    const contact = await message.getContact();

    const data = {
      identifier: 'order:' + message.from,
      name: contact.pushname,
      number: contact.number,
      payment_method: '',
      payment_status: 'vazio',
      total: order.total,
      items: order.products,
      location: {
        latitude: '',
        longitude: '',
      },
      status: 'created',
      chatId: message._getChatId(),
      created_at: order.createdAt,
    };

    return JSON.stringify(data);
  }
}

import { redisClient } from '../../../services/redis';
import { Order as Orderwpp, Message } from 'whatsapp-web.js';
import { IOrder, Convert } from '../interfaces/Order';
import moment from 'moment';

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
  static async getOrderFromMessage(msg_from: string): Promise<IOrder> {
    const order_json = await redisClient.get('order:' + msg_from);

    const order_obj = Convert.toIOrder(order_json || '');
    return order_obj;
  }

  static async checkIfIsAtendimento(msg: Message): Promise<boolean> {
    const IsAtendimento = await redisClient.get('atendimento:' + msg.from);
    if (IsAtendimento == null) {
      return false;
    }
    return Boolean(IsAtendimento);
  }

  static async setAtendimentoToFinish(
    msg: Message,
    nome_atendido: string,
  ): Promise<boolean> {
    const atendimento = await redisClient.get(
      `atendimento:554184510719@c.us:${nome_atendido}`,
    );
    if (atendimento == null) {
      return false;
    }
    const atendimento_json = JSON.parse(atendimento || '');

    const atendido = atendimento_json.atendido;
    const atendente = atendimento_json.atendente;

    await redisClient.del('atendimento:' + atendido);
    await redisClient.del('atendimento:' + atendente);

    return true;
  }

  static async prepareOrderToCache(message: Message, order: Orderwpp) {
    const contact = await message.getContact();

    const identifier = this.createIdentifierNameToOrder(
      contact.pushname,
      order.total,
      await contact.getFormattedNumber(),
    );

    const now = moment().format('DD-MM-YYYY-hh:mm:ss');

    const data = {
      identifier: identifier,
      name: contact.pushname,
      contact_number: await contact.getFormattedNumber(),
      payment_method: 'vazio',
      payment_status: 'vazio',
      delivery_method: 'vazio',
      total: order.total,
      items: order.products,
      location: {
        latitude: 'vazio',
        longitude: 'vazio',
        bairro: 'vazio',
      },
      status: 'created',
      chatId: message._getChatId(),
      created_at: now,
      updated_at: now,
    };

    return JSON.stringify(data);
  }

  static createIdentifierNameToOrder(
    contact_name: string,
    order_total: string,
    number: string,
  ): string {
    const name_formated = contact_name.substring(0, 3).toUpperCase();
    const total_formated = order_total;
    const last_numbers = number.split('-').pop();

    return `${name_formated}${total_formated}${last_numbers}`;
  }
}

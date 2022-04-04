import { redisClient } from '../../../services/redis';
import { Message } from 'whatsapp-web.js';
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
  static async getOrderFromMessage(msg_from: string): Promise<any> {
    let order_json: any;
    try {
      order_json = await redisClient.get('order:' + msg_from);
    } catch (error) {
      console.error('error ao pegar order do cache getOrderFromMessage');
    }

    let order_obj!: IOrder;
    try {
      order_obj = Convert.toIOrder(order_json || '');
    } catch (error) {
      console.error('error ao converter ordem pro tipo ', error, order_json);
    }

    return order_obj;
  }

  static async checkIfIsAtendimento(msg: Message): Promise<boolean> {
    const IsAtendimento = await redisClient.get('atendimento:' + msg.from);
    if (IsAtendimento == null) {
      return false;
    }
    return Boolean(IsAtendimento);
  }

  static async setAtendimentoToFinish(nome_atendido: string): Promise<boolean> {
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

  static async prepareOrderToCache(order: IOrder) {
    const identifier = this.createIdentifierNameToOrder(
      order.name,
      order.total.toString(),
      order.contact_number,
    );

    const now = moment().format('DD-MM-YYYY-hh:mm:ss');

    const data = {
      identifier: identifier,
      name: order.name,
      contact_number: order.contact_number,
      payment_method: order.payment_method ?? 'N/A',
      payment_status: order.payment_status ?? 'N/A',
      delivery_method: order.delivery_method ?? 'N/A',
      total: order.total,
      items: order.items,
      location: {
        latitude: order.location.latitude ?? 'N/A',
        longitude: order.location.longitude ?? 'N/A',
        bairro: order.location.bairro ?? 'N/A',
        taxa_entrega: order.location.taxa_entrega ?? 0,
      },
      status: 'created',
      chatId: order.chatId,
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

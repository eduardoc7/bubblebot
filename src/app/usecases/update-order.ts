import moment from 'moment';
import db from '../../database/connection';
import OrderHandlerCache from '../bot/cache/OrderHandlerCache';
import { IOrder } from '../bot/interfaces/Order';
import { queryOrder } from './query-orders';

export const UpdateOrder = {
  async queryToUpdateOrder(order_id: number, status_to_update: string) {
    const result = await db('orders')
      .where('id', order_id)
      .update({ status: status_to_update });

    if (result !== 1) {
      throw new Error(`Order Id ${order_id} doesn't exists in database`);
    }

    return result;
  },
  async queryToUpdatePaymentStatus(order_id: number, status_to_update: string) {
    const result = await db('orders')
      .where('id', order_id)
      .update({ payment_status: status_to_update });

    if (result !== 1) {
      throw new Error(`Order Id ${order_id} doesn't exists in database`);
    }

    return result;
  },
  async updateOrderByStatus(
    order_id: number,
    status_to_update: string,
  ): Promise<string> {
    await this.queryToUpdateOrder(order_id, status_to_update);
    const order_data_from_db = await queryOrder.selectOrderById(order_id);

    const chatId = order_data_from_db.chatId;
    let obj_order: IOrder;

    try {
      obj_order = await OrderHandlerCache.getOrderFromMessage(chatId);
    } catch (e) {
      throw new Error('Erro buscando order no cache');
    }

    const now = moment().format('DD-MM-YYYY-hh:mm:ss');
    obj_order.status = status_to_update;
    obj_order.updated_at = now;

    await OrderHandlerCache.setOder(
      'order:' + chatId,
      JSON.stringify(obj_order),
    );

    return chatId;
  },
  async updatePaymentByStatus(
    order_id: number,
    status_to_update: string,
  ): Promise<string> {
    await this.queryToUpdatePaymentStatus(order_id, status_to_update);
    const order_data_from_db = await queryOrder.selectOrderById(order_id);

    const chatId = order_data_from_db.chatId;
    let obj_order: IOrder;

    try {
      obj_order = await OrderHandlerCache.getOrderFromMessage(chatId);
    } catch (e) {
      throw new Error('Erro buscando order no cache');
    }

    const now = moment().format('DD-MM-YYYY-hh:mm:ss');
    obj_order.payment_status = status_to_update;
    obj_order.updated_at = now;

    await OrderHandlerCache.setOder(
      'order:' + chatId,
      JSON.stringify(obj_order),
    );

    return chatId;
  },
};

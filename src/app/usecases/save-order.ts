import db from '../../database/connection';
import OrderHandlerCache from '../bot/cache/OrderHandlerCache';
import { IOrder, Item } from '../bot/interfaces/Order';

export default class CreateOrder {
  constructor(private order: IOrder, private saveCache?: boolean) {}

  async execute() {
    const trx = await db.transaction();

    const identifier = OrderHandlerCache.createIdentifierNameToOrder(
      this.order.name,
      this.order.total.toString(),
      this.order.contact_number,
    );

    const chatId = `${this.order.contact_number}@c.us`;
    const newChatId = chatId.replace(/[^A-Z0-9]/gi, '');

    const items_array = this.order.items.map((item: Item) => {
      return {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      };
    });

    if (this.saveCache) {
      const data = await OrderHandlerCache.prepareOrderToCache({
        total: Number(this.order.total),
        name: this.order.name,
        contact_number: this.order.contact_number,
        payment_method: this.order.payment_method,
        payment_status: this.order.payment_status,
        delivery_method: this.order.delivery_method,
        items: this.order.items,
        chatId: newChatId,
        location: this.order.location,
      });

      await OrderHandlerCache.setOder('order:' + chatId, data);
    }

    try {
      await trx('orders').insert({
        name: this.order.name,
        identifier,
        contact_number: this.order.contact_number,
        payment_method: this.order.payment_method,
        payment_status: this.order.payment_status,
        delivery_method: this.order.delivery_method,
        total: this.order.total,
        items: JSON.stringify(items_array),
        location: this.order.location,
        status: this.order.status,
        chatId,
      });

      await trx.commit();
    } catch (err) {
      await trx.rollback();
      console.error(err);
    }
  }
}

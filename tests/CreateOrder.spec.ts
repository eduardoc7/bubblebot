import OrderHandlerCache from '../src/app/bot/cache/OrderHandlerCache';
import { Convert, IOrder } from '../src/app/bot/interfaces/Order';
import { createMessageOrder } from './factories/MessageOrderFactory';

describe('create a new order', () => {
  it('should be able to create a order JSON data', async () => {
    const order = createMessageOrder();

    const data = await OrderHandlerCache.prepareOrderToCache(order);

    const order_obj = Convert.toIOrder(data || '');

    expect(data).toBeTruthy();
    expect(order_obj.identifier).toEqual('TES50009999');
    expect(order_obj.name).toEqual('Test');
    expect(order_obj.contact_number).toEqual('+55 41 9999-9999');
    expect(order_obj.total).toEqual(5000);
    expect(order_obj.chatId).toEqual('554199999999@c.us');
    expect(order_obj.status).toEqual('created');
    expect(order_obj.items.length).not.toBe(0);
    expect(order_obj.payment_method).toEqual('N/A');
    expect(order_obj.payment_status).toEqual('N/A');
    expect(order_obj.delivery_method).toEqual('N/A');
    expect(order_obj.location.bairro).toEqual('N/A');
    expect(order_obj.location.latitude).toEqual('N/A');
    expect(order_obj.location.longitude).toEqual('N/A');
    expect(order_obj.location.taxa_entrega).toEqual(0);
  });

  it('should be able to save order on redis cache', async () => {
    const order = createMessageOrder();

    const data = await OrderHandlerCache.prepareOrderToCache(order);

    await OrderHandlerCache.setOder('order:' + order.chatId, data);

    const order_obj: IOrder = await OrderHandlerCache.getOrderFromMessage(
      order.chatId,
    );

    expect(order_obj.identifier).toEqual('TES50009999');
    expect(order_obj.name).toEqual('Test');
    expect(order_obj.contact_number).toEqual('+55 41 9999-9999');
    expect(order_obj.total).toEqual(5000);
    expect(order_obj.chatId).toEqual('554199999999@c.us');
    expect(order_obj.status).toEqual('created');
    expect(order_obj.items.length).not.toBe(0);
    expect(order_obj.payment_method).toEqual('N/A');
    expect(order_obj.payment_status).toEqual('N/A');
    expect(order_obj.delivery_method).toEqual('N/A');
    expect(order_obj.location.bairro).toEqual('N/A');
    expect(order_obj.location.latitude).toEqual('N/A');
    expect(order_obj.location.longitude).toEqual('N/A');
    expect(order_obj.location.taxa_entrega).toEqual(0);
  });
});

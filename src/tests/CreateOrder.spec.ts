import { OrderMessageHandler } from '../app/bot/messages/OrderMessageHandler';
import { createMessageOrder } from './factories/MessageOrderFactory';

describe('create a new order', () => {
  it('should be able to create a order', async () => {
    const order = createMessageOrder();

    expect(order).toBeTruthy();
  });
});

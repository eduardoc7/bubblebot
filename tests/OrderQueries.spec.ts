import { queryOrder } from '../src/app/usecases/query-orders';
import { UpdateOrder } from '../src/app/usecases/update-order';

describe('order queries on database', () => {
  it('should be able to update order status', async () => {
    const result = await UpdateOrder.queryToUpdateOrder(1, 'producao');

    expect(result).toEqual(1);
  });

  it('should be able to get all data from order id', async () => {
    const result = await queryOrder.selectOrderById(1);

    expect(result).toBeTruthy();
  });

  it('should be able to update status in cache and database', async () => {
    const result = await UpdateOrder.updateOrderByStatus(3, 'producao');

    expect(result).toBeTruthy();
  });
});

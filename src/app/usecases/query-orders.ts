import db from '../../database/connection';

/**
 * numero de pedidos
 * numero de pedidos em produção
 * numero de pedidos finalizados
 * numero de pedidos pagamentos pendentes
 * total vendido
 * total faltando pagar
 */
export const queryOrder = {
  async selectOrderById(id: number) {
    const query = await db('orders').where('id', id).first();

    return query;
  },
  async selectAllOrdersRecords() {
    const query = await db.select().table('orders');

    return query;
  },
  async selectAndCountByStatus(status: string) {
    const query = await db('orders')
      .where('status', status)
      .count('* as total');

    const { total } = query[0];

    return total;
  },
  async selectTotalOrders() {
    const query = await db('orders').count('* as total');

    const { total } = query[0];

    return total;
  },
  async selectTotalSumOrders() {
    const query = await db('orders').sum('total as total');

    const { total } = query[0];

    return total ?? 0;
  },
  async selectByPaymentStatus(status: string) {
    const query = await db('orders')
      .where('payment_status', status)
      .count('* as total');

    const { total } = query[0];

    return total;
  },
  async selectByPaymentStatusAndSum(status: string) {
    const query = await db('orders')
      .where('payment_status', status)
      .sum('total as total');

    const { total } = query[0];

    return total ?? 0;
  },
};

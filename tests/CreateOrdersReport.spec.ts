import { queryOrder } from '../src/app/usecases/query-orders';

describe('create a new report orders', () => {
  it('should be able to get the report data from database', async () => {
    const report = `
    Número de pedidos: ${await queryOrder.selectTotalOrders()}
      Em produção: ${await queryOrder.selectAndCountByStatus('producao')}
      Finalizados: ${await queryOrder.selectAndCountByStatus('finalizado')}
      Faltando pagar: ${await queryOrder.selectByPaymentStatus('pendente')}
    \n
    Total R$ pedidos:
      Vendido: R$ ${await queryOrder.selectTotalSumOrders()}
      Recebido: R$ ${await queryOrder.selectByPaymentStatusAndSum('pago')}
      Faltando pagar: R$ ${await queryOrder.selectByPaymentStatusAndSum(
        'pendente',
      )}
    `;

    expect(report).toBeTruthy();
  });
});

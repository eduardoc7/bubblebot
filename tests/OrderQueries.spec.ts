import { IOrder, Item } from '../src/app/bot/interfaces/Order';
import { queryOrder } from '../src/app/usecases/query-orders';
import { UpdateOrder } from '../src/app/usecases/update-order';
import HelperCurrency from '../src/app/bot/utils/HelperCurrency';

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

  it('should be able to get all orders records from db', async () => {
    const result = await queryOrder.selectAllOrdersRecords();
    result.map((item: IOrder) => {
      const location = JSON.parse(item.location);
      const car_items = JSON.parse(item.items);

      const items_to_print = car_items.map((item: Item) => {
        return `
          •${item.name}:
          →Quantidade: ${item.quantity}
          →Preço: *${HelperCurrency.priceToString(Number(item.price))}*\n`;
      });

      const delivery_data = () => {
        if (item.delivery_method === 'entrega') {
          return `
          *Dados de entrega:*
          •Forma de entrega: ${item.delivery_method}
          •Balneário de entrega: ${location.bairro}
          •Latitude: ${location.latitude}
          •Longitude: ${location.longitude}
          •Taxa de entrega: ${location.taxa_entrega}`;
        }
        return undefined;
      };

      const message = `*DADOS DO PEDIDO*
        \n*ID*: ${item.id}
        \n*N° do pedido*: ${item.identifier}
        \n*Cliente:*
        •Nome: ${item.name}
        •Número de contato: ${item.contact_number}
        \n*Carrinho:*${items_to_print}
        ${delivery_data() ?? ''}
        \n*Dados de pagamento:*
        •Forma de pagamento: ${item.payment_method}
        •Status do pagamento: ${item.payment_status}
        \n*Status do pedido:* ${item.status}
        \nTotal da Compra: *${HelperCurrency.priceToString(Number(item.total))}*
        \n*Criado Em:* ${item.created_at}
        \n*Última atualização:* ${item.updated_at}
       `;
      // chama o client do whatsapp e envia a mensagem
    });
    expect(result).toBeTruthy();
  });
});

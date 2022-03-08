import { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../../cache/OrderHandlerCache';
import { IOrder } from '../../interfaces/Order';
import HelperCurrency from '../../utils/HelperCurrency';

export const InfoOrderCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg);
    } catch (e) {
      console.log(e);
      return msg.reply(
        'Ops! Nenhum pedido seu foi encontrado para visualização. ❌',
      );
    }

    const items_to_print = obj.items.map((item, index) => {
      return `
      •${item.name}:
      →Quantidade: ${item.quantity}
      →Preço: *${HelperCurrency.priceToString(Number(item.price))}*\n`;
    });

    const order_data = `*DADOS DO PEDIDO*
    \n*N° do pedido*: ${obj.identifier}
    \n*Cliente:*
    •Nome: ${obj.name}
    •Número de contato: ${obj.contact_number}
    \n*Carrinho:*${items_to_print}
    *Dados de entrega:*
    •Forma de entrega: ${obj.delivery_method}
    \n*Dados de pagamento:*
    •Forma de pagamento: ${obj.payment_method}
    •Status do pagamento: ${obj.payment_status}
    \n*Status do pedido*: ${obj.status}
    \nTotal da Compra: *${HelperCurrency.priceToString(Number(obj.total))}*
  `;

    await chat.sendMessage(order_data);
    return msg.reply(
      'Esse é o seu pedido ativo no momento, se deseja fazer um novo pedido, basta nos enviar um novo carrinho: *#car*',
    );
  },
};

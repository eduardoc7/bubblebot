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
      obj = await OrderHandlerCache.getOrderFromMessage(msg.from);
    } catch (e) {
      console.log(e);
      return msg.reply(
        'Ops! Nenhum pedido seu foi encontrado para visualização. ❌',
      );
    }

    const items_to_print = obj.items.map((item) => {
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
    •Balneário de entrega: ${obj.location.bairro}
    \n*Dados de pagamento:*
    •Forma de pagamento: ${obj.payment_method}
    •Status do pagamento: ${obj.payment_status}
    •Taxa de entrega: ${obj.location.taxa_entrega}
    \n*Status do pedido:* ${obj.status}
    \nTotal da Compra: *${HelperCurrency.priceToString(Number(obj.total))}*
    \n*Criado Em:* ${obj.created_at}
    \n*Última atualização:* ${obj.updated_at}
    `;

    await chat.sendMessage(order_data);
    return msg.reply(
      'Esse é o seu pedido ativo no momento, se deseja fazer um novo pedido, basta nos enviar um novo carrinho: *#car*',
    );
  },
};

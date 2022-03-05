import type { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import type { IOrder } from '../interfaces/Order';
import HelperCurrency from '../utils/HelperCurrency';

export const FinishOrderHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg);
    } catch (e) {
      console.log(e);
      return msg.reply(
        'Ops! Nenhum pedido seu foi encontrado para finalização.',
      );
    }

    obj.status = 'confirma-dados-pedido';
    await OrderHandlerCache.setOder('order:' + msg.from, JSON.stringify(obj));

    const items_to_print = obj.items.map((item, index) => {
      return `
      •${item.name}:
        →Quantidade: ${item.quantity}
        →Preço: *${HelperCurrency.priceToString(Number(item.price))}*\n`;
    });

    /**
     * @todo
     * quando os botoes funcionarem: primeiro dar um send message com os dados e depois enviar um botão de confirmação
     */
    return msg.reply(`
    \n*DADOS DO PEDIDO*
    \n*Cliente:*
    •Nome: ${obj.name}
    •Número de contato: ${obj.number}
    \n*Carrinho:*${items_to_print}
    \nTotal da Compra: *${HelperCurrency.priceToString(Number(obj.total))}*
    \n*Deseja confirmar o pedido?*
    `);
  },
};

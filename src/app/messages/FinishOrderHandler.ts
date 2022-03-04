import type { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import type { IOrder } from '../interfaces/Order';

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

    const items_to_print = obj.items.map((item) => {
      return `
      Nome: ${item.name}
      \nQuantidade: ${item.quantity}
      \nPreço: R$ ${item.price}`;
    });

    return msg.reply(`
      *Nome*: ${obj.name}
      \n*Número de Contato:* ${obj.number}
      \n*Carrinho*:
      ${items_to_print}
      *Total da Compra:* ${obj.total}

      *Deseja confirmar o pedido?*
    `);
  },
};

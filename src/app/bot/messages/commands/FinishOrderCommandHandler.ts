import type { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../../cache/OrderHandlerCache';
import { IOrder } from '../../interfaces/Order';
import HelperCurrency from '../../utils/HelperCurrency';
import { OrderMessageHandler } from '../OrderMessageHandler';

export const FinishOrderCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    let obj: IOrder;
    try {
      obj = await OrderHandlerCache.getOrderFromMessage(msg.from);
    } catch (e) {
      console.log(e);
      return msg.reply(
        'Ops! Nenhum pedido seu foi encontrado para finalização. ❌',
      );
    }

    const status_to_update = 'confirma-dados';
    if (!OrderMessageHandler.updateStatusOder(msg, status_to_update)) {
      console.log('Erro ao atualizar o status: ', status_to_update);
    }

    const items_to_print = obj.items.map((item) => {
      return `
      •${item.name}:
      →Quantidade: ${item.quantity}
      →Preço: *${HelperCurrency.priceToString(Number(item.price))}*\n`;
    });

    /**
     * @todo
     * quando os botoes funcionarem: primeiro dar um send message com os dados e depois enviar um botão de confirmação
     */
    return msg.reply(`*DADOS DO PEDIDO*
      \n*Cliente:*
      •Nome: ${obj.name}
      •Número de contato: ${obj.contact_number}
      \n*Carrinho:*${items_to_print}
      \nTotal da Compra: *${HelperCurrency.priceToString(Number(obj.total))}*
      \n*Deseja confirmar o pedido?*
    `);
  },
};

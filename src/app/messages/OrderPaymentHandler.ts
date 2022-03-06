import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';
import { OrderMessageHandler } from './OrderMessageHandler';
import { client } from '../../services/whatsapp';
import type { IOrder } from '../interfaces/Order';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import HelperCurrency from '../utils/HelperCurrency';
import HelperStr from '../utils/HelperStr';

export const OrderPaymentHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (HelperStr.formatMessageToCheck(msg.body) == 'pix') {
      const status_to_update = 'pagamento-dados';
      if (
        !OrderMessageHandler.setPaymentMethodToOrder(
          HelperStr.formatMessageToCheck(msg.body),
          status_to_update,
          msg,
        )
      ) {
        console.log(
          'Erro ao setar o método de pagamento: ',
          HelperStr.formatMessageToCheck(msg.body),
        );
      }

      return msg.reply(
        `Oba!! Seu pedido foi enviado para produção, você será notificado quando estiver pronto para entrega ou retirada.`,
      );
    } else if (
      HelperStr.formatMessageToCheck(msg.body) == 'cartao' ||
      HelperStr.formatMessageToCheck(msg.body) == 'dinheiro'
    ) {
      const status_to_update = 'pagamento-dados';
      if (
        !OrderMessageHandler.setPaymentMethodToOrder(
          HelperStr.formatMessageToCheck(msg.body),
          status_to_update,
          msg,
        )
      ) {
        console.log(
          'Erro ao setar o método de pagamento: ',
          HelperStr.formatMessageToCheck(msg.body),
        );
      }
      const obj: IOrder = await OrderHandlerCache.getOrderFromMessage(msg);

      client.sendMessage(
        msg._getChatId(),
        `Obrigado. Você realizará o pagamento no total de *${HelperCurrency.priceToString(
          Number(obj.total),
        )}* no momento da entrega ou retirada.`,
      );
      // falta dar um return sobre o produto ir pra produção
    }
    return AnyMessageHandler.execute(msg);
  },
};

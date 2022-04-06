import type { Message } from 'whatsapp-web.js';
import HelperStr from '../utils/HelperStr';
import { OrderMessageHandler } from './OrderMessageHandler';
import {
  greeting_messages,
  greeting_message_to_reply,
  production_status_message,
  last_option_message,
  created_status_message,
  confirm_data_status,
  confirm_address_data,
  confirm_delivery_data,
  confirm_payment_data,
  confirm_bairro_data,
  payment_required_message,
  finished_order_message,
  entrega_status_message,
  retirada_status_message,
} from '../utils/ReturnsMessages';
import OrderHandlerCache from '../cache/OrderHandlerCache';

export const AnyMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    if (await OrderHandlerCache.checkIfIsAtendimento(msg)) {
      return msg;
    }

    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const splited_message_body = HelperStr.formatMessageToCheck(msg.body).split(
      ' ',
    );

    const found = greeting_messages.some(
      (r) => splited_message_body.indexOf(r) >= 0,
    );
    if (found) {
      return msg.reply(greeting_message_to_reply);
    }

    if (await OrderMessageHandler.CheckExistsOrderToUser(msg)) {
      const order_status = await OrderMessageHandler.getStatusOrder(msg);

      console.log(order_status);
      switch (order_status) {
        case 'created':
          return msg.reply(created_status_message);
        case 'confirma-dados':
          return msg.reply(confirm_data_status);
        case 'endereco-dados':
          return msg.reply(confirm_address_data);
        case 'taxa-entrega':
          return msg.reply(confirm_bairro_data);
        case 'entrega-dados':
          return msg.reply(confirm_delivery_data);
        case 'pagamento-dados':
          return msg.reply(confirm_payment_data);
        case 'pix-pendente':
          return msg.reply(payment_required_message);
        case 'producao':
          return msg.reply(production_status_message);
        case 'entrega':
          return msg.reply(entrega_status_message);
        case 'retirada':
          return msg.reply(retirada_status_message);
        case 'finalizado':
          return msg.reply(finished_order_message);
      }
    }

    return msg.reply(last_option_message);
  },
};

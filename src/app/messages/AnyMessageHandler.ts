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
} from '../utils/ReturnsMessages';

export const AnyMessageHandler = {
  async execute(msg: Message): Promise<Message> {
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
        case 'entrega-dados':
          return msg.reply(confirm_delivery_data);
        case 'pagamento-dados':
          return msg.reply(confirm_payment_data);
        case 'producao':
          return msg.reply(production_status_message);
      }
    }

    return msg.reply(last_option_message);
  },
};

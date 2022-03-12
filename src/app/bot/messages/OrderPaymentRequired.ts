import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';

export const OrderPaymentRequired = {
  async execute(msg: Message): Promise<Message> {
    return AnyMessageHandler.execute(msg);
  },
};

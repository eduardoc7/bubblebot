import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';

export const RetiradaOrderStatusHandler = {
  async execute(msg: Message): Promise<Message> {
    return AnyMessageHandler.execute(msg);
  },
};

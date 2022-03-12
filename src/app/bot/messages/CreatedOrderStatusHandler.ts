import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';

export const CreatedOrderStatusHandler = {
  async execute(msg: Message): Promise<Message> {
    return AnyMessageHandler.execute(msg);
  },
};

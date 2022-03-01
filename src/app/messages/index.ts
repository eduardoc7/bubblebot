import { Message } from 'whatsapp-web.js';
import { messageDispatcher } from '../utils/MessageDispatcher';
import { OrderMessageHandler } from './OrderMessageHandler';

export const MessageHandler = async (message: Message): Promise<void> => {
  await messageDispatcher.register('order', OrderMessageHandler);

  return messageDispatcher.dispatch(message.type, message);
};

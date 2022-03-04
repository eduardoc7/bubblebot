import { Message } from 'whatsapp-web.js';
import { messageDispatcher } from '../utils/MessageDispatcher';
import { OrderMessageHandler } from './OrderMessageHandler';
import { FinishOrderHandler } from './FinishOrderHandler';
import { AnyMessageHandler } from './AnyMessageHandler';

export const MessageHandler = async (message: Message): Promise<void> => {
  console.log(message);

  await messageDispatcher.register('order', OrderMessageHandler);
  await messageDispatcher.register('finalizar', FinishOrderHandler);
  // if (!message.fromMe) {
  //   await messageDispatcher.register('chat', AnyMessageHandler);
  // }

  const dispatchName = !message.body.startsWith('#')
    ? message.type
    : message.body.slice(1);

  return messageDispatcher.dispatch(dispatchName, message);
};

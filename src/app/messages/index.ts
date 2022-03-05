import { Message } from 'whatsapp-web.js';
import { messageDispatcher } from '../utils/MessageDispatcher';
import { OrderMessageHandler } from './OrderMessageHandler';
import { FinishOrderHandler } from './FinishOrderHandler';
import { AnyMessageHandler } from './AnyMessageHandler';
import { ConfirmDataStatusHandler } from './ConfirmDataStatusHandler';

export const MessageHandler = async (message: Message): Promise<void> => {
  console.log(message);

  let dispatchName = '';
  if (!message.fromMe) {
    await messageDispatcher.register('order', OrderMessageHandler);
    await messageDispatcher.register('finalizar', FinishOrderHandler);
    await messageDispatcher.register('chat', AnyMessageHandler);
    await messageDispatcher.register(
      'confirma-dados-pedido',
      ConfirmDataStatusHandler,
    );

    const isOrder = message.type == 'order';
    console.log('ISORDER: ', isOrder);

    if (
      (await OrderMessageHandler.CheckExistsOrderToUser(message)) &&
      !isOrder
    ) {
      const order_status = await OrderMessageHandler.getStatusOrder(message);

      console.log('STATUS PEDIDO: ', order_status);

      dispatchName = !message.body.startsWith('#')
        ? order_status
        : message.body.slice(1);
    } else {
      dispatchName = !message.body.startsWith('#')
        ? message.type
        : message.body.slice(1);
    }
  }

  return messageDispatcher.dispatch(dispatchName, message);
};

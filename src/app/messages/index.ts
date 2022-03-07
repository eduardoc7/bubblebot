import { Message } from 'whatsapp-web.js';
import { messageDispatcher } from '../utils/MessageDispatcher';
import { OrderMessageHandler } from './OrderMessageHandler';
import { AnyMessageHandler } from './AnyMessageHandler';
import { ConfirmDataStatusHandler } from './ConfirmDataStatusHandler';
import { OrderAddressHandler } from './OrderAddressHandler';
import { OrderDeliveryDataHandler } from './OrderDeliveryDataHandler';
import { OrderPaymentHandler } from './OrderPaymentHandler';
import { OrderProductionStatusHandler } from './OrderProductionStatusHandler';
import { CreatedOrderStatusHandler } from './CreatedOrderStatusHandler';

import { FinishOrderCommandHandler } from './commands/FinishOrderCommandHandler';
import { DoubtCommandHandler } from './commands/DoubtCommandHandler';
import { AboutBotCommandHandler } from './commands/AboutBotCommandHandler';
import { CarTutorialCommandHandler } from './commands/CarTutorialCommandHandler';
import { InfoOrderCommandHandler } from './commands/InfoOrderCommandHandler';
import { CancelOrderCommandHandler } from './commands/CancelOrderCommandHandler';
import { AtendenteCommandHandler } from './commands/AtendenteCommandHandler';

export const MessageHandler = async (message: Message): Promise<void> => {
  console.log(message);

  let dispatchName = '';
  if (!message.fromMe) {
    // handlers by commands
    await messageDispatcher.register('ok', FinishOrderCommandHandler);
    await messageDispatcher.register('duvidas', DoubtCommandHandler);
    await messageDispatcher.register('bot', AboutBotCommandHandler);
    await messageDispatcher.register('car', CarTutorialCommandHandler);
    await messageDispatcher.register('ver', InfoOrderCommandHandler);
    await messageDispatcher.register('cancelar', CancelOrderCommandHandler);
    await messageDispatcher.register('atendente', AtendenteCommandHandler);

    // handlers by messages types
    await messageDispatcher.register('order', OrderMessageHandler);
    await messageDispatcher.register('chat', AnyMessageHandler);

    // handlers by order status
    await messageDispatcher.register('created', CreatedOrderStatusHandler);
    await messageDispatcher.register(
      'confirma-dados',
      ConfirmDataStatusHandler,
    );
    await messageDispatcher.register('endereco-dados', OrderAddressHandler);
    await messageDispatcher.register('entrega-dados', OrderDeliveryDataHandler);
    await messageDispatcher.register('pagamento-dados', OrderPaymentHandler);
    await messageDispatcher.register('producao', OrderProductionStatusHandler);

    const isOrder = message.type == 'order';

    if (
      (await OrderMessageHandler.CheckExistsOrderToUser(message)) &&
      !isOrder
    ) {
      const order_status = await OrderMessageHandler.getStatusOrder(message);

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

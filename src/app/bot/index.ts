import { Message } from 'whatsapp-web.js';
import { messageDispatcher } from './utils/MessageDispatcher';
import { OrderMessageHandler } from './messages/OrderMessageHandler';
import { AnyMessageHandler } from './messages/AnyMessageHandler';
import { ConfirmDataStatusHandler } from './messages/ConfirmDataStatusHandler';
import { OrderAddressHandler } from './messages/OrderAddressHandler';
import { OrderDeliveryDataHandler } from './messages/OrderDeliveryDataHandler';
import { OrderPaymentHandler } from './messages/OrderPaymentHandler';
import { OrderProductionStatusHandler } from './messages/OrderProductionStatusHandler';
import { CreatedOrderStatusHandler } from './messages/CreatedOrderStatusHandler';
import { OrderTaxaDeliveryHandler } from './messages/OrderTaxaDeliveryHandler';
import { OrderPaymentRequired } from './messages/OrderPaymentRequired';
import { OrderFinishedStatusHandler } from './messages/OrderFinishedStatusHandler';
import { DeliveryOrderStatusHandler } from './messages/DeliveryOrderStatusHandler';
import { RetiradaOrderStatusHandler } from './messages/RetiradaOrderStatusHandler';

import { FinishOrderCommandHandler } from './messages/commands/FinishOrderCommandHandler';
import { DoubtCommandHandler } from './messages/commands/DoubtCommandHandler';
import { AboutBotCommandHandler } from './messages/commands/AboutBotCommandHandler';
import { CarTutorialCommandHandler } from './messages/commands/CarTutorialCommandHandler';
import { InfoOrderCommandHandler } from './messages/commands/InfoOrderCommandHandler';
import { CancelOrderCommandHandler } from './messages/commands/CancelOrderCommandHandler';
import { HelpCommandHandler } from './messages/commands/HelpCommandHandler';
import { DoneAtendimentoHandler } from './messages/commands/DoneAtendimentoHandler';
import { UpdateOrderStatusCommand } from './messages/commands/UpdateOrderStatusCommand';
import { ReportOrdersCommandHandler } from './messages/commands/ReportOrdersCommandHandler';
import { LoadOrdersFromDbToGroup } from './messages/commands/LoadOrdersFromDbToGroup';
import { UpdatePaymentStatusCommand } from './messages/commands/UpdatePaymentStatusCommand';
import { CreatePaymentPixCommand } from './messages/commands/CreatePaymentPixCommand';

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
    await messageDispatcher.register('cancela', CancelOrderCommandHandler);
    await messageDispatcher.register('ajuda', HelpCommandHandler);
    await messageDispatcher.register('encerra', DoneAtendimentoHandler);
    await messageDispatcher.register('atualiza', UpdateOrderStatusCommand);
    await messageDispatcher.register('pedidos', ReportOrdersCommandHandler);
    await messageDispatcher.register('mostra', LoadOrdersFromDbToGroup);
    await messageDispatcher.register('pay', UpdatePaymentStatusCommand);
    await messageDispatcher.register('pix', CreatePaymentPixCommand);

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
    await messageDispatcher.register('taxa-entrega', OrderTaxaDeliveryHandler);
    await messageDispatcher.register('entrega-dados', OrderDeliveryDataHandler);
    await messageDispatcher.register('pagamento-dados', OrderPaymentHandler);
    await messageDispatcher.register('pix-pendente', OrderPaymentRequired);
    await messageDispatcher.register('producao', OrderProductionStatusHandler);
    await messageDispatcher.register('entrega', DeliveryOrderStatusHandler);
    await messageDispatcher.register('retirada', RetiradaOrderStatusHandler);
    await messageDispatcher.register('finalizado', OrderFinishedStatusHandler);

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

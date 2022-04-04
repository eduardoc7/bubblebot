import { Message } from 'whatsapp-web.js';
import { queryOrder } from '../../../usecases/query-orders';
import { HelperCommands } from '../../utils/HelperCommands';

export const ReportOrdersCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (!HelperCommands.checkIfIsAdmin(msg.from)) {
      return msg.reply(
        'Desculpe! Você não tem permissão para usar esse comando. ❌',
      );
    }

    const report = `
    Número de pedidos: *${await queryOrder.selectTotalOrders()}*
      Em produção: *${await queryOrder.selectAndCountByStatus('producao')}*
      Finalizados: *${await queryOrder.selectAndCountByStatus('finalizado')}*
      Faltando pagar: *${await queryOrder.selectByPaymentStatus('pendente')}*
    \n
    Total R$ pedidos:
      Vendido: *R$ ${await queryOrder.selectTotalSumOrders()}*
      Recebido: *R$ ${await queryOrder.selectByPaymentStatusAndSum('pago')}*
      Faltando pagar: *R$ ${await queryOrder.selectByPaymentStatusAndSum(
        'pendente',
      )}*
    `;

    return msg.reply(report);
  },
};

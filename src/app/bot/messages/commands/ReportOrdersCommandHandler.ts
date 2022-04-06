import { Message } from 'whatsapp-web.js';
import { queryOrder } from '../../../usecases/query-orders';
import { HelperCommands } from '../../utils/HelperCommands';
import HelperCurrency from '../../utils/HelperCurrency';

export const ReportOrdersCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (!HelperCommands.checkIfIsAdmin(msg.from)) {
      return msg.reply(
        'Desculpe! Você não tem permissão para usar esse comando. ❌',
      );
    }

    const report = `*RELATÓRIO* 
    \nNúmero de pedidos 📋: *${await queryOrder.selectTotalOrders()}*
      Em produção ⌛️: *${await queryOrder.selectAndCountByStatus('producao')}*
      Finalizados ✅: *${await queryOrder.selectAndCountByStatus('finalizado')}*
      Entrega 🚚: *${await queryOrder.selectAndCountByStatus('entrega')}*
      Retirada 🛎: *${await queryOrder.selectAndCountByStatus('retirada')}*
      Faltando pagar 📲: *${await queryOrder.selectByPaymentStatus('pendente')}*
    \nTotal *R$* pedidos:
      Vendido 📈: *${HelperCurrency.priceToString(
        await queryOrder.selectTotalSumOrders(),
      )}*
      Recebido ✅: *${HelperCurrency.priceToString(
        await queryOrder.selectByPaymentStatusAndSum('pago'),
      )}*
      Faltando pagar ❗️: *${HelperCurrency.priceToString(
        await queryOrder.selectByPaymentStatusAndSum('pendente'),
      )}*
    `;

    return msg.reply(report);
  },
};

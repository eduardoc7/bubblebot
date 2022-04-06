import { Message } from 'whatsapp-web.js';
import { queryOrder } from '../../../usecases/query-orders';
import { IOrder } from '../../interfaces/Order';
import { HelperCommands } from '../../utils/HelperCommands';
import { HelperPaymentPix } from '../../utils/HelperPaymentPix';

export const CreatePaymentPixCommand = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (!HelperCommands.checkIfIsAdmin(msg.from)) {
      return msg.reply(
        'Desculpe! Você não tem permissão para usar esse comando. ❌',
      );
    }

    const splited_body = msg.body.split(' ');
    const order_id = splited_body[1];
    if (order_id === undefined) {
      return msg.reply(
        'Para gerar um pagamento Pix, digite *#pix <id do pedido ex: *5*> ❌',
      );
    }

    const order_data_from_db: IOrder = await queryOrder.selectOrderById(
      Number(order_id),
    );

    await HelperPaymentPix.genPaymentPixFromOrder(
      order_data_from_db,
      msg.from,
      true,
    );

    return msg.reply('Pagamento gerado com sucesso! ✅');
  },
};

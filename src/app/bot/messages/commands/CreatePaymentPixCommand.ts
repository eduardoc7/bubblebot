import { Message } from 'whatsapp-web.js';
import { HelperCommands } from '../../utils/HelperCommands';

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

    return msg.reply('Pagamento gerado com sucesso! ✅');
  },
};

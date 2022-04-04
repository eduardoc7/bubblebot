import { Message } from 'whatsapp-web.js';
import { HelperCommands } from '../../utils/HelperCommands';

export const UpdateOrderStatusCommand = {
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
    const status_to_update = splited_body[2];
    if (order_id === undefined || status_to_update === undefined) {
      return msg.reply(
        'Para atualizar um status, digite *#atualizar <id do pedido ex: *5*> <status>* ❌',
      );
    }

    await HelperCommands.updateOrderStatusAndNotify(
      Number(order_id),
      status_to_update,
      msg,
    );

    return msg.reply(
      'Status do pedido atualizado e notificado com sucesso! ✅',
    );
  },
};

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
    const notification_to = splited_body[1];
    const status_to_update = splited_body[2];
    if (notification_to === undefined || status_to_update === undefined) {
      return msg.reply(
        'Para atualizar um status, digite *#atualizar <numero da pessoa ex: 5541000000000> <status>* ❌',
      );
    }

    const notification_to_formated = notification_to + '@c.us';

    await HelperCommands.updateOrderStatusAndNotify(
      notification_to_formated,
      status_to_update,
      msg,
    );

    return msg.reply('Entrega notificada com sucesso ✅');
  },
};

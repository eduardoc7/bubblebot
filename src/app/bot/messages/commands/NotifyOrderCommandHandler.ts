import { Message } from 'whatsapp-web.js';
import { HelperCommands } from '../../utils/HelperCommands';

export const NotifyOrderHandler = {
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
    if (notification_to === undefined) {
      return msg.reply(
        'Para notificar alguém de entrega, digite *#entrega <numero da pessoa ex: 5541000000000>* ❌',
      );
    }
    const notification_to_formated = notification_to + '@c.us';

    await HelperCommands.updateOrderStatusAndNotify(
      notification_to_formated,
      'a caminho',
      msg,
    );

    return msg.reply('Entrega notificada com sucesso ✅');
  },
};

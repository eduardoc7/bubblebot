import dotenv from 'dotenv';
import moment from 'moment';
import { Message } from 'whatsapp-web.js';
import { client } from '../../../services/whatsapp';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import { IOrder } from '../interfaces/Order';
import { HelperOrderProduction } from './HelperOrderProduction';

dotenv.config();

export const HelperCommands = {
  checkIfIsAdmin(message_from: string): boolean {
    if (process.env.ADMINS != null) {
      const admins = process.env.ADMINS.split(' ');

      if (admins.indexOf(message_from) > -1) {
        return true;
      }
    }

    return false;
  },
  async updateOrderStatusAndNotify(
    notification_to: string,
    status_to_update: string,
    msg: Message,
  ): Promise<Message> {
    let obj_order: IOrder;
    try {
      obj_order = await OrderHandlerCache.getOrderFromMessage(notification_to);
    } catch (e) {
      console.log(e);
      return msg.reply('Ops! Ocorreu um erro ao buscar esse pedido.');
    }

    if (obj_order.status != 'producao') {
      return msg.reply(
        'Ops! Só é possível atualizar pedidos, se antes eles estiverem em produção',
      );
    }

    const now = moment().format('DD-MM-YYYY-hh:mm:ss');
    obj_order.status = status_to_update;
    obj_order.updated_at = now;

    await OrderHandlerCache.setOder(
      'order:' + msg.from,
      JSON.stringify(obj_order),
    );

    let message_to_reply;
    switch (status_to_update) {
      case 'a caminho':
        message_to_reply =
          '\nAgora ele está a caminho da sua localização, por favor, prepare-se para recebe-lo';
        break;
      case 'finalizado':
        message_to_reply = `\nSeu pedido foi finalizado com sucesso ✅.
        \nAgradecemos a preferência e esperamos nos encontrar com você mais e mais vezes.
        \nSe você gostou da experiência, compartilhe nos marcando nas redes sociais:
        \n👉Instagram - https://www.instagram.com/magicbubblesart/
        \n👉Facebook - https://www.facebook.com/magicbubbles`;
        break;
    }

    HelperOrderProduction.create({
      message_from: notification_to,
      isUpdated: true,
    });

    return await client.sendMessage(
      notification_to,
      `Eiii, passamos pra avisar que o seu pedido *N° ${obj_order.identifier}* foi atualizado! ${message_to_reply}`,
    );
  },
};

import dotenv from 'dotenv';
import { Message } from 'whatsapp-web.js';
import { client } from '../../../services/whatsapp';
import { UpdateOrder } from '../../usecases/update-order';

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
    order_id: number,
    status_to_update: string,
    msg: Message,
  ): Promise<Message> {
    let notification_to;
    try {
      notification_to = await UpdateOrder.updateOrderByStatus(
        order_id,
        status_to_update,
      );
    } catch (e) {
      console.error('Error updating order status: ', e);

      return msg.reply('Ops! Ocorreu um erro ao buscar esse pedido.');
    }

    /**
     * @todo adicionar localização na mensagem de retirada
     */
    let message_to_reply;
    switch (status_to_update) {
      case 'a caminho':
        message_to_reply =
          '\nAgora ele está a caminho da sua localização, por favor, prepare-se para recebe-lo';
        break;
      case 'finalizado':
        message_to_reply = `\nAgora seu pedido foi finalizado ✅.
        \nAgradecemos a preferência e esperamos nos encontrar com você mais e mais vezes.
        \nSe você gostou da experiência, compartilhe nos marcando nas redes sociais:
        \n👉Instagram - https://www.instagram.com/magicbubblesart/
        \n👉Facebook - https://www.facebook.com/magicbubbles`;
        break;
      case 'retirada':
        message_to_reply =
          '\nNotícia boa! Seu pedido está pronto para retirada.';
        break;
      default:
        message_to_reply = '';
    }

    return await client.sendMessage(
      notification_to,
      `Eiii, passamos pra avisar que o seu pedido conosco foi atualizado! ${message_to_reply}
      \n\nVocê também pode digitar *#ver* para visualizar mais informações sobre seu pedido.`,
    );
  },
};

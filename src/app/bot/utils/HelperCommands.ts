import dotenv from 'dotenv';
import { Message, Location } from 'whatsapp-web.js';
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
    let location;
    switch (status_to_update) {
      case 'entrega':
        message_to_reply =
          '\nAgora ele está a caminho da sua localização, por favor, prepare-se para recebe-lo';
        break;
      case 'finalizado':
        message_to_reply = `\nAgora seu pedido foi finalizado ✅.
        \nAgradecemos a preferência! Obrigado por utilizar nossos serviços, trabalhamos para sua experiência conosco ser a melhor!.
        \nSe você gostou, compartilhe nos marcando nas redes sociais:
        \n👉Instagram - [link do Instagram]
        \n👉Facebook - [link do Facebook]`;
        break;
      case 'retirada':
        message_to_reply =
          '\nNotícia boa! Seu pedido está pronto para retirada na localização acima.';
        location = new Location(
          Number(process.env.LOCATION_LAT) ?? 0,
          Number(process.env.LOCATION_LON) ?? 0,
        );
        break;
      default:
        message_to_reply = '';
    }
    if (location !== undefined) {
      await client.sendMessage(notification_to, location || '');
    }

    return await client.sendMessage(
      notification_to,
      `Eiii, passamos pra avisar que o seu pedido conosco foi atualizado! ${message_to_reply}
      \n\nVocê também pode digitar *#ver* para visualizar mais informações sobre seu pedido.`,
    );
  },
  async updatePaymentStatusAndNotify(
    order_id: number,
    status_to_update: string,
    msg: Message,
  ): Promise<Message> {
    let notification_to;
    try {
      notification_to = await UpdateOrder.updatePaymentByStatus(
        order_id,
        status_to_update,
      );
    } catch (e) {
      console.error('Error updating order status: ', e);

      return msg.reply('Ops! Ocorreu um erro ao buscar esse pedido.');
    }

    if (status_to_update === 'pago') {
      return await client.sendMessage(
        notification_to,
        `Seu pagamento foi confirmado ✅!
        \n\nVocê também pode digitar *#ver* para visualizar mais informações sobre seu pedido.`,
      );
    }

    return msg.reply('');
  },
};

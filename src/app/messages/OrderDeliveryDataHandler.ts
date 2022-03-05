import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';
import { OrderMessageHandler } from './OrderMessageHandler';
import { client } from '../../services/whatsapp';

export const OrderDeliveryDataHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (msg.type == 'location') {
      const status_to_update = 'pagamentos-dados';
      if (!OrderMessageHandler.updateStatusOder(msg, status_to_update)) {
        console.log('Erro ao atualizar o status: ', status_to_update);
      }

      if (
        !OrderMessageHandler.setAddressLocationToOrder(
          msg.location.latitude,
          msg.location.longitude,
          msg,
        )
      ) {
        console.log('Erro ao salvar localização no cache.');
      }

      client.sendMessage(
        msg._getChatId(),
        'Obrigado. Seus dados de localização foram registrados com segurança.',
      );

      return msg.reply(`
    \nAgora precisamos preencher alguns dados de *pagamento*. 
    \nNos diga o método de pagamento da sua preferência: *Cartão*, *Dinheiro* ou *Pix*?`);
    }

    return AnyMessageHandler.execute(msg);
  },
};

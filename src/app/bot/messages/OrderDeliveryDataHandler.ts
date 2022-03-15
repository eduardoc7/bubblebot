import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';
import { OrderMessageHandler } from './OrderMessageHandler';

export const OrderDeliveryDataHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (msg.type == 'location') {
      const status_to_update = 'pagamento-dados';

      if (
        !OrderMessageHandler.setAddressLocationToOrder(
          msg.location.latitude,
          msg.location.longitude,
          status_to_update,
          msg,
        )
      ) {
        console.log('Erro ao salvar localização no cache.');
      }

      await chat.sendMessage(
        'Obrigado. Seus dados de localização foram registrados com segurança.',
      );

      return msg.reply(`Agora precisamos preencher alguns dados de *pagamento*. 
    \nNos diga o método de pagamento da sua preferência: *Cartão*, *Dinheiro* ou *Pix*?`);
    }

    return AnyMessageHandler.execute(msg);
  },
};

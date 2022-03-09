import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';
import { OrderMessageHandler } from './OrderMessageHandler';
import { client } from '../../services/whatsapp';

export const OrderTaxaDeliveryHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    console.log('fora DO IF');
    if (Number(msg.body) != 0 && Number(msg.body) <= 5) {
      console.log('dentro do IF');
      const status_to_update = 'entrega-dados';

      if (
        !OrderMessageHandler.setBairroToOrder(
          status_to_update,
          Number(msg.body),
          msg,
        )
      ) {
        console.log('Erro ao salvar localização no cache.');
      }

      client.sendMessage(
        msg._getChatId(),
        'Obrigado. Seu balneário foi registrado e a taxa de entregada aplicada ;).',
      );

      return msg.reply(`Precisamos que você nos envie a sua *localização*
      \nPara isso siga alguns pequenos passos:
      \n1. Verifique se o serviço de localização está *ativo* no seu celular
      \n2. Clique no ícone 🔗 acima do teclado
      \n3. Clique em localização
      \n4. E por fim clique em *Localização atual* (localizado abaixo do titúlo *locais próximos*)
      `);
    }

    console.log('FORA RETURN');

    return AnyMessageHandler.execute(msg);
  },
};

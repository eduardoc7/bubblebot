import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';
import { OrderMessageHandler } from './OrderMessageHandler';
import HelperStr from '../utils/HelperStr';

export const OrderAddressHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (HelperStr.formatMessageToCheck(msg.body) == 'entrega') {
      const status_to_update = 'taxa-entrega';
      if (
        !OrderMessageHandler.setDeliveryMethodToOrder(
          HelperStr.formatMessageToCheck(msg.body),
          status_to_update,
          msg,
        )
      ) {
        console.log(
          'Erro ao setar o método de entrega: ',
          HelperStr.formatMessageToCheck(msg.body),
        );
      }

      await chat.sendMessage(
        `Certo! Enviaremos sua encomenda com segurança dentro do prazo de entrega no conforto da sua casa.`,
      );

      return msg.reply(`Agora precisamos que você selecione o seu balneário *digitando entre 1 e 5*
      \n\n*Balneários:*
      \n1. Shangrila - taxa: *R$ 5,00*
      \n2. Ipanema - taxa: *R$ 8,00*
      \n3. Pontal do Sul - taxa: *R$ 10,00*
      \n4. Santa Terezinha - taxa: *R$ 12,00*
      \n5. Praia de Leste - taxa: *R$ 15,00*
      \nMarque aquele que se localiza mais *próximo do seu balneário*
      \n\nVocê também pode digitar *#duvidas* para saber mais
      `);
    } else if (HelperStr.formatMessageToCheck(msg.body) == 'retirada') {
      const status_to_update = 'pagamento-dados';
      if (
        !OrderMessageHandler.setDeliveryMethodToOrder(
          HelperStr.formatMessageToCheck(msg.body),
          status_to_update,
          msg,
        )
      ) {
        console.log(
          'Erro ao setar o método de entrega: ',
          HelperStr.formatMessageToCheck(msg.body),
        );
      }

      await chat.sendMessage(
        `Certo! Você será notificado assim que a sua encomenda estiver pronta para retirada :).`,
      );

      return msg.reply(`Agora precisamos preencher alguns dados de *pagamento*. 
      \nNos diga o método de pagamento da sua preferência: *Cartão*, *Dinheiro* ou *Pix*?`);
    }

    return AnyMessageHandler.execute(msg);
  },
};

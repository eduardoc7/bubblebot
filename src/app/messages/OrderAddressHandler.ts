import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';
import { OrderMessageHandler } from './OrderMessageHandler';
import { client } from '../../services/whatsapp';
import HelperStr from '../utils/HelperStr';

export const OrderAddressHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (HelperStr.formatMessageToCheck(msg.body) == 'entrega') {
      const status_to_update = 'entrega-dados';
      if (!OrderMessageHandler.updateStatusOder(msg, status_to_update)) {
        console.log('Erro ao atualizar o status: ', status_to_update);
      }

      client.sendMessage(
        msg._getChatId(),
        `Certo! Enviaremos sua encomenda com segurança dentro do prazo de entrega no conforto da sua casa. 
        \nCom uma taxa de apenas *R$ 10,00* para Pontal do Paraná - PR`,
      );

      return msg.reply(`Precisamos que você nos envie a sua *localização*
      \nPara isso siga alguns pequenos passos:
      \n1. Verifique se o serviço de localização está *ativo* no seu celular
      \n2. Clique no ícone 🔗 acima do teclado
      \n3. Clique em localização
      \n4. E por fim clique em *Localização atual* (localizado abaixo do titúlo *locais próximos*)
      `);
    } else if (HelperStr.formatMessageToCheck(msg.body) == 'retirada') {
      const status_to_update = 'pagamento-dados';
      if (!OrderMessageHandler.updateStatusOder(msg, status_to_update)) {
        console.log('Erro ao atualizar o status: ', status_to_update);
      }

      client.sendMessage(
        msg._getChatId(),
        `Certo! Você será notificado assim que a sua encomenda estiver pronta para retirada :).`,
      );
      // return para preencher dados do pagamento
    }

    return AnyMessageHandler.execute(msg);
  },
};

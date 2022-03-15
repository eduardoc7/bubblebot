import type { Message } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';
import { OrderMessageHandler } from './OrderMessageHandler';
import HelperStr from '../utils/HelperStr';

export const ConfirmDataStatusHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (HelperStr.formatMessageToCheck(msg.body) == 'sim') {
      const status_to_update = 'endereco-dados';
      if (!OrderMessageHandler.updateStatusOder(msg, status_to_update)) {
        console.log('Erro ao atualizar o status: ', status_to_update);
      }

      await chat.sendMessage(
        `Agora precisamos que você nos diga alguns dados de entrega e pagamento. Será rapidinho.`,
      );

      return msg.reply(
        `Nos diga o método de entrega da sua preferência: *Entrega* ou *Retirada?*`,
      );
    } else if (HelperStr.formatMessageToCheck(msg.body) == 'nao') {
      const status_to_update = 'created';
      if (!OrderMessageHandler.updateStatusOder(msg, status_to_update)) {
        console.log('Erro ao atualizar o status: ', status_to_update);
      }

      return msg.reply(
        `Ok. Tudo bem. Atualize os itens do seu carrinho e cuidaremos do resto :).`,
      );
    }

    return AnyMessageHandler.execute(msg);
  },
};

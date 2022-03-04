import type { Message } from 'whatsapp-web.js';
import { OrderMessageHandler } from './OrderMessageHandler';

export const AnyMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    /**
     * recebo qualquer mensagem:
     * existe um pedido?
     * se sim: qual o status?
     * se não: nao faz nada ou nao entendi oq disse
     * status: depois do finalizar
     *  então: preenche os outros campos
     */
    // if (await OrderMessageHandler.CheckExistsOrderToUser(msg)) {
    //   await OrderMessageHandler.StatusOrderHandler(msg);
    // }

    return msg.reply(
      `Eita, que coisa. Não entendi :/
      \nMas está tudo bem.
      \nDigite *#atendente* para conseguir a ajuda que precisa e esclarer dúvidas`,
    );
  },
};

import type { Message } from 'whatsapp-web.js';
import { OrderMessageHandler } from './OrderMessageHandler';

export const AnyMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    /**
     * verifica qual o status e retorna uma mensagem, baseado nisso:
     * exemplo:
     * seu status é confirmar dados, por favor digite sim ou não para prosseguir
     */
    return msg.reply(
      `Eita, que coisa. Não entendi :/ \nMas está tudo bem.
    \nPor esse canal do Whatsapp você pode:
    \n1. *Fazer uma compra*: Clique no link para abrir o catálogo https://wa.me/c/554199210363 -> selecione os itens que deseja -> adicione ao carrinho -> clique no 🛒 acima -> nos envie o carrinho com os produtos, clicando em ➤.   
    \n2. *Falar com um de nossos atendentes:* Digite *#atendente*`,
    );
  },
};

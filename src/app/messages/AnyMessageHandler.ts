import type { Message } from 'whatsapp-web.js';
import HelperStr from '../utils/HelperStr';
import { OrderMessageHandler } from './OrderMessageHandler';

export const AnyMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const greeting_messages = [
      'ola',
      'oi',
      'bomdia',
      'boatarde',
      'boanoite',
      'hey',
      'ola,gostariadeconhecermelhoramagicbubbles',
    ];
    const greeting_message_to_reply = `Oiii. É um prazer tê-lo aqui. Seja muito bem vindo ao canal de atendimento e compras da ⭐ *Magic Bubbles* ⭐
    \nNossos robôs trabalham *24 horas por dia* e *7 dias da semana*, para oferecer o melhor atendimento aos nossos clientes.
    \nTodo o *processo de compra* é feito pelo Whatsapp de forma automatizada, basta enviar um *carrinho com os produtos* que deseja comprar e cuidaremos do resto pra você ;).
    \nPara aprender a enviar um carrinho e fazer uma compra em nossa loja, digite: *#car* 
    \nVocê também pode digitar *#duvidas* para saber mais.
    `;

    if (
      greeting_messages.indexOf(HelperStr.formatMessageToCheck(msg.body)) > -1
    ) {
      return msg.reply(greeting_message_to_reply);
    }

    /**
     * verifica qual o status e retorna uma mensagem, baseado nisso:
     * exemplo:
     * seu status é confirmar dados, por favor digite sim ou não para prosseguir
     */
    if (await OrderMessageHandler.CheckExistsOrderToUser(msg)) {
      const order_status = await OrderMessageHandler.getStatusOrder(msg);
      switch (order_status) {
        case 'producao':
          return msg.reply(
            `Opa, legal! Verifiquei aqui e vi que você tem um pedido sendo preparado com muito cuidado pela nossa produção.
            Você será notificado quando ele estiver pronto para entrega ou retirada.
            Para visualizar seu pedido digite: *#ver*`,
          );
      }
    }
    return msg.reply(`Eita, que coisa. Não entendi :/ \nMas está tudo bem.
    \nPor esse canal do Whatsapp você pode:
    \n1. *Fazer uma compra*: Clique no link para abrir o catálogo https://wa.me/c/554199210363 -> selecione os itens que deseja -> adicione ao carrinho -> clique no 🛒 acima -> nos envie o carrinho com os produtos, clicando em ➤.   
    \n2. *Falar com um de nossos atendentes:* Digite *#atendente*`);
  },
};

import type { Message } from 'whatsapp-web.js';

export const DoubtCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    return msg.reply(`Quem somos nós?
      👉 A Magic Bubbles é uma empresa de artesanato, que vende seus produtos de forma digital através do Whatsapp.
      \nQual o local de atendimento?
      👉 No momento, enviamos nossos produtos apenas para Pontal do Paraná - PR e região.
      \nComo faço pra comprar os produtos?
      👉 Você pode escolher os itens que deseja no nosso catálogo e nos enviar um carrinho preenchido. Para ver como fazer isso, digite *#car*
      \nComo os produtos são feitos?
      👉 Todos os nossos produtos são feitos a mão cuidando de cada minucioso detalhe para entregar o melhor para os nossos clientes.
      \nO que eu posso fazer aqui pelo Whatsapp?
      👉 Gerar um pedido e fazer uma compra de modo automatizado: *#car*
      👉 Falar com um de nossos atendentes: *#ajuda*
      👉 Saber mais sobre o nosso bot: *#bot*
      \nDepois de fazer uma compra, como posso gerenciar meu pedido?
      👉 Para visualizar seu pedido: *#ver*
      👉 Para cancelar seu pedido: *#cancelar*
      \nNos siga nas redes sociais para não perder nenhuma novidade:
      👉Instagram - https://www.instagram.com/magicbubblesart/
      👉Facebook - https://www.facebook.com/magicbubbles
      👉Whatsapp - bit.ly/36J59sd
      `);
  },
};

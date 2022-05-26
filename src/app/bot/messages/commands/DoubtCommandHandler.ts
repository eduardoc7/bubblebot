import type { Message } from 'whatsapp-web.js';

export const DoubtCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    return msg.reply(`Quem somos nós?
      👉 [resposta]
      \nQual o local de atendimento?
      👉 [resposta]
      \nComo faço pra comprar os produtos?
      👉 Você pode escolher os itens que deseja no nosso catálogo e nos enviar um carrinho preenchido. Para ver como fazer isso, digite *#car*
      \nComo os produtos são feitos?
      👉 [resposta]
      \nO que eu posso fazer aqui pelo Whatsapp?
      👉 Gerar um pedido e fazer uma compra de modo automatizado: *#car*
      👉 Falar com um de nossos atendentes: *#ajuda*
      👉 Saber mais sobre o nosso bot: *#bot*
      \nDepois de fazer uma compra, como posso gerenciar meu pedido?
      👉 Para visualizar seu pedido: *#ver*
      👉 Para cancelar seu pedido: *#cancelar*
      \nNos siga nas redes sociais para não perder nenhuma novidade:
      👉Instagram - [link do Instagram]
      👉Facebook - [link do Facebook]
      👉Whatsapp - [link para contato]
      `);
  },
};

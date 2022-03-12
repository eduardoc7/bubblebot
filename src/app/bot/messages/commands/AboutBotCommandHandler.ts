import type { Message } from 'whatsapp-web.js';

export const AboutBotCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    return msg.reply(`Olá ✌️, meu nome é *Bubble* e eu sou um *bot* de pedidos automatizados através do Whatsapp. Fui criado pelo Engenheiro de Software *Eduardo Cordeiro* para agregar valor a empresa *Magic Bubbles*.
    \nSe deseja saber mais sobre mim e sobre quem me desenvolveu, acesse:
    👉 Linkedin: https://www.linkedin.com/in/eduardo-cordeiro-ba5278195/
    👉 Github: https://github.com/eduardoc7
    👉 Email: eduardo.cordeiro1@outlook.com
    \n\n *@Copyright Todos os direitos reservados - Eduardo Cordeiro - 2022*`);
  },
};

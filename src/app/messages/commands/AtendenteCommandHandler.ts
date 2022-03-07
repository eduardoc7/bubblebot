import { Message } from 'whatsapp-web.js';
import { client } from '../../../services/whatsapp';

export const AtendenteCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    const contact = await msg.getContact();

    chat.sendMessage(`Poxa, que pena :(. Não encontrou o que precisava digitando *#duvidas*? Não se preocupe vamos melhorar isso.
    \n\nAguarde alguns instantes até algum de nossos atendentes te responder e solucionar seu problema.`);

    const message_to_reply = `EIIIII. A Magic Bubbles precisa de um atendente no Whatsapp Business. Vai deixar esperando?
    \nNome de quem solicitou: ${contact.pushname}
    \nNúmero: ${contact.getFormattedNumber()}
    \nCom a mensagem: ${msg.body}`;

    return await client.sendMessage('554184510719@c.us', message_to_reply);
  },
};

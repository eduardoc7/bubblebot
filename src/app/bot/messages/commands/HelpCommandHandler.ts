import { Message } from 'whatsapp-web.js';
import { client } from '../../../../services/whatsapp';
import { redisClient } from '../../../../services/redis';

export const HelpCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    const contact = await msg.getContact();

    chat.sendMessage(`Poxa, que pena :(. Não encontrou o que precisava digitando *#duvidas*? Não se preocupe vamos melhorar isso.
    \n\nAguarde alguns instantes até algum de nossos atendentes te responder e solucionar seu problema.`);

    const message_to_reply = `EIIIII. A [nome da empresa] precisa de um atendente no Whatsapp Business. Vai deixar esperando?
    \nNome de quem solicitou: *${contact.pushname}*
    \nNúmero: ${await contact.getFormattedNumber()}
    \nCom a mensagem: ${msg.body}`;

    const atendimento_object = {
      atendido: msg.from,
      atendente: '555555555555@c.us',
    };

    redisClient.set('atendimento:' + msg.from, 'true', { EX: 600 });
    redisClient.set('atendimento:555555555555@c.us', 'true');
    redisClient.set(
      'atendimento:555555555555@c.us:' + contact.pushname.toLowerCase(),
      JSON.stringify(atendimento_object),
    );

    return await client.sendMessage('555555555555@c.us', message_to_reply);
  },
};

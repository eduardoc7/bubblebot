import { Message } from 'whatsapp-web.js';

export const ChangeStatusOrderCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    /**
     * atualiza status
     * recebe como parametro o numero da pessoa e o status a ser atualizado
     * atualiza o status da order
     */
    return msg.reply('');
  },
};

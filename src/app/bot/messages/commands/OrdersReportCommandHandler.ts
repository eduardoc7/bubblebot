import { Message } from 'whatsapp-web.js';

export const OrdersReportCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    /**
     * comando que lê as mensagens do grupo de pedidos
     * e tenta pegar alguns dados como status e valor para fazer um relatório
     */
    return msg.reply(
      'Ops! Isso ainda está em desenvolvimento. Tente novamente, mais tarde.',
    );
  },
};

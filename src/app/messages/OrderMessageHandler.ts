import type { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import type { IOrder } from '../interfaces/Order';

export const OrderMessageHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const order = await msg.getOrder();
    const data = await OrderHandlerCache.prepareOrderToCache(msg, order);

    await OrderHandlerCache.setOder('order:' + msg.from, data);

    return msg.reply(
      `Nós recebemos seu pedido com sucesso. ✅
      \nSe deseja finalizar o pedido digite: *#finalizar*
      `,
    );
  },
  async CheckExistsOrderToUser(msg: Message): Promise<boolean> {
    try {
      const obj: IOrder = await OrderHandlerCache.getOrderFromMessage(msg);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  },
  async StatusOrderHandler(msg: Message) {
    // pega os dados do pedido do cache
    // sim
    // agora precisamos preencher alguns dados. vai ser rapidinho
    // método de pagamento?
    // cartão de crédito
    // endereço de entrega
    // localização()

    // se a mensagem que eu to recebendo for igual ao chatId que eu tenho salvo
    // então eu respondo
    // esquema do while:
    // vou pegar o json do cache
    // percorro o json
    // quando encontrar um campo vazio lá
    // criou um while: enquanto == ''
    // envie uma localização valida

    // switch (targetId) {
    //   case 'btnUpdate':
    //     console.log('Update');
    //     break;
    //   case 'btnDelete':
    //     console.log('Delete');
    //     break;
    //   case 'btnNew':
    //     console.log('New');
    //     break;
    // }
    console.log('StatusOrderHandler');
  },
};

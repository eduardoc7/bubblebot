import { Message } from 'whatsapp-web.js';

export const MessageHandler = async (message: Message): Promise<void> => {
  console.log('msg: ', message);
  if (message.type == 'order') {
    const order = await message.getOrder();
    console.log(order);
  }
};

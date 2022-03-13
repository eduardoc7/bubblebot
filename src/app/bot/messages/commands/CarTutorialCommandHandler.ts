import { Message, MessageMedia } from 'whatsapp-web.js';

export const CarTutorialCommandHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    const media = MessageMedia.fromFilePath(
      'src/app/bot/messages/commands/video4985596413699162693.mp4',
    );

    chat.sendMessage(
      `Que legal 😁. Agradecemos o seu interesse em fazer uma compra conosco. Por isso preparamos um mini tutorial que será enviado em alguns instantes sobre como você pode fazer isso aqui pelo Whatsapp.`,
    );

    return chat.sendMessage(media);
  },
};

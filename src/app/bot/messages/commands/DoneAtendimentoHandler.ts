import { Message } from 'whatsapp-web.js';
import OrderHandlerCache from '../../cache/OrderHandlerCache';
import { HelperCommands } from '../../utils/HelperCommands';

export const DoneAtendimentoHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (!HelperCommands.checkIfIsAdmin(msg.from)) {
      return msg.reply(
        'Desculpe! Você não tem permissão para usar esse comando. ❌',
      );
    }

    const splited_body = msg.body.split(' ');
    const atendido = splited_body[1];
    if (atendido === undefined) {
      return msg.reply(
        'Para encerrar um atendimento, por favor digite *#encerra <nome de quem solicitou>* ❌',
      );
    }

    if (
      !(await OrderHandlerCache.setAtendimentoToFinish(atendido.toLowerCase()))
    ) {
      return msg.reply('Nenhum atendimento encontrado! ❌');
    }

    return msg.reply('Atendimento encerrado com sucesso ✅');
  },
};

import { Message } from 'whatsapp-web.js';
import { queryOrder } from '../../../usecases/query-orders';
import { IOrder, Item } from '../../interfaces/Order';
import { HelperCommands } from '../../utils/HelperCommands';
import HelperCurrency from '../../utils/HelperCurrency';
import dotenv from 'dotenv';
import moment from 'moment';
import { client } from '../../../../services/whatsapp';

dotenv.config();

export const LoadOrdersFromDbToGroup = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (!HelperCommands.checkIfIsAdmin(msg.from)) {
      return msg.reply(
        'Desculpe! Você não tem permissão para usar esse comando. ❌',
      );
    }

    const chatIdGroup = process.env.GROUP_CHAT_ID || '';
    const group_chat = await client.getChatById(chatIdGroup);
    if (!group_chat.isGroup) {
      return msg.reply('Grupo não está definido nas configurações. ❌');
    }

    await group_chat.clearMessages();

    const result = await queryOrder.selectAllOrdersRecords();
    result.map(async (item: IOrder) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const location = JSON.parse(item.location);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const car_items = JSON.parse(item.items);

      const items_to_print = car_items.map((item: Item) => {
        return `
          •${item.name}:
          →Quantidade: ${item.quantity}
          →Preço: *${HelperCurrency.priceToString(Number(item.price))}*`;
      });

      const delivery_data = () => {
        if (item.delivery_method === 'entrega') {
          return `
          *Dados de entrega:*
          •Forma de entrega: ${item.delivery_method}
          •Balneário de entrega: ${location.bairro}
          •Latitude: ${location.latitude}
          •Longitude: ${location.longitude}
          •Taxa de entrega: ${location.taxa_entrega}`;
        }
        return undefined;
      };

      const message = `*DADOS DO PEDIDO*
        \n*ID*: ${item.id}
        \n*N° do pedido*: ${item.identifier}
        \n*Cliente:*
        •Nome: ${item.name}
        •Número de contato: ${item.contact_number}
        \n*Carrinho:*${items_to_print}
        ${delivery_data() ?? ''}
        \n*Dados de pagamento:*
        •Forma de pagamento: ${item.payment_method}
        •Status do pagamento: ${item.payment_status}
        \n*Status do pedido:* ${item.status}
        \nTotal da Compra: *${HelperCurrency.priceToString(Number(item.total))}*
        \n*Criado Em:* ${item.created_at}
        \n*Última atualização:* ${item.updated_at}`;
      await group_chat.sendMessage(message);
    });
    const now = moment().format('DD-MM-YYYY-hh:mm:ss');

    await group_chat.sendMessage(`Carregados em: ${now}`);
    return msg.reply(
      'Pedidos carregados com sucesso ✅. Verifique o grupo definido.',
    );
  },
};

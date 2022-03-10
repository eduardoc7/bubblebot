import { Chat } from 'whatsapp-web.js';
import { redisClient } from '../../services/redis';
import { client } from '../../services/whatsapp';
import { Convert, IOrder } from '../interfaces/Order';
import HelperCurrency from './HelperCurrency';

type OrderProductionProps = {
  message_from: string;
};

export class HelperOrderProduction {
  private message_from: string;
  private group_chat_id: string;
  private admin_production: string;
  private constructor(props: OrderProductionProps) {
    this.message_from = props.message_from;
    this.group_chat_id = '120363042023479333@g.us';
    this.admin_production = '554184510719@c.us';
  }

  private async saveOrderInGroup(): Promise<any> {
    const group_chat = await this.tryGetOrCreateChatGroup(this.group_chat_id);
    const order = await this.getOrderFromCache(this.message_from);
    const message_to_send_group = await this.prepareMessageToSendGroup(order);
    this.notifyOrderToAdminProduction(this.admin_production, order);

    await group_chat.sendMessage(message_to_send_group);
  }

  private async notifyOrderToAdminProduction(
    admin_chat_id: string,
    order: IOrder,
  ): Promise<any> {
    const message_to_notify = `Vamos trabalhar 🛠️⌛! Novo pedido encaminhado para a produção.\n
    N° do pedido: *${order.identifier}*
    Valor total do pedido: *${HelperCurrency.priceToString(
      Number(order.total),
    )}*
    \nDigite *#pedidos* para trazer uma análise dos pedidos atuais.`;

    await client.sendMessage(admin_chat_id, message_to_notify);
  }

  private async getOrderFromCache(message_from: string): Promise<IOrder> {
    const order_json = await redisClient.get('order:' + message_from);

    const order_obj = Convert.toIOrder(order_json || '');
    return order_obj;
  }

  private async prepareMessageToSendGroup(order: IOrder): Promise<string> {
    const items_to_print = order.items.map((item, index) => {
      return `
        •${item.name}:
        →Quantidade: ${item.quantity}
        →Preço: *${HelperCurrency.priceToString(Number(item.price))}*\n`;
    });

    const message_to_write = `*DADOS DO PEDIDO*
    \n*N° do pedido*: ${order.identifier}
    \n*Cliente:*
    •Nome: ${order.name}
    •Número de contato: ${order.contact_number}
    \n*Carrinho:*${items_to_print}
    *Dados de entrega:*
    •Forma de entrega: ${order.delivery_method}
    •Balneário de entrega: ${order.location.bairro}
    \n*Dados de pagamento:*
    •Forma de pagamento: ${order.payment_method}
    •Status do pagamento: ${order.payment_status}
    \n*Status do pedido*: ${order.status}
    \nTotal da Compra: *${HelperCurrency.priceToString(Number(order.total))}*
    `;

    return message_to_write;
  }

  private async tryGetOrCreateChatGroup(group_chat_id: string): Promise<Chat> {
    const group_chat = await client.getChatById(group_chat_id);
    if (!group_chat.isGroup) {
      throw console.error('Erro ao pegar grupo: ', group_chat);
    }

    const chat_pin = await group_chat.pin();
    if (!chat_pin) {
      group_chat.pin;
    }

    return group_chat;
  }

  static create(props: OrderProductionProps): any {
    const order_production = new HelperOrderProduction({
      ...props,
    });
    order_production.saveOrderInGroup();
  }
}

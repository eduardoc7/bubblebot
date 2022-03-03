import { redisClient } from '../../services/redis';
import { Order as Orderwpp } from 'whatsapp-web.js';
import type { Message } from 'whatsapp-web.js';

export default class OrderHandlerCache {
  static async setOder(Identifier: string, data: string): Promise<void> {
    await redisClient.set(Identifier, data);
  }

  static async getOder(Identifier: string) {
    // se existir retorna o data se não existir retorna falso
    const result = await redisClient.get(Identifier);

    return result;
  }

  static async prepareOrderToCache(message: Message, order: Orderwpp) {
    const data = {
      identificador: 'pedido:' + message.orderId,
      nome: message.notifyName,
      numero_de_contato: message.from,
      metodo_de_pagamento: '',
      valor_total: order.total,
      itens: order.products,
      endereco: {
        rua: '',
        bairro: '',
        numero: '',
      },
      criado_em: order.createdAt,
    };
    return JSON.stringify(data);
  }
}

import type { Product } from 'whatsapp-web.js';

export interface IOrder {
  identifier: string;
  name: string;
  number: number;
  payment_method: string;
  payment_status: string;
  total: string;
  items: Array<Product>;
  address: {
    cep: string;
    street: string;
    bairro: string;
  };
  chatId: string;
  status: string;
  created: Date;
}

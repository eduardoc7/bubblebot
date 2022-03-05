import type { Product } from 'whatsapp-web.js';

export interface IOrder {
  identifier: string;
  name: string;
  number: number;
  payment_method: string;
  payment_status: string;
  total: string;
  items: Array<Product>;
  location: {
    latitude: string;
    longitude: string;
  };
  chatId: string;
  status: string;
  created: Date;
}

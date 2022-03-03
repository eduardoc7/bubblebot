interface Product {
  id: string;
  quantity: number;
}

export interface IOrder {
  identifier: string;
  name: string;
  contact: number;
  address: object;
  paymentType: string;
  products: Array<Product>;
  total: string;
  created: Date;
}

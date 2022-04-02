import { IOrder, Item } from '../../src/app/bot/interfaces/Order';

export function createMessageOrder(): IOrder {
  const items: Item[] = [];
  items.push({
    id: '4827133070668337',
    thumbnailUrl: 'https://thumbnailUrlExample.com.br',
    currency: 'BRL',
    name: 'item test',
    price: '5000',
    quantity: 1,
  });

  const order_type_message: IOrder = {
    name: 'Test',
    contact_number: '+55 41 9999-9999',
    total: 5000,
    items: items,
    location: {},
    chatId: '554199999999@c.us',
  };

  return order_type_message;
}

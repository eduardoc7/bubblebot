import dotenv from 'dotenv';
import type { IOrder } from '../app/interfaces/Order';
import {
  IQrCodeRequest,
  Convert,
  IQRCodeData,
} from '../app/interfaces/QrCodeRequest';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

type MercadoPagoProps = {
  order_data: IOrder;
};

export class MercadoPago {
  private path_url: string;
  private order_data;
  private api_access_key;
  private callback_url;

  private constructor(props: MercadoPagoProps) {
    dotenv.config();

    this.order_data = props.order_data;
    this.path_url = process.env.PATH_URL_MP || '';
    this.api_access_key = process.env.ACCESS_KEY_MP;
    this.callback_url = process.env.PATH_CALLBACK;
  }

  public async generateQrCode(): Promise<any> {
    const request_data: IQrCodeRequest = this.prepareJsonToSendRequest(
      this.order_data,
    );

    const json_data = Convert.iQrCodeRequestToJson(request_data);

    const res = await axios
      .post<IQRCodeData>(this.path_url, json_data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.api_access_key}`,
        },
      })
      .catch((error: any) => {
        if (error.response) {
          throw console.error('Response error: ', error);
        }
      });

    return res;
  }

  private prepareJsonToSendRequest(order: IOrder): IQrCodeRequest {
    const total_amount = Number(order.total) / 1000;

    const items: any = [];
    order.items.map((item, index) => {
      items[index] = {
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price) / 1000,
        description: '',
        sku_number: 'KS955RUR',
        category: `produto:${item.name}`,
        unit_measure: 'unit',
        total_amount: total_amount,
      };
    });

    const data = {
      external_reference: uuidv4(),
      description: `Pedido para ${order.name}`,
      title: `Venda para ${order.name}`,
      expiration_date: '2023-08-22T16:34:56.559-04:00',
      total_amount: total_amount,
      notification_url: this.callback_url,
      items: items,
    };

    const QrCodeRequest = Convert.toIQrCodeRequest(JSON.stringify(data));

    return QrCodeRequest;
  }

  static create(props: MercadoPagoProps) {
    const mercadopago = new MercadoPago({
      ...props,
    });

    return mercadopago;
  }
}

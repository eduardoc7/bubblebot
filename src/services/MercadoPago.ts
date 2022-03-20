import dotenv from 'dotenv';
import type { IOrder } from '../app/bot/interfaces/Order';
import {
  IQrCodeRequest,
  Convert,
  IQRCodeData,
} from '../app/bot/interfaces/QrCodeRequest';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import QRCode from 'qrcode';
import { redisClient } from './redis';
import { sha512 } from 'sha512-crypt-ts';
import crypto from 'crypto';

type MercadoPagoProps = {
  order_data: IOrder;
};

export class MercadoPago {
  private path_url: string;
  private order_data;
  private api_access_key;
  private callback_url;
  private external_reference;
  private hash_callback: any;

  private constructor(props: MercadoPagoProps) {
    dotenv.config();

    this.order_data = props.order_data;
    this.path_url = process.env.PATH_URL_MP || '';
    this.api_access_key = process.env.ACCESS_KEY_MP;
    this.callback_url = process.env.PATH_CALLBACK;
    this.external_reference = uuidv4();
  }

  public async saveQrCodeOnCache(
    qrcode_data: string,
    message_from: string,
  ): Promise<void> {
    const data = {
      message_from,
      qrcode_data,
      hash_callback: sha512.crypt(this.hash_callback, 'saltsalt'),
    };

    redisClient.set(
      'pagamentopix:' + this.getExternalReference(),
      JSON.stringify(data),
    );
  }

  public setHashNotifictionUrl() {
    this.hash_callback = crypto.randomBytes(20).toString('hex');
  }

  public getHashNotifictionUrl(): string {
    return this.hash_callback;
  }

  public getExternalReference(): string {
    return this.external_reference;
  }

  public async generateQrCode(): Promise<any> {
    const request_data: IQrCodeRequest = this.prepareJsonToSendRequest(
      this.order_data,
    );

    const json_data = Convert.iQrCodeRequestToJson(request_data);

    console.log('REQUEST: ', json_data);

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

  public async getImgFromQrCodeData(qrcode_data: string): Promise<string> {
    let qrcode_base64;
    try {
      qrcode_base64 = await QRCode.toDataURL(qrcode_data);
    } catch (err) {
      console.error(err);
    }

    return qrcode_base64 || '';
  }

  private prepareJsonToSendRequest(order: IOrder): IQrCodeRequest {
    this.setHashNotifictionUrl();

    const items: any = [];
    order.items.map((item, index) => {
      const total_amount_items = (Number(item.price) / 1000) * item.quantity;
      items[index] = {
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price) / 1000,
        description: '',
        sku_number: 'KS955RUR',
        category: `produto:${item.name}`,
        unit_measure: 'unit',
        total_amount: total_amount_items,
      };
    });

    items.push({
      title: 'Taxa de entrega',
      quantity: 1,
      unit_price: Number(order.location?.taxa_entrega) / 1000,
      description: `Bairro: ${order.location?.bairro}`,
      sku_number: 'KS955RUR',
      category: `Produto`,
      unit_measure: 'unit',
      total_amount: Number(order.location?.taxa_entrega) / 1000,
    });

    const data = {
      external_reference: this.getExternalReference(),
      description: `Pedido para ${order.name}`,
      title: `Venda para ${order.name}`,
      expiration_date: '2023-08-22T16:34:56.559-04:00',
      total_amount: Number(order.total) / 1000,
      notification_url: `${this.callback_url}/${this.getHashNotifictionUrl()}`,
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

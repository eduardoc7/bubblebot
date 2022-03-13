import { Convert as ConvertQr } from '../interfaces/IQrCodeCache';
import { client } from '../../../services/whatsapp';
import { production_message } from '../utils/ReturnsMessages';
import { redisClient } from '../../../services/redis';
import { Convert } from '../interfaces/Order';
import { HelperOrderProduction } from './HelperOrderProduction';
import { sha512 } from 'sha512-crypt-ts';

export const HelperPaymentPix = {
  async updateStatusPaymentOrder(
    external_reference: string,
    status: string,
  ): Promise<boolean> {
    const cache_qrcode = await redisClient.get(
      'pagamentopix:' + external_reference,
    );

    const qrcode_obj = ConvertQr.toIQrCodeCache(cache_qrcode || '');

    const order_json = await redisClient.get(
      'order:' + qrcode_obj.message_from,
    );

    if (qrcode_obj == null || order_json == null) {
      return false;
    }

    const order_obj = Convert.toIOrder(order_json || '');

    order_obj.payment_status = status;
    order_obj.status = status === 'pago' ? 'producao' : 'pix-pendente';

    const data = JSON.stringify(order_obj).replace(/\\"/g, '"');
    await redisClient.set('order:' + qrcode_obj.message_from, data);

    if (status === 'pago') {
      await client.sendMessage(
        qrcode_obj.message_from,
        `Ebaa 🥳. Seu pagamento foi confirmado! Você acaba de adquirir seu pedido. Você pode digitar *#ver*`,
      );

      await client.sendMessage(qrcode_obj.message_from, production_message);

      HelperOrderProduction.create({ message_from: qrcode_obj.message_from });
    }

    return true;
  },

  async checkHashCallbackIsValid(
    external_reference: string,
    hash_in_notification: string,
  ): Promise<boolean> {
    const cache_qrcode = await redisClient.get(
      'pagamentopix:' + external_reference,
    );

    const qrcode_obj = ConvertQr.toIQrCodeCache(cache_qrcode || '');

    if (qrcode_obj == null) {
      return false;
    }

    if (
      sha512.crypt(hash_in_notification, 'saltsalt') != qrcode_obj.hash_callback
    ) {
      return false;
    }
    return true;
  },
};

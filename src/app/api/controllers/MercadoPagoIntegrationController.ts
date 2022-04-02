import { Request, Response } from 'express';
import { HelperPaymentPix } from '../../bot/utils/HelperPaymentPix';
import mercadopago from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();
mercadopago.configure({
  access_token: process.env.ACCESS_KEY_MP || '',
});

export default class MercadoPagoIntegrationController {
  async notificationTransaction(req: Request, res: Response) {
    const { topic } = req.body;
    const order_id = req.query.id;
    const { hash } = req.params;

    if (topic != 'merchant_order') {
      return res.sendStatus(200);
    }

    const merchant_order = await mercadopago.merchant_orders.findById(
      Number(order_id),
    );

    if (
      !HelperPaymentPix.checkHashCallbackIsValid(
        merchant_order.body.external_reference,
        hash,
      )
    ) {
      console.error('hash de callback inválida!');

      return res.sendStatus(400);
    }

    if (
      merchant_order.body.order_status === 'paid' &&
      merchant_order.body.paid_amount === merchant_order.body.total_amount
    ) {
      try {
        HelperPaymentPix.updateStatusPaymentOrder(
          merchant_order.body.external_reference,
          'pago',
        );
      } catch (error) {
        console.error('error atualizando o status de pagamento: ', error);
      }

      console.log('foi pago essa porra!');
    }

    return res.sendStatus(200);
  }
}

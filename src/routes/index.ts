import { Request, Response, Router } from 'express';
import mercadopago from 'mercadopago';
import dotenv from 'dotenv';
import { HelperPaymentPix } from '../app/utils/HelperPaymentPix';

dotenv.config();
mercadopago.configure({
  access_token: process.env.ACCESS_KEY_MP || '',
});

const router = Router();
router.post('/callback', async (req: Request, res: Response) => {
  const { topic } = req.body;
  const order_id = req.query.id;

  if (topic != 'merchant_order') {
    return res.sendStatus(200);
  }

  const merchant_order = await mercadopago.merchant_orders.findById(
    Number(order_id),
  );

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
  } else {
    try {
      HelperPaymentPix.updateStatusPaymentOrder(
        merchant_order.body.external_reference,
        merchant_order.body.order_status,
      );
    } catch (error) {
      console.error(
        'error atualizando o status de pagamento nao pago: ',
        error,
      );
    }
  }

  return res.sendStatus(200);
});

export { router };

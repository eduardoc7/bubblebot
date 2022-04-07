import { IOrder } from '../src/app/bot/interfaces/Order';
import { IResponse } from '../src/app/bot/interfaces/QrCodeRequest';
import { HelperPaymentPix } from '../src/app/bot/utils/HelperPaymentPix';
import { queryOrder } from '../src/app/usecases/query-orders';
import { MercadoPago } from '../src/services/MercadoPago';

describe('create a new payment pix to an order', () => {
  it('should be able to get a order from db and request mercadopago', async () => {
    const order_id = 9;
    const order_data_from_db: IOrder = await queryOrder.selectOrderById(
      order_id,
    );

    const MercadoPagoService = MercadoPago.create({
      order_data: order_data_from_db,
      isOrderFromDb: true,
    });

    const { data }: IResponse = await MercadoPagoService.generateQrCode();

    console.log('RESULT ', data);
    expect(data).toBeTruthy();
  });
});

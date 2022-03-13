import { Message, MessageMedia } from 'whatsapp-web.js';
import { AnyMessageHandler } from './AnyMessageHandler';
import { OrderMessageHandler } from './OrderMessageHandler';
import { client } from '../../../services/whatsapp';
import type { IOrder } from '../interfaces/Order';
import OrderHandlerCache from '../cache/OrderHandlerCache';
import HelperCurrency from '../utils/HelperCurrency';
import HelperStr from '../utils/HelperStr';
import { production_message } from '../utils/ReturnsMessages';
import { HelperOrderProduction } from '../utils/HelperOrderProduction';
import { MercadoPago } from '../../../services/MercadoPago';
import { IResponse } from '../interfaces/QrCodeRequest';

export const OrderPaymentHandler = {
  async execute(msg: Message): Promise<Message> {
    const chat = await msg.getChat();
    await chat.sendStateTyping();

    if (HelperStr.formatMessageToCheck(msg.body) == 'pix') {
      const status_to_update = 'pix-pendente';
      if (
        !OrderMessageHandler.setPaymentMethodToOrder(
          HelperStr.formatMessageToCheck(msg.body),
          status_to_update,
          msg,
        )
      ) {
        console.log(
          'Erro ao setar o método de pagamento: ',
          HelperStr.formatMessageToCheck(msg.body),
        );
      }
      chat.sendMessage(
        'Aguarde alguns instantes enquanto preparamos o seu QR Code para pagamento 🚀',
      );

      const obj: IOrder = await OrderHandlerCache.getOrderFromMessage(msg.from);

      const MercadoPagoService = MercadoPago.create({ order_data: obj });
      const { data }: IResponse = await MercadoPagoService.generateQrCode();
      const qrcode_image = await MercadoPagoService.getImgFromQrCodeData(
        data.qr_data,
      );

      const formated_img = qrcode_image.split(',').pop();
      const media = new MessageMedia('image/png', formated_img || '');

      if (media) {
        await MercadoPagoService.saveQrCodeOnCache(data.qr_data, msg.from);

        await chat.sendMessage(media);
        await chat.sendMessage(
          `Você também pode usar o Pix copia e cola, copiando a mensagem abaixo e colocando no área Pix do seu banco ;).`,
        );
        await chat.sendMessage(data.qr_data);
      } else {
        chat.sendMessage(
          'Não foi possível gerar um pagamento Pix automático, entraremos em contato em breve!',
        );
      }

      return msg.reply(
        `Agradecemos a sua escolha por Pix, isso nos ajuda a crescer. Aguardaremos a confirmação do pagamento para prosseguir.`,
      );
    } else if (
      HelperStr.formatMessageToCheck(msg.body) == 'cartao' ||
      HelperStr.formatMessageToCheck(msg.body) == 'dinheiro'
    ) {
      const status_to_update = 'producao';
      if (
        !OrderMessageHandler.setPaymentMethodToOrder(
          HelperStr.formatMessageToCheck(msg.body),
          status_to_update,
          msg,
        )
      ) {
        console.log(
          'Erro ao setar o método de pagamento: ',
          HelperStr.formatMessageToCheck(msg.body),
        );
      }
      const obj: IOrder = await OrderHandlerCache.getOrderFromMessage(msg.from);

      client.sendMessage(
        msg._getChatId(),
        `Obrigado. Você realizará o pagamento no total de *${HelperCurrency.priceToString(
          Number(obj.total),
        )}* no momento da entrega ou retirada.`,
      );

      HelperOrderProduction.create({ message_from: msg.from });

      return msg.reply(production_message);
    }
    return AnyMessageHandler.execute(msg);
  },
};

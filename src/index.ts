import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'client-main' }),
  takeoverOnConflict: false,
  takeoverTimeoutMs: 999999,
  puppeteer: {
    headless: false,
  },
});
client.on('qr', (qr): void => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (msg) => {
  console.log('message: ', msg);
  console.log(`${(await msg.getContact()).pushname}: ${msg.body}`);

  if (msg.type == 'order') {
    const order = await msg.getOrder();
    console.log('order: ', order);
  }

  if (msg.body == '!ping') {
    msg.reply('pong');
  }
});

client.initialize();

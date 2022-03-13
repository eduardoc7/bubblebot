import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'client-main' }),
  takeoverOnConflict: false,
  takeoverTimeoutMs: 999999,
  puppeteer: {
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: ['--no-sandbox'],
  },
});

client.on('qr', async (qr) => qrcode.generate(qr, { small: true }));
client.on('authenticated', () => console.log('Authenticated'));
client.on('auth_failure', () => console.log('Authentication failed.'));
client.on('disconnected', () => console.log('WhatsApp lost connection.'));
client.on('ready', async () => {
  console.log('WhatsApp bot successfully connected!');
  client.sendPresenceAvailable();
});

client.initialize();

export { client };

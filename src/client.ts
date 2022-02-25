import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
    puppeteer: {
        headless: false,
    },
    clientId: 'example'
});

client.on('qr', (qr): void => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small:true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    console.log("MENSAGEM RECEBIDA: ",msg);
    if (msg.body == '!ping') {
        msg.reply('pong');
    } else if (msg.body == '!isa') {
        msg.reply('a namorada mais linda do mundo!!!!!!');
    }
});

client.initialize();

import { client } from './services/whatsapp';
import { MessageHandler } from './app/bot';
import api from './app/api';

client.on('message_create', MessageHandler);
api.listen(process.env.PORT || 3000, () => console.log('Server is running!'));

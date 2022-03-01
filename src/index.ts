import { client } from './services/whatsapp';
import { MessageHandler } from './app/messages';

client.on('message_create', MessageHandler);

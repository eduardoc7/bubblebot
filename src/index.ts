import { client } from './services/whatsapp';
import { MessageHandler } from './app/messages';
import { api } from './services/nubank';

client.on('message_create', MessageHandler);

import { client } from './services/whatsapp';
import { MessageHandler } from './app/messages';
import express from 'express';
import cors from 'cors';
import { router } from './routes';

client.on('message_create', MessageHandler);

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 3000, () =>
  console.log('servidor rodando: http://localhost:3000'),
);

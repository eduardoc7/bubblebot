import { client } from './services/whatsapp';
import { MessageHandler } from './app/bot/messages';
import express from 'express';
import cors from 'cors';
import { router } from './app/api/routes';
import 'reflect-metadata';

client.on('message_create', MessageHandler);

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 3000, () =>
  console.log('servidor rodando: http://localhost:3000'),
);

import express from 'express';
import routes from './routes';
import cors from 'cors';
import type { Express } from 'express';

class Api {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  routes() {
    this.server.use(routes);
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }
}

export default new Api().server;

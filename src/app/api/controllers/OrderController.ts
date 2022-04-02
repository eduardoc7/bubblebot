import { Request, Response } from 'express';
import CreateOrder from '../../usecases/save-order';

export default class OrderController {
  async create(request: Request, response: Response) {
    const instOrder = new CreateOrder(request.body, true);

    try {
      await instOrder.execute();

      return response.status(201).send();
    } catch (err) {
      console.error(err);

      return response.status(400).json({
        error: 'Unexpected error while creating new order.',
      });
    }
  }
}

import { Router } from 'express';
import MercadoPagoIntegrationController from '../controllers/MercadoPagoIntegrationController';
import OrderController from '../controllers/OrderController';

const router = Router();

const MPController = new MercadoPagoIntegrationController();
const orderController = new OrderController();

router.post('/callback/:hash', MPController.notificationTransaction);
router.post('/order', orderController.create);

export default router;

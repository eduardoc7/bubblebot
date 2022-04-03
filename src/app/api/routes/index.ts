import { Router } from 'express';
import MercadoPagoIntegrationController from '../controllers/MercadoPagoIntegrationController';
import OrderController from '../controllers/OrderController';
import { VerifyToken } from '../middlewares/VerifyToken';

const router = Router();

const MPController = new MercadoPagoIntegrationController();
const orderController = new OrderController();

router.post('/callback/:hash', MPController.notificationTransaction);
router.post('/order', VerifyToken.execute, orderController.create);

export default router;

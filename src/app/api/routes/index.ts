import { Router } from 'express';
import MercadoPagoIntegrationController from '../controllers/MercadoPagoIntegrationController';

const router = Router();

const MPController = new MercadoPagoIntegrationController();

router.post('/callback/:hash', MPController.notificationTransaction);

export default router;

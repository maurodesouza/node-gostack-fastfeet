import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddlware from './app/middleware/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanDismissedController from './app/controllers/DeliverymanDismissedController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryCanceledController from './app/controllers/DeliveryCanceledController';
import DeliveryCompletedController from './app/controllers/DeliveryCompletedController';
import DeliveryWithdrawnController from './app/controllers/DeliveryWithdrawnController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.use(authMiddlware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/employees/deliveryman', DeliverymanController.store);
routes.get('/employees/deliveryman', DeliverymanController.index);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.delete('/deliveryman/:id', DeliverymanController.delete);
routes.put('/deliveryman/:id', DeliverymanController.update);

routes.get(
  '/employees/dismissed/deliveryman',
  DeliverymanDismissedController.index
);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries/store', DeliveryController.index);
routes.get('/deliveries/:id/store', DeliveryController.show);
routes.put('/deliveries/:id/store', DeliveryController.update);

routes.get('/deliveries/canceled', DeliveryCanceledController.index);
routes.get('/deliveries/:id/canceled', DeliveryCanceledController.show);

routes.get('/deliveries/completed', DeliveryCompletedController.index);
routes.get('/deliveries/:id/completed', DeliveryCompletedController.show);

routes.get('/deliveries/withdrawn', DeliveryWithdrawnController.index);
routes.get('/deliveries/:id/withdrawn', DeliveryWithdrawnController.show);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient', RecipientController.update);

export default routes;

import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddlware from './app/middleware/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryCanceledController from './app/controllers/DeliveryCanceledController';
import DeliveryCompletedController from './app/controllers/DeliveryCompletedController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.use(authMiddlware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.delete('/deliveryman/:id', DeliverymanController.delete);
routes.put('/deliveryman/:id', DeliverymanController.update);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries/store', DeliveryController.index);
routes.get('/deliveries/:id/store', DeliveryController.show);
routes.put('/deliveries/:id/store', DeliveryController.update);

routes.get('/deliveries/canceled', DeliveryCanceledController.index);
routes.get('/deliveries/:id/canceled', DeliveryCanceledController.show);

routes.get('/deliveries/completed', DeliveryCompletedController.index);
routes.get('/deliveries/:id/completed', DeliveryCompletedController.show);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient', RecipientController.update);

export default routes;

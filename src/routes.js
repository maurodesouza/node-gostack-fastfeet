import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddlware from './app/middleware/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';

import TaskStoreController from './app/controllers/TaskStoreController';
import TaskCompletedController from './app/controllers/TaskCompletedController';
import TaskWithdrawnController from './app/controllers/TaskWithdrawnController';
import TaskCanceledController from './app/controllers/TaskCanceledController';

import DeliverymanController from './app/controllers/DeliverymanController';
import DeliverymanDismissedController from './app/controllers/DeliverymanDismissedController';

import DeliveryStoreController from './app/controllers/DeliveryStoreController';
import DeliveryCanceledController from './app/controllers/DeliveryCanceledController';
import DeliveryCompletedController from './app/controllers/DeliveryCompletedController';
import DeliveryWithdrawnController from './app/controllers/DeliveryWithdrawnController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.get('/deliveryman/:id/deliveries/store', TaskStoreController.index);
routes.get(
  '/deliveryman/:id/deliveries/:delivery_id/store',
  TaskStoreController.show
);

routes.get(
  '/deliveryman/:id/deliveries/withdrawn',
  TaskWithdrawnController.index
);
routes.get(
  '/deliveryman/:id/deliveries/:delivery_id/withdrawn',
  TaskWithdrawnController.show
);
routes.put(
  '/deliveryman/:deliveryman_id/deliveries/:delivery_id/withdrawn',
  DeliveryWithdrawnController.update
);

routes.get(
  '/deliveryman/:id/deliveries/completed',
  TaskCompletedController.index
);
routes.put(
  '/deliveryman/:deliveryman_id/deliveries/:delivery_id/completed',
  upload.single('file'),
  DeliveryCompletedController.update
);

routes.get(
  '/deliveryman/:id/deliveries/canceled',
  TaskCanceledController.index
);

routes.post(
  '/deliveryman/:deliveryman_id/delivery/:delivery_id/problems',
  DeliveryProblemsController.store
);

routes.use(authMiddlware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient', RecipientController.update);

routes.post('/employees/deliveryman', DeliverymanController.store);
routes.get('/employees/deliveryman', DeliverymanController.index);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.put('/deliveryman/:id', DeliverymanController.update);

routes.get(
  '/employees/dismissed/deliveryman',
  DeliverymanDismissedController.index
);
routes.delete('/deliveryman/:id', DeliverymanDismissedController.delete);

routes.post('/deliveries/store', DeliveryStoreController.store);
routes.get('/deliveries/store', DeliveryStoreController.index);
routes.get('/deliveries/:id/store', DeliveryStoreController.show);
routes.put('/deliveries/:id/store', DeliveryStoreController.update);

routes.get('/deliveries/canceled', DeliveryCanceledController.index);
routes.get('/deliveries/:id/canceled', DeliveryCanceledController.show);

routes.get('/deliveries/completed', DeliveryCompletedController.index);
routes.get('/deliveries/:id/completed', DeliveryCompletedController.show);

routes.get('/deliveries/withdrawn', DeliveryWithdrawnController.index);
routes.get('/deliveries/:id/withdrawn', DeliveryWithdrawnController.show);

routes.get('/deliveries/problems', DeliveryProblemsController.index);
routes.get(
  '/deliveries/:delivery_id/problems',
  DeliveryProblemsController.show
);

export default routes;

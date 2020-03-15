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
import DeliveryController from './app/controllers/DeliveryController';

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
  '/deliveryman/:deliveryman_id/problems',
  DeliveryProblemsController.store
);

routes.use(authMiddlware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:recipient_id', RecipientController.show);
routes.put('/recipients/:recipient_id', RecipientController.update);
routes.delete('/recipients/:recipient_id', RecipientController.delete);

routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.get('/deliverymans/:deliveryman_id', DeliverymanController.show);
routes.put('/deliverymans/:deliveryman_id', DeliverymanController.update);
routes.delete('/deliverymans/:deliveryman_id', DeliverymanController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:delivery_id', DeliveryController.show);
routes.put('/deliveries/:delivery_id', DeliveryController.update);
routes.delete('/deliveries/:delivery_id', DeliveryController.delete);

routes.get('/problems/:delivery_id', DeliveryProblemsController.show);
routes.delete(
  '/problems/:problem_id/cancel-delivery',
  DeliveryProblemsController.delete
);

export default routes;

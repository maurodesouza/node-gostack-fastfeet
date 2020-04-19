import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddlware from './app/middleware/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';

import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';

import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';
import DeliveryCompletedController from './app/controllers/DeliveryCompletedController';
import DeliveryWithdrawnController from './app/controllers/DeliveryWithdrawnController';

import TaskController from './app/controllers/TaskController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.get('/deliverymans/:deliveryman_id', DeliverymanController.show);

routes.get('/deliverymans/:deliveryman_id/deliveries', TaskController.index);

routes.get('/deliveries/:delivery_id', DeliveryController.show);

routes.put(
  '/deliveries/:delivery_id/withdrawn',
  DeliveryWithdrawnController.update
);
routes.put(
  '/deliveries/:delivery_id/completed',
  upload.single('file'),
  DeliveryCompletedController.update
);

routes.post('/problems/:delivery_id', DeliveryProblemsController.store);
routes.get('/problems/:delivery_id', DeliveryProblemsController.show);

routes.post('/files', upload.single('file'), FileController.store);

routes.use(authMiddlware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:recipient_id', RecipientController.show);
routes.put('/recipients/:recipient_id', RecipientController.update);
routes.delete('/recipients/:recipient_id', RecipientController.delete);

routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:deliveryman_id', DeliverymanController.update);
routes.delete('/deliverymans/:deliveryman_id', DeliverymanController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.put('/deliveries/:delivery_id', DeliveryController.update);
routes.delete('/deliveries/:delivery_id', DeliveryController.delete);

routes.delete(
  '/problems/:problem_id/cancel-delivery',
  DeliveryProblemsController.delete
);

export default routes;

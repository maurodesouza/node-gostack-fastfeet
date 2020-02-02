import { Router } from 'express';

import authMiddlware from './app/middleware/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddlware);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient', RecipientController.update);

export default routes;

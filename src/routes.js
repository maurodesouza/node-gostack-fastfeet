import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddlware from './app/middleware/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.use(authMiddlware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient', RecipientController.update);

export default routes;

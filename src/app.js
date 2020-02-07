import express from 'express';

import 'express-async-errors';

import Youch from 'youch';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middleware();
    this.routes();
    this.exceptionsHandler();
  }

  middleware() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionsHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

export default new App().server;

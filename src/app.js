import 'dotenv/config';

import express from 'express';
import Youch from 'youch';

import 'express-async-errors';
import './database';

import routes from './routes';

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
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;

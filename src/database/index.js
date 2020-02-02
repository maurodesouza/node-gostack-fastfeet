import Sequelize from 'sequelize';
import sequelizeConfig from '../config/database';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';

const models = [User, Recipient];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(sequelizeConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();

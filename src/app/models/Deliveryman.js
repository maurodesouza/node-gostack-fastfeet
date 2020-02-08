import Sequelize, { Model } from 'sequelize';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate({ File }) {
    this.belongsTo(File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Deliveryman;

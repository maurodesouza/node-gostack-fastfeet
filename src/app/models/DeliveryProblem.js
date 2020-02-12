import Sequelize, { Model } from 'sequelize';

class DeliveryProblems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate({ Delivery }) {
    this.belongsTo(Delivery, {
      foreignKey: 'delivery_id',
      as: 'delivery',
    });
  }
}

export default DeliveryProblems;

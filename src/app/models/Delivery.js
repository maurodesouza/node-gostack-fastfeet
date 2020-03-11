import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        status: Sequelize.STRING,
        have_problem: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate({ File, Recipient, Deliveryman, DeliveryProblems }) {
    this.belongsTo(Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });

    this.belongsTo(Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });

    this.belongsTo(File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });

    this.hasMany(DeliveryProblems, {
      foreignKey: 'delivery_id',
      as: 'delivery_problems',
    });
  }
}

export default Delivery;

import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class TaskCompletedController {
  async index(req, res) {
    const { id: deliveryman_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Entregador não encontrado !' });

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id,
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'product', 'created_at', 'end_date', 'recipient_id'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'email', 'state', 'city'],
        },
      ],
      order: ['created_at'],
    });

    return res.json(deliveries);
  }
}

export default new TaskCompletedController();

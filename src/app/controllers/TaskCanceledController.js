import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class TaskCanceledController {
  async index(req, res) {
    const { id: deliveryman_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'ID invalid' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Delivery man not found' });

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id,
        canceled_at: {
          [Op.ne]: null,
        },
      },
      attributes: [
        'id',
        'product',
        'created_at',
        'canceled_at',
        'recipient_id',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'email', 'state', 'city'],
        },
      ],
      order: ['canceled_at'],
    });

    return res.json(deliveries);
  }
}

export default new TaskCanceledController();

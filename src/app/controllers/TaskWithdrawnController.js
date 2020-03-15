import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class TaskStoreController {
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
        start_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'product', 'created_at', 'start_date', 'recipient_id'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'email', 'state', 'city'],
        },
      ],
      order: [['start_date', 'ASC']],
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const { id: deliveryman_id, delivery_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Entregador não encontrado !' });

    const deliveries = await Delivery.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
        start_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'product', 'created_at', 'start_date', 'recipient_id'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'email',
            'street',
            'number',
            'complement',
            'city',
            'state',
            'zip_code',
          ],
        },
      ],
    });

    if (!deliveries)
      return res.status(400).json({ error: 'Encomenda não encontrada !' });

    return res.json(deliveries);
  }
}

export default new TaskStoreController();

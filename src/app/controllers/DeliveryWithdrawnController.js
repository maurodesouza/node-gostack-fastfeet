import { Op } from 'sequelize';

import File from '../models/File';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryWithdrawnController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: { start_date: { [Op.ne]: null }, canceled_at: null },
      attributes: [
        'id',
        'deliveryman_id',
        'recipient_id',
        'product',
        'start_date',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
      order: ['start_date'],
    });

    return res.json(deliveries);
  }

  async show(req, res) {
    const { id: delivery_id } = req.params;

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'ID invalid' });

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        start_date: { [Op.ne]: null },
        canceled_at: null,
      },
      attributes: [
        'id',
        'deliveryman_id',
        'recipient_id',
        'product',
        'end_date',
      ],
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
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    return res.json(delivery);
  }
}

export default new DeliveryWithdrawnController();

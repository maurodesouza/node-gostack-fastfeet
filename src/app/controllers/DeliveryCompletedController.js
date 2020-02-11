import { Op } from 'sequelize';

import File from '../models/File';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryCompletedController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: { end_date: { [Op.ne]: null } },
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
      order: ['end_date'],
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
        end_date: { [Op.ne]: null },
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

  async update(req, res) {
    if (!req.file)
      return res.status(401).json({ error: 'You have not uploaded any files' });

    const { deliveryman_id, delivery_id } = req.params;
    const { originalname: name, filename: path } = req.file;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Deliveryman ID invalid' });

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Delivery ID invalid' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
      },
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    if (delivery.canceled_at)
      return res.status(400).json({ error: 'Delivery was canceled' });

    if (delivery.end_date)
      return res.status(400).json({ error: 'Delivery already completed' });

    if (!delivery.start_date)
      return res.status(400).json({ error: 'Delivery not yet withdrawn' });

    const { id } = await File.create({
      name,
      path,
    });

    delivery.signature_id = id;
    delivery.end_date = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryCompletedController();

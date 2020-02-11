import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  startOfHour,
  isWithinInterval,
  setHours,
} from 'date-fns';

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

  async update(req, res) {
    const currentDate = new Date();

    if (
      !isWithinInterval(currentDate, {
        start: startOfHour(setHours(currentDate, 8)),
        end: startOfHour(setHours(currentDate, 18)),
      })
    )
      return res.status(400).json({
        error: 'You can only withdraw the deliveries between 08:00h and 18:00h',
      });

    const { deliveryman_id, delivery_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Deliveryman ID invalid' });

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Delivery ID invalid' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Deliveryman not found' });

    const deliveriesOfTheDay = await Delivery.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(currentDate), endOfDay(currentDate)],
        },
      },
    });

    if (deliveriesOfTheDay.length > 5)
      return res
        .status(400)
        .json({ error: 'You can only make five deliveries a day' });

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
        end_date: null,
        canceled_at: null,
      },
      attributes: ['id', 'product', 'start_date', 'created_at'],
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    if (delivery.start_date)
      return res.status(400).json({ error: 'Delivery already withdrawn' });

    delivery.start_date = currentDate;

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryWithdrawnController();

import * as Yup from 'yup';
import { Op } from 'sequelize';

import Queue from '../../lib/Queue';
import newDelivery from '../jobs/NewDelivery';

import File from '../models/File';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
  async store(req, res) {
    const { recipient_id, deliveryman_id } = req.body;

    const schema = Yup.object().shape({
      recipient_id: Yup.number()
        .integer()
        .required(),
      deliveryman_id: Yup.number()
        .integer()
        .required(),
      product: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient)
      return res.status(400).json({ error: 'Recipient not found' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.create(req.body);

    await Queue.add(newDelivery.key, {
      delivery,
      recipient,
      deliveryman,
    });

    return res.json(delivery);
  }

  async index(req, res) {
    const { state = '', q = '', page = 1 } = req.query;

    const { count, rows: deliveries } = await Delivery.findAndCountAll({
      where: {
        product: { [Op.iRegexp]: q },
        ...(state === '' ? { status: { [Op.ne]: null } } : { status: state }),

        ...(state === 'problemas' && {
          status: { [Op.notLike]: 'cancelada' },
          have_problem: true,
        }),
      },
      attributes: ['id', 'status', 'have_problem', 'created_at'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          association: 'delivery_problems',
          attributes: ['id', 'description'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'state', 'city'],
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
      order: ['createdAt'],
    });

    res.header('Access-Control-Expose-Headers', 'X-total-count');

    return res.append('X-total-count', count).json(deliveries);
  }

  async show(req, res) {
    const { delivery_id } = req.params;

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'ID invalid' });

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
      },
      attributes: [
        'start_date',
        'end_date',
        'canceled_at',
        'createdAt',
        'status',
        'have_problem',
      ],
      include: [
        {
          association: 'delivery_problems',
          attributes: ['id', 'description'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['street', 'number', 'city', 'state', 'zip_code'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    return res.json(delivery);
  }

  async update(req, res) {
    const { delivery_id } = req.params;
    const { recipient_id, deliveryman_id, product } = req.body;

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'ID invalid' });

    if (!(recipient_id || deliveryman_id || product))
      return res
        .status(400)
        .json({ error: "You didn't send nothing to be update" });

    const schema = Yup.object().shape({
      recipient_id: Yup.number().integer(),
      deliveryman_id: Yup.number().integer(),
      product: Yup.string(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        start_date: null,
        end_date: null,
        canceled_at: null,
      },
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    if (recipient_id && delivery.recipient_id !== recipient_id) {
      const recipientExist = await Recipient.findByPk(recipient_id);

      if (!recipientExist)
        return res.status(400).json({ error: 'Recipient not found' });
    }

    if (deliveryman_id && delivery.deliveryman_id !== deliveryman_id) {
      const deliverymanExist = await Deliveryman.findOne({
        where: { id: deliveryman_id, dismissed_at: null },
      });

      if (!deliverymanExist)
        return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const deliveryUpdate = await delivery.update(req.body);

    return res.json(deliveryUpdate);
  }

  async delete(req, res) {
    const { delivery_id } = req.params;

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'ID invalid' });

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    await delivery.destroy();

    return res.json();
  }
}

export default new DeliveryController();

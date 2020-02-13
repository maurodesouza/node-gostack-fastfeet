import * as Yup from 'yup';

import Mail from '../../lib/Mail';

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

    const recipientExist = await Recipient.findByPk(recipient_id);

    if (!recipientExist)
      return res.status(400).json({ error: 'Recipient not found' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.create(req.body);

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Você tem uma nova entrega',
      text: 'Você tem uma nova entrega',
    });

    return res.json(delivery);
  }

  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: { start_date: null, end_date: null, canceled_at: null },
      attributes: ['id', 'deliveryman_id', 'recipient_id', 'product'],
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
      order: ['created_at'],
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
        start_date: null,
        end_date: null,
        canceled_at: null,
      },
      attributes: ['id', 'deliveryman_id', 'recipient_id', 'product'],
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
      order: ['created_at'],
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    return res.json(delivery);
  }

  async update(req, res) {
    const { id: delivery_id } = req.params;
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
}

export default new DeliveryController();

import * as Yup from 'yup';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    await schema.validate(req.body).catch(({ message }) => {
      return res.status(400).json({ message });
    });

    const { name, email } = req.body;

    const deliverymanExist = await Deliveryman.findOne({
      where: { email },
    });

    if (deliverymanExist)
      return res.status(400).json({ error: 'Email already registered' });

    const { id } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const deliveryman = await Deliveryman.findAll({
      where: { dismissed_at: null },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      order: ['created_at'],
    });

    return res.json(deliveryman);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)))
      return res.status(400).json({ error: 'ID invalid' });

    const deliveryman = await Deliveryman.findOne({
      where: { id },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Delivery man not found' });

    if (deliveryman.dismissed_at !== null)
      return res.status(400).json({ error: 'This Delivery man was dismissed' });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number().integer(),
    });

    await schema.validate(req.body).catch(({ message }) => {
      return res.status(400).json({ message });
    });

    const { id } = req.params;

    if (!Number.isInteger(Number(id)))
      return res.status(400).json({ error: 'ID invalid' });

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman)
      return res.status(400).json({ error: 'Delivery man not found' });

    if (deliveryman.dismissed_at !== null)
      return res.status(400).json({ error: 'This Delivery man was dismissed' });

    const { email } = req.body;

    if (email && email !== deliveryman.email) {
      const deliverymanExist = await Deliveryman.findOne({
        where: { email },
      });

      if (deliverymanExist)
        return res.status(400).json({ error: 'Email already registered' });
    }

    const deliverymanUpdate = await deliveryman.update(req.body);

    return res.json(deliverymanUpdate);
  }
}

export default new DeliverymanController();

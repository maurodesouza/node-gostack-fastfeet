import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

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

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const { id } = req.params;

    if (!Number.isInteger(Number(id)))
      return res.status(400).json({ error: 'ID invalid' });

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman)
      return res.status(400).json({ error: 'Delivery man not found' });

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

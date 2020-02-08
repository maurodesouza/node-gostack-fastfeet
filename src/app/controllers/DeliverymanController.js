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

    const deliveryman = await Deliveryman.findOne({
      where: { email },
    });

    if (deliveryman)
      return res.status(400).json({ error: 'Email already registered' });

    const { id } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new DeliverymanController();

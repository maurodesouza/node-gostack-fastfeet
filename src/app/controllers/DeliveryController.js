import * as Yup from 'yup';

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

    await schema.validate(req.body).catch(({ message }) => {
      return res.status(400).json({ message });
    });

    const recipientExist = await Recipient.findByPk(recipient_id);

    if (!recipientExist)
      return res.status(400).json({ error: 'Recipient not found' });

    const deliverymanExist = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExist)
      return res.status(400).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.create(req.body);

    return res.json(delivery);
  }
}

export default new DeliveryController();

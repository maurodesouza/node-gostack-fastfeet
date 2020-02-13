import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemsController {
  async store(req, res) {
    const { deliveryman_id, delivery_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Deliveryman ID invalid' });

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Delivery ID invalid' });

    const { description } = req.body;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.findOne({
      where: { id: delivery_id, canceled_at: null, end_date: null },
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    const problem = await DeliveryProblem.create({
      description,
      delivery_id,
    });

    return res.json(problem);
  }

  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: { canceled_at: null, end_date: null },
      attributes: [
        'id',
        'product',
        'start_date',
        'deliveryman_id',
        'recipient_id',
      ],
      include: [
        {
          association: 'delivery_problems',
          attributes: ['id', 'description'],
        },
      ],
    });

    const deliveriesWithProblems = deliveries.filter(
      delivery => delivery.delivery_problems.length
    );

    return res.json(deliveriesWithProblems);
  }

  async show(req, res) {
    const { delivery_id } = req.params;

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Delivery ID invalid' });

    const delivery = await Delivery.findOne({
      where: { id: delivery_id, canceled_at: null, end_date: null },
      include: [
        {
          association: 'delivery_problems',
          attributes: ['id', 'description', 'created_at'],
        },
      ],
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    if (!delivery.delivery_problems.length)
      return res.status(400).json({ error: 'This delivery has not problems' });

    return res.json(delivery.delivery_problems);
  }
}

export default new DeliveryProblemsController();

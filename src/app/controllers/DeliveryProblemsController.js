import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import CancellationDelivery from '../jobs/CancellationDelivery';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemsController {
  async store(req, res) {
    const { delivery_id } = req.params;

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const { description, deliveryman_id } = req.body;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery)
      return res.status(400).json({ error: 'Encomenda não encontrada !' });

    if (delivery.canceled_at)
      return res.status(400).json({ error: 'Essa encomenda foi cancelada !' });

    if (delivery.end_date)
      return res
        .status(400)
        .json({ error: 'Essa encomenda já foi entregue !' });

    if (delivery.deliveryman_id !== deliveryman_id)
      return res
        .status(400)
        .json({ error: 'Essa encomenda pertence a outro entregador !' });

    if (!delivery.have_problem) {
      delivery.have_problem = true;

      await delivery.save();
    }

    const problem = await DeliveryProblem.create({
      description,
      delivery_id,
    });

    return res.json(problem);
  }

  async show(req, res) {
    const { delivery_id } = req.params;

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Envie um ID valido !' });

    const delivery = await Delivery.findOne({
      where: { id: delivery_id },
      attributes: ['id', 'have_problem'],
      include: [
        {
          association: 'delivery_problems',
          attributes: ['id', 'description', 'created_at'],
        },
      ],
      order: [['delivery_problems', 'created_at', 'DESC']],
    });

    if (!delivery)
      return res.status(400).json({ error: 'Encomenda não encontrada !' });

    if (!delivery.have_problem)
      return res
        .status(400)
        .json({ error: 'Essa encomenda não possui nenhum problema !' });

    return res.json(delivery);
  }

  async delete(req, res) {
    const { problem_id } = req.params;

    if (!Number.isInteger(Number(problem_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const problem = await DeliveryProblem.findByPk(problem_id);

    if (!problem)
      return res.status(400).json({ error: 'Problema não encontrado !' });

    const { delivery_id, description } = problem;

    const delivery = await Delivery.findOne({
      where: { id: delivery_id },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (delivery.end_date)
      return res.status(400).json({
        error: 'Você não pode cancelar um encomenda que já foi entregue !',
      });

    if (delivery.canceled_at)
      return res
        .status(400)
        .json({ error: 'Essa encomenda já foi cancelada !' });

    const deliveryCanceled = await delivery.update({
      canceled_at: new Date(),
      status: 'cancelada',
    });

    await Queue.add(CancellationDelivery.key, {
      deliveryman: delivery.deliveryman,
      delivery,
      problem: description,
    });

    return res.json(deliveryCanceled);
  }
}

export default new DeliveryProblemsController();

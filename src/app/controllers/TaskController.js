import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class TaskController {
  async index(req, res) {
    const { deliveryman_id } = req.params;
    const { state = 'pendente', per_page = 5, page = 1 } = req.query;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman)
      return res.status(400).json({ error: 'Entregador não encontrado !' });

    const query = {
      deliveryman_id,
      status:
        state === 'pendente' ? { [Op.or]: ['pendente', 'retirada'] } : state,
    };

    const count = await Delivery.count({ where: query });

    const deliveries = await Delivery.findAll({
      where: query,
      limit: per_page,
      offset: (page - 1) * per_page,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: {
            exclude: ['updatedAt', 'email', 'complement'],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.header('Access-Control-Expose-Headers', 'X-total-count');

    return res.append('X-total-count', count).json(deliveries);
  }
}

export default new TaskController();

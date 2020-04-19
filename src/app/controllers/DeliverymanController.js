import * as Yup from 'yup';
import { Op } from 'sequelize';

import File from '../models/File';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const { name, email } = req.body;

    const deliverymanExist = await Deliveryman.findOne({
      where: { email },
    });

    if (deliverymanExist)
      return res.status(400).json({ error: 'Esse email já esta cadastrado !' });

    const { id } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const { q, page = 1 } = req.query;

    const { count, rows: deliverymans } = await Deliveryman.findAndCountAll({
      where: {
        name: { [Op.iRegexp]: q },
      },
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.header('Access-Control-Expose-Headers', 'X-total-count');

    return res.append('X-total-count', count).json(deliverymans);
  }

  async show(req, res) {
    const { deliveryman_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
      attributes: {
        exclude: ['updatedAt'],
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Entregador não encontrado !' });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number().integer(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const { deliveryman_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman)
      return res.status(400).json({ error: 'Entregador não encontrado !' });

    const { email } = req.body;

    if (email && email !== deliveryman.email) {
      const deliverymanExist = await Deliveryman.findOne({
        where: { email },
      });

      if (deliverymanExist)
        return res
          .status(400)
          .json({ error: 'Esse email já esta cadastrado !' });
    }

    const deliverymanUpdate = await deliveryman.update(req.body);

    return res.json(deliverymanUpdate);
  }

  async delete(req, res) {
    const { deliveryman_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman)
      return res.status(400).json({ error: 'Entregador não encontrado !' });

    const delivery = await Delivery.findOne({
      where: {
        deliveryman_id,
        status: { [Op.or]: ['pendente', 'retirada'] },
      },
    });

    if (delivery)
      return res.status(401).json({
        error:
          'Não é possivel excluir um entregador com alguma encomenda pendente ou em andamento !',
      });

    await deliveryman.destroy();

    return res.json();
  }
}

export default new DeliverymanController();

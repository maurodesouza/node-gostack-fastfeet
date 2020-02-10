import { Op } from 'sequelize';

import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class DeliverymanDismissedController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findAll({
      where: { dismissed_at: { [Op.ne]: null } },
      attributes: ['name', 'email', 'created_at', 'dismissed_at'],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)))
      return res.status(400).json({ error: 'ID invalid' });

    const deliveryman = await Deliveryman.findOne({
      where: { id },
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
      return res.status(400).json({ error: 'Delivery man already dismissed' });

    deliveryman.dismissed_at = new Date();

    await deliveryman.save();

    return res.json(deliveryman);
  }
}

export default new DeliverymanDismissedController();

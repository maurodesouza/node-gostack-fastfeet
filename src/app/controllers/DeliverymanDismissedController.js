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
}

export default new DeliverymanDismissedController();

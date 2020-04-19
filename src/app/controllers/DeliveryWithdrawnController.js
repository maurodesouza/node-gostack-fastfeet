import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  startOfHour,
  isWithinInterval,
  setHours,
} from 'date-fns';

import Delivery from '../models/Delivery';

class DeliveryWithdrawnController {
  async update(req, res) {
    const currentDate = new Date();

    if (
      !isWithinInterval(currentDate, {
        start: startOfHour(setHours(currentDate, 8)),
        end: startOfHour(setHours(currentDate, 18)),
      })
    )
      return res.status(400).json({
        error: 'Você só pode fazer retiradas entre às 08:00h e 18:00h',
      });

    const { delivery_id } = req.params;
    const { deliveryman_id } = req.body;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const deliveriesOfTheDay = await Delivery.count({
      where: {
        deliveryman_id,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(currentDate), endOfDay(currentDate)],
        },
      },
    });

    if (deliveriesOfTheDay > 5)
      return res
        .status(400)
        .json({ error: 'Você só pode fazer cinco retiradas por dia !' });

    const delivery = await Delivery.findOne({
      where: { id: delivery_id, deliveryman_id },
      attributes: ['id', 'product', 'start_date', 'created_at'],
    });

    if (!delivery)
      return res.status(400).json({ error: 'Encomenda não encontrada !' });

    if (delivery.start_date)
      return res
        .status(400)
        .json({ error: 'Essa encomenda já foi retirada !' });

    if (delivery.end_date)
      return res
        .status(400)
        .json({ error: 'Essa encomenda já foi entregue !' });

    if (delivery.canceled_at)
      return res.status(400).json({ error: 'Essa encomenda foi cancelada !' });

    delivery.start_date = currentDate;
    delivery.status = 'retirada';

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryWithdrawnController();

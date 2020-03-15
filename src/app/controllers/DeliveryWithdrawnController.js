import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  startOfHour,
  isWithinInterval,
  setHours,
} from 'date-fns';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

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

    const { deliveryman_id, delivery_id } = req.params;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Envie um ID válido !' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Entregador não encontrado !' });

    const deliveriesOfTheDay = await Delivery.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(currentDate), endOfDay(currentDate)],
        },
      },
    });

    if (deliveriesOfTheDay.length > 5)
      return res
        .status(400)
        .json({ error: 'Você só pode fazer cinco retiradas por dia !' });

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
        end_date: null,
        canceled_at: null,
      },
      attributes: ['id', 'product', 'start_date', 'created_at'],
    });

    if (!delivery)
      return res.status(400).json({ error: 'Encomenda não encontrada !' });

    if (delivery.start_date)
      return res
        .status(400)
        .json({ error: 'Essa encomenda já foi retirada !' });

    delivery.start_date = currentDate;
    delivery.status = 'retirada';

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryWithdrawnController();

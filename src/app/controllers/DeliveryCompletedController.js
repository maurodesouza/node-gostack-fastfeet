import File from '../models/File';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliveryCompletedController {
  async update(req, res) {
    if (!req.file)
      return res.status(401).json({ error: 'You have not uploaded any files' });

    const { deliveryman_id, delivery_id } = req.params;
    const { originalname: name, filename: path } = req.file;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Deliveryman ID invalid' });

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Delivery ID invalid' });

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id, dismissed_at: null },
    });

    if (!deliveryman)
      return res.status(400).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
      },
    });

    if (!delivery) return res.status(400).json({ error: 'Delivery not found' });

    if (delivery.canceled_at)
      return res.status(400).json({ error: 'Delivery was canceled' });

    if (delivery.end_date)
      return res.status(400).json({ error: 'Delivery already completed' });

    if (!delivery.start_date)
      return res.status(400).json({ error: 'Delivery not yet withdrawn' });

    const { id } = await File.create({
      name,
      path,
    });

    delivery.signature_id = id;
    delivery.end_date = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryCompletedController();

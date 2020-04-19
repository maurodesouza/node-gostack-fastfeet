import Delivery from '../models/Delivery';

class DeliveryCompletedController {
  async update(req, res) {
    const { delivery_id } = req.params;
    const { deliveryman_id, signature_id } = req.body;

    if (!Number.isInteger(Number(deliveryman_id)))
      return res.status(400).json({ error: 'Envie um ID valido !' });

    if (!Number.isInteger(Number(delivery_id)))
      return res.status(400).json({ error: 'Envie um ID valido !' });

    const delivery = await Delivery.findOne({
      where: { id: delivery_id, deliveryman_id },
    });

    if (!delivery)
      return res.status(400).json({ error: 'Encomenda não encontrada !' });

    if (delivery.deliveryman_id !== deliveryman_id)
      return res
        .status(401)
        .json({ error: 'Essa encomenda pertence a outro entregador !' });

    if (delivery.canceled_at)
      return res.status(400).json({ error: 'Essa encomenda foi cancelada !' });

    if (delivery.end_date)
      return res
        .status(400)
        .json({ error: 'Essa encomenda já foi completada !' });

    if (!delivery.start_date)
      return res
        .status(400)
        .json({ error: 'Essa encomenda ainda está pendente !' });

    delivery.signature_id = signature_id;
    delivery.end_date = new Date();
    delivery.status = 'entregue';

    await delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryCompletedController();

import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      street: Yup.string().required(),
      number: Yup.number()
        .integer()
        .required(),
      complement: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const { email, zip_code } = req.body;

    const recipientExist = await Recipient.findOne({ where: { email } });

    if (recipientExist)
      return res.status(400).json({ error: 'Esse email já foi cadastrado !' });

    const match = zip_code.match(/\d{5}-\d{3}/g);

    if (!(match && match[0] === zip_code))
      return res.status(400).json({ error: 'Envie um cep valido !' });

    const {
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      email,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    });
  }

  async index(req, res) {
    const { q, page = 1 } = req.query;

    const { count, rows: recipients } = await Recipient.findAndCountAll({
      where: {
        name: { [Op.iRegexp]: q },
      },
      limit: 10,
      offset: (page - 1) * 10,
      order: [['created_at', 'DESC']],
    });

    res.header('Access-Control-Expose-Headers', 'X-total-count');

    return res.append('X-total-count', count).json(recipients);
  }

  async show(req, res) {
    const { recipient_id } = req.params;

    if (!Number.isInteger(Number(recipient_id)))
      return res.status(400).json({ error: 'Envie um ID valido !' });

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient)
      return res.status(400).json({ error: 'Destinatário não encontrado !' });

    return res.json(recipient);
  }

  async update(req, res) {
    const { recipient_id } = req.params;

    if (!Number.isInteger(Number(recipient_id)))
      return res.status(400).json({ error: 'Envie um ID valido !' });

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      street: Yup.string(),
      number: Yup.number().integer(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zip_code: Yup.string(),
    });

    try {
      await schema.validate(req.body);
    } catch ({ message }) {
      return res.status(400).json({ message });
    }

    const { email, zip_code } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient)
      return res.status(400).json({ error: 'Destinatário não encontrado !' });

    if (email && email !== recipient.email) {
      const recipientExist = await Recipient.findOne({ where: { email } });

      if (recipientExist)
        return res
          .status(400)
          .json({ error: 'Esse email já foi cadastrado !' });
    }

    if (zip_code && zip_code !== recipient.zip_code) {
      const match = zip_code.match(/\d{5}-\d{3}/g);

      if (!(match && match[0] === zip_code))
        return res.status(400).json({ error: 'Envie um cep valido !' });
    }

    const recipientUpdated = await recipient.update(req.body);

    return res.json(recipientUpdated);
  }

  async delete(req, res) {
    const { recipient_id } = req.params;

    if (!Number.isInteger(Number(recipient_id)))
      return res.status(400).json({ error: 'Envie um ID valido !' });

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient)
      return res.status(400).json({ error: 'Destinatario não encontrado !' });

    const deliveries = await Delivery.findOne({
      where: {
        recipient_id,
        status: { [Op.or]: ['pendente', 'retirada'] },
      },
    });

    if (deliveries)
      return res.status(401).json({
        error:
          'Não é possivel excluir um destinatário com alguma encomenda pendente ou em andamento !',
      });

    await recipient.destroy();

    return res.json();
  }
}

export default new RecipientController();

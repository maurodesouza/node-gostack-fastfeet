import * as Yup from 'yup';
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

    await schema.validate(req.body).catch(({ message }) => {
      return res.status(400).json({ message });
    });

    const { email, zip_code } = req.body;

    const recipientExist = await Recipient.findOne({ where: { email } });

    if (recipientExist)
      return res.status(400).json({ error: 'Recipient already exist' });

    const match = zip_code.match(/\d{5}-\d{3}/g);

    if (!(match && match[0] === zip_code))
      return res.status(400).json({ error: 'Badly formatted zip code' });

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

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      email: Yup.string().email(),
      street: Yup.string(),
      number: Yup.number().integer(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      zip_code: Yup.string(),
    });

    await schema.validate(req.body).catch(({ message }) => {
      return res.status(400).json({ message });
    });

    const { id, email, zip_code } = req.body;

    const recipient = await Recipient.findByPk(id);

    if (!recipient)
      return res.status(400).json({ error: 'Recipient not found' });

    if (email && email !== recipient.email) {
      const recipientExist = await Recipient.findOne({ where: { email } });

      if (recipientExist)
        return res.status(400).json({ error: 'Recipient already exist' });
    }

    if (zip_code && zip_code !== recipient.zip_code) {
      const match = zip_code.match(/\d{5}-\d{3}/g);

      if (!(match && match[0] === zip_code))
        return res.status(400).json({ error: 'Badly formatted zip code' });
    }

    const recipientUpdated = await recipient.update(req.body);

    return res.json({
      recipientUpdated,
    });
  }
}

export default new RecipientController();

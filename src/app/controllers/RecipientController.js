import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
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
}

export default new RecipientController();

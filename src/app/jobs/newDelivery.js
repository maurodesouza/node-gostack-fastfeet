import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'newDelivery';
  }

  async handle({ data: { deliveryman, recipient, delivery } }) {
    const {
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code,
    } = recipient;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Você tem uma nova entrega',
      template: 'newDelivery',
      context: {
        deliveryman: deliveryman.name,
        delivery: {
          produto: delivery.product,
          'cadastrado em': format(
            parseISO(delivery.createdAt),
            "dd 'de' MMMM 'às' H:mm'h'",
            {
              locale: pt,
            }
          ),
        },
        recipient: {
          para: name,
          rua: street,
          numero: number,
          complemento: complement || 'Não possui',
          cidade: city,
          estado: state,
          CEP: zip_code,
        },
      },
    });
  }
}

export default new NewDelivery();

import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class CancellationDelivery {
  get key() {
    return 'CancellationDelivery';
  }

  async handle({ data: { deliveryman, delivery, problem } }) {
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Você tem uma entrega cancelada',
      template: 'cancellationDelivery',
      context: {
        deliveryman: deliveryman.name,
        delivery: {
          id: delivery.id,
          produto: delivery.product,
          'cancelado em': format(
            parseISO(delivery.canceled_at),
            "dd 'de' MMMM 'às' H:mm'h'",
            {
              locale: pt,
            }
          ),
        },
        problem,
      },
    });
  }
}

export default new CancellationDelivery();

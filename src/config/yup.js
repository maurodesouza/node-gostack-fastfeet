import { setLocale } from 'yup';

setLocale({
  mixed: {
    required: ({ path }) => `O campo ${path} é obrigatório !`,
    notType: ({ path, type }) => `O campo ${path} deve ser do tipo ${type}`,
  },
  string: {
    email: ({ value }) => `${value} não é um email válido !`,
  },
  number: {
    integer: ({ path }) =>
      `O campo ${path} precisa receber um numero inteiro !`,
  },
});

export default setLocale;

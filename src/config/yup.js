import { setLocale } from 'yup';

setLocale({
  mixed: {
    required: ({ path }) => `The ${path} field is required`,
    notType: ({ path, type }) => `The ${path} field must be ${type} type`,
  },
  string: {
    email: ({ value }) => `${value} is not a email valid`,
  },
  number: {
    integer: ({ path, value }) => `${path} field: ${value} is not an integer`,
  },
});

export default setLocale;

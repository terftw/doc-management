import { FieldConfig } from 'src/components/ui/form';

export type LoginFormInputs = {
  email: string;
  password: string;
};

export const loginFormDefaultValues: LoginFormInputs = {
  email: '',
  password: '',
};

export const loginFormFields: FieldConfig<LoginFormInputs>[] = [
  {
    name: 'email',
    label: 'Email',
    placeholder: 'your@email.com',
    required: true,
    validation: {
      required: 'Email is required',
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: 'Please enter a valid email address',
      },
    },
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: '••••••',
    required: true,
    validation: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters long',
      },
    },
  },
];

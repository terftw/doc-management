import { FieldConfig } from 'src/components/ui/form';

export type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

export const registerDefaultValues: RegisterFormInputs = {
  name: '',
  email: '',
  password: '',
};

export const registerFormFields: FieldConfig<RegisterFormInputs>[] = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'John Doe',
    required: true,
    validation: {
      required: 'Name is required',
    },
  },
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

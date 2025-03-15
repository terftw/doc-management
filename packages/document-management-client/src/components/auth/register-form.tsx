'use client';

import { registerUser } from '@/lib/firebase-auth-service';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Form } from '../ui/form';
import { useNotifications } from '../ui/notifications';
import FormCard from './form-card';

export type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const router = useRouter();
  const { addNotification } = useNotifications();

  const onSubmit = async (data: RegisterFormInputs) => {
    const { name, email, password } = data;
    const { success, message } = await registerUser(name, email, password);

    addNotification({
      title: success ? 'Success' : 'Error',
      message,
      type: success ? 'success' : 'error',
    });

    if (success) {
      router.push('/login');
    }
  };

  return (
    <FormCard title="Register as a user">
      <Form<RegisterFormInputs>
        defaultValues={{
          name: '',
          email: '',
          password: '',
        }}
        fields={[
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
        ]}
        onSubmit={onSubmit}
        submitButtonText="Sign up"
        isLoading={false}
      />
    </FormCard>
  );
};

export default RegisterForm;

'use client';

import { Form } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { loginUser } from '@/lib/firebase-auth-service';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import FormCard from './form-card';

export type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();
  const { addNotification } = useNotifications();

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data;
    const { success, message } = await loginUser(email, password);

    addNotification({
      title: success ? 'Success' : 'Error',
      message,
      type: success ? 'success' : 'error',
    });

    if (success) {
      router.push('/home');
    }
  };

  return (
    <FormCard title="Access Your Account">
      <Form<LoginFormInputs>
        defaultValues={{
          email: '',
          password: '',
        }}
        fields={[
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
        submitButtonText="Login"
        isLoading={false}
      />
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Don&apos;t have an account?{' '}
        <span>
          <Link href="/register">Sign up</Link>
        </span>
      </Typography>
    </FormCard>
  );
};

export default LoginForm;

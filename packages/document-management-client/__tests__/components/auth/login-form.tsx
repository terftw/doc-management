import LoginForm from '@/components/auth/login-form';
import { screen } from '@testing-library/react';
import React from 'react';

import { renderWithTheme } from '../../test-utils';

describe('LoginForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo, form title, and sign up link', () => {
    renderWithTheme(<LoginForm />);

    expect(screen.getByText('Access Your Account')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});

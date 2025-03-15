import RegisterForm from '@/components/auth/register-form';
import { screen } from '@testing-library/react';

import { renderWithTheme } from '../../test-utils';

describe('RegisterForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders form title, and button', () => {
    renderWithTheme(<RegisterForm />);

    expect(screen.getByText('Register as a user')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });
});

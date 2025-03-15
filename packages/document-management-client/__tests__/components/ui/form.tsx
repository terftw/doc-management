import { TextField } from '@mui/material';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockOnSubmit, renderForm } from '../../fixtures/ui/form.fixtures';

describe('Form Component', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    renderForm();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('displays loading state when isLoading is true', () => {
    renderForm({ isLoading: true });

    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });

  test('validates required fields on submit', async () => {
    renderForm();

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates email format', async () => {
    renderForm();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    renderForm();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        { name: 'John Doe', email: 'john@example.com' },
        expect.anything(),
      );
    });
  });

  test('renders custom field when renderCustomField is provided', () => {
    const renderCustomField = (name: string) => {
      if (name === 'name') {
        return <TextField data-testid="custom-name-field" />;
      }
      return null;
    };

    renderForm({ renderCustomField });

    expect(screen.getByTestId('custom-name-field')).toBeInTheDocument();
  });

  test('renders field using fieldConfig.renderField when provided', () => {
    const customFields = [
      {
        name: 'name',
        label: 'Name',
        required: true,
        renderField: () => <TextField data-testid="field-render-method" />,
      },
      {
        name: 'email',
        label: 'Email',
        required: true,
      },
    ];

    renderForm({ fields: customFields });

    expect(screen.getByTestId('field-render-method')).toBeInTheDocument();
  });
});

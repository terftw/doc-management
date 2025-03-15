import { Form } from '@/components/ui/form';
import { FormProps } from '@/components/ui/form';
import { createTheme } from '@mui/material/styles';
import React from 'react';
import { FieldValues } from 'react-hook-form';

import { renderWithTheme } from '../../test-utils';

export const theme = createTheme();

export const mockOnSubmit = jest.fn();

export const defaultFormFields = [
  {
    name: 'name',
    label: 'Name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    validation: {
      required: 'Email is required',
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: 'Please enter a valid email address',
      },
    },
  },
];

export const defaultFormValues = {
  name: '',
  email: '',
};

export const createDefaultProps = (overrides = {}) => ({
  defaultValues: defaultFormValues,
  fields: defaultFormFields,
  onSubmit: mockOnSubmit,
  submitButtonText: 'Submit',
  ...overrides,
});

export const renderForm = <T extends FieldValues>(props: Partial<FormProps<T>> = {}) => {
  return renderWithTheme(<Form {...(createDefaultProps(props) as unknown as FormProps<T>)} />);
};

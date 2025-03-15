import { TextField } from '@mui/material';
import React from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { ControllerRenderProps } from 'react-hook-form';

import { FieldConfig } from './types';

export const defaultRenderField = <T extends FieldValues>(
  field: ControllerRenderProps<T, Path<T>>,
  config: FieldConfig<T>,
  error?: string,
) => (
  <TextField
    {...field}
    id={field.name.toString()}
    type={config.type || 'text'}
    placeholder={config.placeholder || `Enter ${config.label.toLowerCase()}`}
    autoComplete={field.name.toString()}
    required={config.required}
    fullWidth
    variant="outlined"
    error={!!error}
    helperText={error}
    slotProps={{
      input: {
        sx: {
          borderRadius: 1.5,
        },
      },
    }}
  />
);

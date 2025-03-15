import { Box, Button, FormControl, FormLabel, useTheme } from '@mui/material';
import React from 'react';
import { Controller, DefaultValues, FieldValues, useForm } from 'react-hook-form';

import { defaultRenderField } from './default-field';
import { FormProps } from './types';

/**
 * A form component that allows you to create a form with a list of fields.
 * Refer to this url for more information regarding React Hook Form types: https://react-hook-form.com/ts
 *
 * @param defaultValues - The default values for the form.
 * @param fields - The fields for the form.
 * @param onSubmit - The function to call when the form is submitted.
 * @param submitButtonText - The text for the submit button.
 * @param isLoading - Whether the form is loading.
 * @param renderCustomField - The function to call to render a custom field.
 * @returns A form component.
 */
export const Form = <T extends FieldValues>({
  defaultValues,
  fields,
  onSubmit,
  submitButtonText,
  isLoading = false,
  renderCustomField,
}: FormProps<T>) => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
    mode: 'onSubmit',
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2.5 }}
    >
      {/* Standard way to render fields based on the fields prop */}
      {fields.map(fieldConfig => (
        <FormControl key={fieldConfig.name.toString()}>
          <FormLabel
            htmlFor={fieldConfig.name.toString()}
            sx={{
              marginBottom: theme.spacing(0.5),
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          >
            {fieldConfig.label}
          </FormLabel>

          <Controller
            name={fieldConfig.name}
            control={control}
            rules={
              fieldConfig.validation ||
              (fieldConfig.required ? { required: `${fieldConfig.label} is required` } : {})
            }
            render={({ field }): React.ReactElement => {
              const error = errors[fieldConfig.name]?.message as string | undefined;

              /**
               * If a custom field is provided, use it, this would be applied to all fields
               * You can treat this as a global override for all fields
               */
              if (renderCustomField) {
                const result = renderCustomField(fieldConfig.name, control, error);
                return result && typeof result === 'object' ? (
                  (result as React.ReactElement)
                ) : (
                  <></>
                );
              }

              /**
               * If a render field is provided in the field config, it would be applied
               * You can treat this as a specific override for a field
               */
              if (fieldConfig.renderField) {
                const result = fieldConfig.renderField(field, error);
                return result && typeof result === 'object' ? (
                  (result as React.ReactElement)
                ) : (
                  <></>
                );
              }

              // If no custom field is provided, use the default render field
              return defaultRenderField<T>(field, fieldConfig, error);
            }}
          />
        </FormControl>
      ))}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disableElevation
        disabled={isSubmitting || isLoading}
        sx={{
          marginTop: theme.spacing(3),
          padding: theme.spacing(1.5),
          fontWeight: 600,
          borderRadius: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        {isSubmitting || isLoading ? 'Loading...' : submitButtonText}
      </Button>
    </Box>
  );
};

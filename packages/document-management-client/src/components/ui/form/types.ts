import { Control } from 'react-hook-form';
import { Path, SubmitHandler } from 'react-hook-form';
import { ControllerRenderProps } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';

export type FieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  validation?: unknown;
  renderField?: (_field: ControllerRenderProps<T, Path<T>>, _error?: string) => React.ReactNode;
};

export type FormProps<T extends FieldValues> = {
  defaultValues: T;
  fields: FieldConfig<T>[];
  onSubmit: SubmitHandler<T>;
  submitButtonText: string;
  isLoading?: boolean;
  renderCustomField?: (
    _name: keyof T & string,
    _control: Control<T>,
    _error?: string,
  ) => React.ReactNode;
};

import DropzoneFormField from '@/components/shared/dropzone-form-field';
import { FieldConfig } from 'src/components/ui/form';

export type UploadDocumentFormInputs = {
  file: File | null;
  description: string;
};

export const uploadDocumentFormDefaultValues = {
  file: null,
  description: '',
};

export const uploadDocumentFormFields: FieldConfig<UploadDocumentFormInputs>[] = [
  {
    name: 'file',
    label: 'Name',
    placeholder: 'Folder name',
    required: true,
    validation: {
      required: 'Please select a file',
    },
    renderField: (field, errors) => (
      <DropzoneFormField
        value={field.value instanceof File ? field.value : null}
        onChange={field.onChange}
        error={!!errors}
        helperText={errors}
      />
    ),
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Folder description',
  },
];

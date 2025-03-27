import { FieldConfig } from '@/components/ui/form';

export type EditDocumentFormInputs = {
  description: string;
};

export const editDocumentFormFields: FieldConfig<EditDocumentFormInputs>[] = [
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Folder description',
  },
];

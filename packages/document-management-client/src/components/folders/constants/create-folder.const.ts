import { FieldConfig } from '@/components/ui/form';

export type CreateFolderFormInputs = {
  name: string;
  description: string;
};

export const createFolderFormDefaultValues: CreateFolderFormInputs = {
  name: '',
  description: '',
};

export const createFolderFormFields: FieldConfig<CreateFolderFormInputs>[] = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Folder name',
    required: true,
    validation: {
      required: 'Name is required',
    },
  },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'Folder description',
  },
];

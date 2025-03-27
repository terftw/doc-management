import { FieldConfig } from '@/components/ui/form';

export type EditFolderFormInputs = {
  name: string;
  description: string;
};

export const editFolderFormFields: FieldConfig<EditFolderFormInputs>[] = [
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

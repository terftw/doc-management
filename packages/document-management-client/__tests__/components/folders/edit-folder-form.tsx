import EditFolderForm from '@/components/folders/edit-folder-form';
import { screen } from '@testing-library/react';

import { renderWithTheme } from '../../test-utils';

describe('EditFolderForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders form title, and button', () => {
    renderWithTheme(<EditFolderForm />);

    expect(screen.getByRole('heading', { name: 'Edit Folder' })).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Folder' })).toBeInTheDocument();
  });
});

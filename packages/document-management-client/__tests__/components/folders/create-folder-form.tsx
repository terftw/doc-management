import CreateFolderForm from '@/components/folders/create-folder-form';
import { screen } from '@testing-library/react';

import { renderWithTheme } from '../../test-utils';

describe('CreateFolderForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders form title, and button', () => {
    renderWithTheme(<CreateFolderForm />);

    expect(screen.getByRole('heading', { name: 'Create New Folder' })).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Folder' })).toBeInTheDocument();
  });
});

import DeleteDocumentForm from '@/components/documents/delete-document-form';
import { screen } from '@testing-library/react';

import { renderWithTheme } from '../../test-utils';

describe('DeleteDocumentForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders form title, and button', () => {
    renderWithTheme(<DeleteDocumentForm />);

    expect(screen.getByRole('heading', { name: 'Delete Document' })).toBeInTheDocument();
    expect(screen.getByText('Warning: This action cannot be undone')).toBeInTheDocument();
  });
});

import EditDocumentForm from '@/components/documents/edit-document-form';
import { screen } from '@testing-library/react';

import { renderWithTheme } from '../../test-utils';

describe('EditDocumentForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders form title, and button', () => {
    renderWithTheme(<EditDocumentForm />);

    expect(screen.getByRole('heading', { name: 'Edit Document' })).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Document' })).toBeInTheDocument();
  });
});

import UploadDocForm from '@/components/documents/upload-doc-form';
import { screen } from '@testing-library/react';
import React from 'react';

import { renderWithTheme } from '../../test-utils';

describe('UploadDocForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders form title, and button', () => {
    renderWithTheme(<UploadDocForm />);

    // Use more specific queries
    expect(screen.getByRole('heading', { name: 'Upload Document' })).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('or click to select files')).toBeInTheDocument();
  });
});

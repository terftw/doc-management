import { Table } from '@/components/ui/table';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { createTableProps, mockData } from '../../fixtures/ui/table.fixtures';
import { renderWithTheme } from '../../test-utils';

// Create actual renders of the child components for integration tests
jest.unmock('@/components/ui/table/content');
jest.unmock('@/components/ui/table/empty');
jest.unmock('@/components/ui/table/skeleton');
jest.unmock('@/components/ui/table/pagination');
jest.unmock('@/components/ui/table/table-row-menu');

const theme = createTheme();

describe('Table Integration', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('displays data rows correctly', () => {
    const handleRowClick = jest.fn();
    renderWithTheme(<Table {...createTableProps({ handleRowClick })} />);

    // Check for data presence
    mockData.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.age.toString())).toBeInTheDocument();
      expect(screen.getByText(item.email)).toBeInTheDocument();
    });
  });

  it('calls handleRowClick when a row is clicked', () => {
    const handleRowClick = jest.fn();
    renderWithTheme(
      <ThemeProvider theme={theme}>
        <Table {...createTableProps({ handleRowClick })} />
      </ThemeProvider>,
    );

    // Find the first row and click it
    const firstRowName = screen.getByText(mockData[0].name);
    const row = firstRowName.closest('tr');
    if (row) {
      fireEvent.click(row);
      expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
    }
  });

  it('displays empty state correctly', () => {
    const customEmptyMessage = 'No data found';
    renderWithTheme(
      <ThemeProvider theme={theme}>
        <Table
          {...createTableProps({
            data: [],
            emptyMessage: customEmptyMessage,
          })}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText(customEmptyMessage)).toBeInTheDocument();
  });

  it('displays loading skeleton when isLoading is true', () => {
    renderWithTheme(
      <ThemeProvider theme={theme}>
        <Table {...createTableProps({ isLoading: true })} />
      </ThemeProvider>,
    );

    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('handles pagination correctly', () => {
    const handlePageChange = jest.fn();
    renderWithTheme(
      <ThemeProvider theme={theme}>
        <Table {...createTableProps({ handlePageChange, page: 1 })} />
      </ThemeProvider>,
    );

    const nextButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(expect.anything(), 1);
  });

  it('handles rows per page change correctly', () => {
    const handleRowsPerPageChange = jest.fn();
    renderWithTheme(
      <ThemeProvider theme={theme}>
        <Table {...createTableProps({ handleRowsPerPageChange })} />
      </ThemeProvider>,
    );

    // Find the rows per page select and change it
    const select = screen.getByLabelText(/rows per page/i);
    fireEvent.mouseDown(select);

    const options = screen.getAllByRole('option');
    fireEvent.click(options[1]); // Select the second option

    expect(handleRowsPerPageChange).toHaveBeenCalled();
  });

  it('renders row menu when anchorEl is provided', () => {
    // Create a mock anchor element
    const anchorEl = document.createElement('button');
    document.body.appendChild(anchorEl);

    const handleMenuClose = jest.fn();

    renderWithTheme(
      <ThemeProvider theme={theme}>
        <Table
          {...createTableProps({
            anchorEl,
            handleMenuClose,
          })}
        />
      </ThemeProvider>,
    );

    // Check that menu items are rendered
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();

    // Cleanup
    document.body.removeChild(anchorEl);
  });
});

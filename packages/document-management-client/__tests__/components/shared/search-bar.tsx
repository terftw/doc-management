import SearchBar from '@/components/shared/search-bar';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@mui/icons-material', () => ({
  Search: () => <div data-testid="SearchIcon" />,
}));

describe('SearchBar', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<SearchBar {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Search');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
  });

  it('renders with provided value', () => {
    render(<SearchBar {...defaultProps} value="test query" />);

    const inputElement = screen.getByPlaceholderText('Search');
    expect(inputElement).toHaveValue('test query');
  });

  it('calls onChange when input value changes', () => {
    render(<SearchBar {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Search');
    fireEvent.change(inputElement, { target: { value: 'new search' } });

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChange).toHaveBeenCalledWith('new search');
  });

  it('displays search icon', () => {
    render(<SearchBar {...defaultProps} />);

    const searchIcon = screen.getByTestId('SearchIcon');
    expect(searchIcon).toBeInTheDocument();
  });
});

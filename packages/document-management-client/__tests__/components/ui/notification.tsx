import { Notification } from '@/components/ui/notifications/notification';
import { AlertProps } from '@mui/material/Alert';
import { SnackbarProps } from '@mui/material/Snackbar';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { infoNotification } from '../../fixtures/ui/notification.fixtures';
import { errorNotification } from '../../fixtures/ui/notification.fixtures';
import { successNotification } from '../../fixtures/ui/notification.fixtures';
import { renderWithTheme } from '../../test-utils';

// Mock the MUI components
jest.mock('@mui/material/Alert', () => {
  return ({ children, onClose, severity }: AlertProps) => (
    <div data-testid="alert" data-severity={severity}>
      <button data-testid="close-button" onClick={onClose} />
      {children}
    </div>
  );
});

jest.mock('@mui/material/Snackbar', () => ({
  __esModule: true,
  default: (props: SnackbarProps) => {
    return props.open ? (
      <div data-testid="snackbar" data-autohide={props.autoHideDuration}>
        {props.children}
      </div>
    ) : null;
  },
}));

describe('Notification Component', () => {
  const mockDismiss = jest.fn();

  beforeEach(() => {
    mockDismiss.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('renders success notification correctly', () => {
    renderWithTheme(<Notification notification={successNotification} onDismiss={mockDismiss} />);

    expect(screen.getByTestId('snackbar')).toBeInTheDocument();
    expect(screen.getByTestId('alert')).toHaveAttribute('data-severity', 'success');
    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Success message details')).toBeInTheDocument();
  });

  test('renders error notification without message', () => {
    renderWithTheme(<Notification notification={errorNotification} onDismiss={mockDismiss} />);

    expect(screen.getByTestId('alert')).toHaveAttribute('data-severity', 'error');
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.queryByText(/message/i)).not.toBeInTheDocument();
  });

  test('dismisses notification when close button is clicked', () => {
    renderWithTheme(<Notification notification={infoNotification} onDismiss={mockDismiss} />);

    fireEvent.click(screen.getByTestId('close-button'));

    expect(mockDismiss).toHaveBeenCalledWith('test-info-id');
  });

  test('does not dismiss on clickaway events', () => {
    const { container } = renderWithTheme(
      <Notification notification={successNotification} onDismiss={mockDismiss} />,
    );

    const instance = container.firstChild;
    const snackbarProps = (
      instance as unknown as {
        __reactProps$?: { onClose?: (_event: Event, _reason: string) => void };
      }
    )?.__reactProps$;
    const onClose = snackbarProps?.onClose;

    if (onClose) {
      onClose(new Event('click'), 'clickaway');
    }

    expect(mockDismiss).not.toHaveBeenCalled();
  });
});

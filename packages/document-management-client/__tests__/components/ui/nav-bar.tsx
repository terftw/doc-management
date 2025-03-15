import { NavBar } from '@/components/ui/nav-bar';
import { useMenu } from '@/components/ui/nav-bar/';
import { UserMenuProps } from '@/components/ui/nav-bar/components';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/contexts/user-context';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { renderWithTheme } from '../../test-utils';

// Mock dependencies
jest.mock('@/contexts/user-context');
jest.mock('@/lib/firebase-auth-service');
jest.mock('@/components/ui/notifications');
jest.mock('@/components/ui/nav-bar/hooks');
jest.mock('@/components/shared/home-logo', () => ({
  __esModule: true,
  default: () => <div data-testid="home-logo">Home Logo</div>,
}));

jest.mock('@/components/ui/nav-bar/components', () => ({
  UserMenu: ({ userName, onOpen }: UserMenuProps) => (
    <div data-testid="user-menu">
      <span data-testid="user-name">{userName}</span>
      <button data-testid="open-menu" onClick={onOpen}>
        Open Menu
      </button>
    </div>
  ),
}));

describe('NavBar', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    displayName: 'Test User',
  };

  const mockNoUser = {
    displayName: null,
  };

  const mockAddNotification = jest.fn();
  const mockHandleOpen = jest.fn();
  const mockHandleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    (useNotifications as unknown as jest.Mock).mockReturnValue({
      addNotification: mockAddNotification,
    });
    (useMenu as jest.Mock).mockReturnValue({
      anchorEl: null,
      handleOpen: mockHandleOpen,
      handleClose: mockHandleClose,
    });

    // Mock location.reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  test('renders correctly with user', () => {
    renderWithTheme(<NavBar />);

    expect(screen.getByTestId('home-logo')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
  });

  test('renders correctly with no user name', () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockNoUser });

    renderWithTheme(<NavBar />);

    expect(screen.getByTestId('user-name')).toHaveTextContent('');
  });

  test('handles menu open', () => {
    renderWithTheme(<NavBar />);

    fireEvent.click(screen.getByTestId('open-menu'));

    expect(mockHandleOpen).toHaveBeenCalled();
  });
});

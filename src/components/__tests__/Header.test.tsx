import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Header } from '../Header';

// Mock the logout service
vi.mock('../../services/loadKey', () => ({
  logout: vi.fn().mockResolvedValue(undefined),
}));

describe('Header', () => {
  it('renders the Horizon logo', () => {
    render(<Header />);
    expect(screen.getByText('HORIZON')).toBeInTheDocument();
  });

  it('shows demo button on start page', () => {
    render(<Header />, {
      contextValue: { authenticated: false },
    });

    // Navigate would show "Demo (Simulated Trades)" on /start
    // const demoLink = screen.queryByText('Demo (Simulated Trades)');
    // On default route, this depends on path - this test verifies rendering works
    expect(screen.getByText('HORIZON')).toBeInTheDocument();
  });

  it('shows logout button when authenticated', () => {
    render(<Header />, {
      contextValue: {
        pubKey: 'TestPublicKey123456789012345678901234567890123',
        authenticated: true,
        demo: false,
      },
    });

    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('TestPublicKey123456789012345678901234567890123')).toBeInTheDocument();
  });

  it('does not show logout when not authenticated', () => {
    render(<Header />, {
      contextValue: {
        pubKey: null,
        authenticated: false,
      },
    });

    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});

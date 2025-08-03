import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConnectionStatus } from './ConnectionStatus';

describe('ConnectionStatus Component', () => {
  it('displays "Live" when connected', () => {
    render(<ConnectionStatus isConnected={true} />);

    const status = screen.getByText('Live');
    expect(status).toBeInTheDocument();
    expect(status).toHaveClass('text-green-600');
  });

  it('displays "Disconnected" when not connected', () => {
    render(<ConnectionStatus isConnected={false} />);

    const status = screen.getByText('Disconnected');
    expect(status).toBeInTheDocument();
    expect(status).toHaveClass('text-red-600');
  });

  it('shows green indicator when connected', () => {
    const { container } = render(<ConnectionStatus isConnected={true} />);

    const indicator = container.querySelector('.bg-green-500');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('animate-pulse');
  });

  it('shows red indicator when disconnected', () => {
    const { container } = render(<ConnectionStatus isConnected={false} />);

    const indicator = container.querySelector('.bg-red-500');
    expect(indicator).toBeInTheDocument();
    expect(indicator).not.toHaveClass('animate-pulse');
  });

  it('has proper layout with flex container', () => {
    const { container } = render(<ConnectionStatus isConnected={true} />);

    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toBeInTheDocument();
    expect(flexContainer).toHaveClass('items-center');
    expect(flexContainer).toHaveClass('space-x-2');
  });
});

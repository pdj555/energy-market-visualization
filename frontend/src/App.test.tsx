import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import App from './App';

describe('App Component', () => {
  it('renders the main heading', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Energy Market Visualization');
  });

  it('displays the coming soon message', () => {
    render(<App />);

    const message = screen.getByText(/premium energy market data visualization coming soon/i);
    expect(message).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<App />);

    // Check for proper semantic elements
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument(); // h1
  });
});

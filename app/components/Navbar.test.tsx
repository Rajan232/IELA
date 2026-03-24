import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

// Mock intersection observer since it's not available in jsdom
beforeAll(() => {
  class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver = IntersectionObserver as any;
});

describe('Navbar Component', () => {
  it('renders all navigation links properly', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});

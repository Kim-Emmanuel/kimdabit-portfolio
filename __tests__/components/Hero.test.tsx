import { render, screen } from '../utils/test-utils';
import Hero from '@/components/Hero';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

// Mock gsap
jest.mock('gsap', () => ({
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  })),
  to: jest.fn(),
  from: jest.fn(),
}));

describe('Hero Component', () => {
  it('renders hero section with animation canvas', () => {
    render(<Hero />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });
});

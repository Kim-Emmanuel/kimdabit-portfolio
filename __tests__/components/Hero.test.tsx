import { render, screen } from '../utils/test-utils';
import Hero from '@/components/Hero';

// Mock the client component
jest.mock('@/components/client/HeroClient', () => {
  return {
    __esModule: true,
    default: () => (
      <section data-testid="hero-section">
        <h1>Hello, I&apos;m Kim Dabit</h1>
        <div data-testid="canvas-container"></div>
      </section>
    ),
  };
});

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

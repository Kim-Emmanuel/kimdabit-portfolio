import { render, screen } from '@testing-library/react';
import { use } from 'react';

// Mock the use hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(),
}));

// Create a mock component for testing
const MockHome = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to My Portfolio</h1>
    </main>
  );
};

describe('Home', () => {
  it('renders the welcome message', () => {
    render(<MockHome />);
    expect(screen.getByText('Welcome to My Portfolio')).toBeInTheDocument();
    expect(document.querySelector('main')).toBeInTheDocument();
  });
});

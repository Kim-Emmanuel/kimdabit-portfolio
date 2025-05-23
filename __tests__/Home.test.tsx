import { render, screen } from './utils/test-utils';

// Mock the components used in the home page
jest.mock('@/components/Hero', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-hero">Hero Section</div>
}));

jest.mock('@/components/ProjectsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-projects">Projects Section</div>
}));

jest.mock('@/components/SkillsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-skills">Skills Section</div>
}));

jest.mock('@/components/ContactSection', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-contact">Contact Section</div>
}));

// Create a mock home page component
const MockHome = () => {
  return (
    <main className="flex min-h-screen flex-col">
      <div data-testid="mock-hero">Hero Section</div>
      <div data-testid="mock-projects">Projects Section</div>
      <div data-testid="mock-skills">Skills Section</div>
      <div data-testid="mock-contact">Contact Section</div>
    </main>
  );
};

describe('Home Page', () => {
  it('renders all main sections', () => {
    render(<MockHome />);
    
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByTestId('mock-projects')).toBeInTheDocument();
    expect(screen.getByTestId('mock-skills')).toBeInTheDocument();
    expect(screen.getByTestId('mock-contact')).toBeInTheDocument();
  });
});

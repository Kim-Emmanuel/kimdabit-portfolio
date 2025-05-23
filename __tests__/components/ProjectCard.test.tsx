import { render, screen } from '../utils/test-utils';
import ProjectCard from '@/components/ProjectCard';

// Mock the client component
jest.mock('@/components/client/ProjectCardClient', () => {
  return {
    __esModule: true,
    default: ({ project }: any) => (
      <div data-testid="project-card">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        {project.techStack.map((tech: any) => (
          <span key={tech.name}>{tech.name}</span>
        ))}
        <a href={project.githubUrl}>GitHub</a>
        <a href={project.demoUrl}>Demo</a>
      </div>
    ),
  };
});

const mockProject = {
  project: {
    title: 'Test Project',
    description: 'A test project description',
    techStack: [
      { name: 'React' },
      { name: 'TypeScript' }
    ],
    image: '/test-image.jpg',
    githubUrl: 'https://github.com/test/project',
    demoUrl: 'https://test-project.com',
    performanceMetrics: {
      loadTime: 1.2,
      lighthouseScore: 98,
      firstContentfulPaint: 0.8
    }
  }
};

describe('ProjectCard Component', () => {
  it('renders project information correctly', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText(mockProject.project.title)).toBeInTheDocument();
    expect(screen.getByText(mockProject.project.description)).toBeInTheDocument();
    mockProject.project.techStack.forEach(tech => {
      expect(screen.getByText(tech.name)).toBeInTheDocument();
    });
  });

  it('renders project links', () => {
    render(<ProjectCard {...mockProject} />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', mockProject.project.githubUrl);
    expect(links[1]).toHaveAttribute('href', mockProject.project.demoUrl);
  });
});

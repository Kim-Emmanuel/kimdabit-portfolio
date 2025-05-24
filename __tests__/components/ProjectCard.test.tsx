import { render, screen } from '../utils/test-utils';
import ProjectCard from '@/components/ProjectCard';

// Mock the client component
interface ProjectCardProps {
  project: {
    title: string
    description: string
    image: {
      _type: string
      asset: {
        _ref: string
        _type: string
      }
    }
    techStack: Array<{ name: string }>
    demoUrl: string
    githubUrl: string
    performanceMetrics: {
      loadTime: number
      lighthouseScore: number
      firstContentfulPaint: number
    }
  }
}

jest.mock('@/components/client/ProjectCardClient', () => {
  return {
    __esModule: true,
    default: ({ project }: ProjectCardProps) => (
      <div data-testid="project-card">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        {project.techStack.map((tech) => (
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
    image: {
      _type: 'image',
      asset: {
        _ref: 'image-test-reference',
        _type: 'reference'
      }
    },
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

  it('renders performance metrics correctly', () => {
    render(<ProjectCard {...mockProject} />);
    
    const { performanceMetrics } = mockProject.project;
    const score = screen.getByText(`${performanceMetrics.lighthouseScore}/100`);
    expect(score).toBeInTheDocument();
  });

  it('handles missing tech stack gracefully', () => {
    const projectWithoutTech = {
      project: {
        ...mockProject.project,
        techStack: []
      }
    };
    
    render(<ProjectCard {...projectWithoutTech} />);
    // Should not throw and render basic project info
    expect(screen.getByText(mockProject.project.title)).toBeInTheDocument();
  });

  it('handles missing links gracefully', () => {
    const projectWithoutLinks = {
      project: {
        ...mockProject.project,
        githubUrl: '',
        demoUrl: ''
      }
    };
    
    render(<ProjectCard {...projectWithoutLinks} />);
    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('renders project with minimal required props', () => {
    const minimalProject = {
      project: {
        title: 'Minimal Project',
        description: 'Basic description',
        techStack: [],
        image: {
          _type: 'image',
          asset: {
            _ref: 'minimal-image-ref',
            _type: 'reference'
          }
        },
        githubUrl: '',
        demoUrl: '',
        performanceMetrics: {
          loadTime: 0,
          lighthouseScore: 0,
          firstContentfulPaint: 0
        }
      }
    };
    
    render(<ProjectCard {...minimalProject} />);
    expect(screen.getByText('Minimal Project')).toBeInTheDocument();
    expect(screen.getByText('Basic description')).toBeInTheDocument();
  });
});

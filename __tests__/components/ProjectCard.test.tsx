import { render, screen } from '../utils/test-utils';
import ProjectCard from '@/components/ProjectCard';

const mockProject = {
  title: 'Test Project',
  description: 'A test project description',
  tags: ['React', 'TypeScript'],
  image: '/test-image.jpg',
  source_code_link: 'https://github.com/test/project',
  live_site_link: 'https://test-project.com',
};

describe('ProjectCard Component', () => {
  it('renders project information correctly', () => {
    render(<ProjectCard {...mockProject} />);
    
    expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    mockProject.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders project links', () => {
    render(<ProjectCard {...mockProject} />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', mockProject.source_code_link);
    expect(links[1]).toHaveAttribute('href', mockProject.live_site_link);
  });
});

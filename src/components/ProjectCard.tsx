import ProjectCardClient from './client/ProjectCardClient'

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

const ProjectCard = ({ project }: ProjectCardProps) => {
  return <ProjectCardClient project={project} />
}

export default ProjectCard

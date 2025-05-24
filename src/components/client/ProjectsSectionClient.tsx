'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../ProjectCard'
import { client } from '@/utils/sanity'

interface Project {
  _id: string
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

const ProjectsSectionClient = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [skills, setSkills] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await client.fetch(`
        *[_type == "project"] {
          _id,
          title,
          description,
          image,
          techStack[]-> {
            name
          },
          demoUrl,
          githubUrl,
          performanceMetrics
        }
      `)
      setProjects(result)
      setFilteredProjects(result)

      // Extract unique skills from all projects
      const skillSet = new Set<string>()
      result.forEach((project: Project) => {
        project.techStack.forEach(tech => {
          skillSet.add(tech.name)
        })
      })
      setSkills(skillSet)
    }

    fetchProjects()
  }, [])

  const handleFilter = (filter: string) => {
    setActiveFilter(filter)
    if (filter === 'all') {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(project =>
        project.techStack.some(tech => tech.name === filter)
      )
      setFilteredProjects(filtered)
    }
  }

  return (
    <section id="projects" className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
        >
          Featured Projects
        </motion.h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilter('all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeFilter === 'all'
                ? 'bg-secondary text-primary'
                : 'bg-primary-light text-secondary'
            }`}
          >
            All
          </motion.button>
          {Array.from(skills).map((skill) => (
            <motion.button
              key={skill}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilter(skill)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeFilter === skill
                  ? 'bg-secondary text-primary'
                  : 'bg-primary-light text-secondary'
              }`}
            >
              {skill}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/60 mt-8"
          >
            No projects found with the selected filter.
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default ProjectsSectionClient

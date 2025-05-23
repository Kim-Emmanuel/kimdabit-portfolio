'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import SkillsRadar from '../SkillsRadar'
import { client } from '@/utils/sanity'
import imageUrlBuilder from '@sanity/image-url'

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
  yearsOfExperience: number
  icon: any
  iconUrl: string
}

// Helper function to get the correct icon URL
const getIconUrl = (skill: Skill) => {
  // If iconUrl exists (from asset reference), use it
  if (skill.iconUrl) {
    return skill.iconUrl
  }
  
  // If icon is a string URL, use it directly
  if (typeof skill.icon === 'string') {
    return skill.icon
  }
  
  // If icon is an asset object, try to build URL
  if (skill.icon && skill.icon.asset) {
    return builder.image(skill.icon).width(24).height(24).url()
  }
  
  return null
}

const SkillsSectionClient = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const controls = useAnimation()

  useEffect(() => {
    const fetchSkills = async () => {
      const result = await client.fetch(`
        *[_type == "skill"] {
          _id,
          name,
          category,
          proficiency,
          yearsOfExperience,
          icon,
          "iconUrl": icon.asset->url
        }
      `)
      setSkills(result)
    }

    fetchSkills()
  }, [])

  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'database', name: 'Database' },
    // { id: 'cloud', name: 'Cloud' },
    // { id: 'devops', name: 'DevOps' },
    // { id: 'testing', name: 'Testing' },
    // { id: 'languages', name: 'Languages' },
    { id: 'frameworks', name: 'Frameworks' },
    // { id: 'libraries', name: 'Libraries' },
    { id: 'tools', name: 'Tools' },
    // { id: 'design', name: 'Design' }
  ]

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const filteredSkills = skills.filter(skill => 
    activeCategory === 'all' || skill.category === activeCategory
  )

  return (
    <section id="skills" className="min-h-screen py-20 bg-primary-light">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels across different domains.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category.id
                  ? 'bg-secondary text-primary'
                  : 'bg-primary-light text-secondary'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square"
          >
            <SkillsRadar skills={filteredSkills.map(skill => ({
              name: skill.name,
              value: skill.proficiency,
              category: skill.category
            }))} />
          </motion.div>

          {/* Skills List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    {/* Render the icon */}
                    {(() => {
                      const iconUrl = getIconUrl(skill)
                      return iconUrl ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <img 
                            src={iconUrl} 
                            alt={`${skill.name} icon`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              console.log(`Failed to load icon for ${skill.name}:`, iconUrl)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : null
                    })()}
                    <h3 className="text-xl font-bold text-secondary">{skill.name}</h3>
                  </div>
                  <span className="text-white/60 text-sm">
                    {skill.yearsOfExperience} years
                  </span>
                </div>
                <div className="h-2 bg-primary-light rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-secondary to-accent"
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-white/60">
                  <span>Proficiency</span>
                  <span>{skill.proficiency}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SkillsSectionClient
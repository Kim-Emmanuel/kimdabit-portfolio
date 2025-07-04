import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import project from './sanity/schemas/project'
import skill from './sanity/schemas/skill'
import testimonial from './sanity/schemas/testimonial'

export default defineConfig({
  name: 'kimdabit',
  title: 'Kim Dabit Portfolio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [project, skill, testimonial],
  },
  basePath: '/studio',
})
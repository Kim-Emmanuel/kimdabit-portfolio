import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'techStack',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'skill' } }],
    }),
    defineField({
      name: 'demoUrl',
      title: 'Demo URL',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'modelUrl',
      title: '3D Model URL',
      type: 'url',
      description: 'URL to a GLTF/GLB 3D model file (optional)',
    }),
    defineField({
      name: 'performanceMetrics',
      title: 'Performance Metrics',
      type: 'object',
      fields: [
        { name: 'loadTime', type: 'number', title: 'Load Time (ms)' },
        { name: 'lighthouseScore', type: 'number', title: 'Lighthouse Score' },
        { name: 'firstContentfulPaint', type: 'number', title: 'First Contentful Paint (ms)' },
      ],
    }),
  ],
})

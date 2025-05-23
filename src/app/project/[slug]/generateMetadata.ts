import type { Metadata } from 'next'
import { client } from '@/utils/sanity'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await client.fetch(`
    *[_type == "project" && slug.current == $slug][0] {
      title,
      description,
      "image": image.asset->url,
      _updatedAt
    }
  `, { slug: params.slug })

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    }
  }

  const ogImage = project.image || '/og-image.jpg'

  return {
    title: `${project.title} | Neuro Nexus Portfolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      publishedTime: project._updatedAt,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [ogImage]
    }
  }
}

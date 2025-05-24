import { createClient, type ClientConfig } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

interface SanityConfig extends ClientConfig {
  projectId: string
  dataset: string
  apiVersion: string
}

interface SanityImageSource {
  _type: string
  asset: {
    _ref: string
    _type: string
  }
  [key: string]: unknown  // Allow for other Sanity image properties
}

// Validate environment variables
const validateConfig = (): SanityConfig => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
    )
  }

  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.warn(
      'Missing NEXT_PUBLIC_SANITY_DATASET, falling back to "production"'
    )
  }

  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-05-18',
    useCdn: true,
  }
}

export const client = createClient(validateConfig())

const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => {
  try {
    if (!source || !source.asset) {
      console.warn('Invalid image source provided to urlFor')
      return {
        url: () => ''
      }
    }
    return builder.image(source)
  } catch (error) {
    console.error('Error generating image URL:', error)
    return {
      url: () => ''
    }
  }
}

export const revalidateOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
}

// Helper function to fetch data with a query
export async function fetchSanityData<T>(query: string, params = {}): Promise<T> {
  try {
    const result = await client.fetch<T>(query, params)
    if (!result) {
      throw new Error('No data returned from Sanity')
    }
    return result
  } catch (error) {
    console.error('Sanity fetch error:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to fetch Sanity data: ${error.message}`
        : 'Failed to fetch Sanity data'
    )
  }
}
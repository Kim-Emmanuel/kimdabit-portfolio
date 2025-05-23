import { client } from '@/utils/sanity'
import TestimonialSectionClient from './client/TestimonialSectionClient'

const getTestimonials = async () => {
  const testimonials = await client.fetch(`*[_type == "testimonial"] {
    name,
    role,
    company,
    image,
    testimonial
  }`)
  return testimonials
}

const TestimonialSection = async () => {
  const testimonials = await getTestimonials()
  return <TestimonialSectionClient testimonials={testimonials} />
}

export default TestimonialSection

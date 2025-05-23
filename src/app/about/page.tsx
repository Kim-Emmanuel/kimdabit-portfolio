import type { Metadata } from 'next'
import AboutSection from '@/components/about/AboutSection'

export const metadata: Metadata = {
  title: 'About Kim Dabit - Full Stack Developer',
  description: 'Learn about Kim Dabit\'s journey in web development, expertise in building performant web applications, and commitment to creating accessible digital experiences.',
}

export default function AboutPage() {
  return (
    <main className="relative">
      <AboutSection />
    </main>
  )
}

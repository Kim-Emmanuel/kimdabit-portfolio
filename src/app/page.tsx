import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Hero = dynamic(() => import('@/components/client/HeroClient'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-secondary">Loading...</div>
    </div>
  )
})

const ProjectsSection = dynamic(() => import('@/components/client/ProjectsSectionClient'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-secondary">Loading Projects...</div>
    </div>
  )
})

const ContactSection = dynamic(() => import('@/components/ContactSection'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-secondary">Loading Contact Form...</div>
    </div>
  )
})

const SkillsSection = dynamic(() => import('@/components/client/SkillsSectionClient'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-secondary">Loading Skills...</div>
    </div>
  )
})

const TestimonialSection = dynamic(() => import('@/components/TestimonialSection'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-secondary">Loading Testimonials...</div>
    </div>
  )
})

export default function Home() {
  return (
    <Suspense>
      <main className="flex min-h-screen flex-col">
        <Hero />
        <SkillsSection />
        <ProjectsSection />
        <TestimonialSection />
        <ContactSection />
      </main>
    </Suspense>
  )
}

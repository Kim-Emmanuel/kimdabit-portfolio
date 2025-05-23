import HeroClient from './client/HeroClient'

const Hero = () => {
  return (
    <section data-testid="hero-section" className="relative h-screen w-full">
      <HeroClient />
    </section>
  )
}

export default Hero

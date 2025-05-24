// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import Image from 'next/image'
// import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
// import TypeIt from 'typeit-react'
// import { useA11y } from '@/context/A11yContext'

// // Register GSAP plugins
// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// // Bio section content
// const sections = [
//   {
//     id: 'intro',
//     content: "I'm a Full Stack Developer specializing in building exceptional digital experiences. With a strong foundation in modern web technologies, I create solutions that combine innovation with usability.",
//     highlight: "15+ successful projects delivered with 90+ Lighthouse scores",
//     animationDelay: 0.2
//   },
//   {
//     id: 'philosophy',
//     content: "I believe in writing clean, maintainable code that scales. As an advocate for web accessibility and performance, every project I undertake adheres to WCAG guidelines while maintaining blazing-fast load times.",
//     highlight: "Core contributor to React accessibility tools",
//     animationDelay: 0.4
//   },
//   {
//     id: 'passion',
//     content: "When I'm not coding, I'm actively involved in the developer community, sharing knowledge through technical articles and speaking at conferences. I'm passionate about mentoring and helping others grow in their development journey.",
//     highlight: "Regular speaker at tech conferences",
//     animationDelay: 0.6
//   }
// ]

// // Tech stack data
// const techStack = [
//   { name: 'React', logo: '/icons/react.svg', color: '#61DAFB' },
//   { name: 'Next.js', logo: '/icons/nextjs.svg', color: '#000000' },
//   { name: 'TypeScript', logo: '/icons/typescript.svg', color: '#007ACC' },
//   { name: 'Node.js', logo: '/icons/nodejs.svg', color: '#339933' },
//   { name: 'GraphQL', logo: '/icons/graphql.svg', color: '#E10098' },
//   { name: 'TailwindCSS', logo: '/icons/tailwind.svg', color: '#06B6D4' },
//   { name: 'GSAP', logo: '/icons/gsap.svg', color: '#88CE02' },
//   { name: 'Three.js', logo: '/icons/threejs.svg', color: '#000000' },
// ]

// // Statistics data
// const stats = [
//   { label: 'Projects Delivered', value: '15+' },
//   { label: 'GitHub Stars', value: '400+' },
//   { label: 'NPM Downloads', value: '5.2k' },
//   { label: 'Conference Talks', value: '8' }
// ]

// export default function AboutSection() {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const bioRef = useRef<HTMLDivElement>(null)
//   const techStackRef = useRef<HTMLDivElement>(null)
//   const philosophyRef = useRef<HTMLDivElement>(null)
//   const mainImageRef = useRef<HTMLDivElement>(null)
//   const secondaryImageRef = useRef<HTMLDivElement>(null)
//   const [isImageLoaded, setIsImageLoaded] = useState(false)
//   const [isSecondaryImageHovered, setIsSecondaryImageHovered] = useState(false)
//   const { isReducedMotion } = useA11y()

//   // Scroll progress animation
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ['start', 'end'],
//   })

//   // Transform values for parallax effects
//   const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
//   const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -100])
//   const bioOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.9, 1], [0, 1, 1, 0])
//   const bioY = useTransform(scrollYProgress, [0.1, 0.25, 0.9, 1], [100, 0, 0, -100])
//   const imageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])
//   const imageY = useTransform(scrollYProgress, [0, 0.3], [0, -50])

//   // GSAP animations
//   useEffect(() => {
//     if (isReducedMotion) return

//     const ctx = gsap.context(() => {
//       // Bio section animations
//       sections.forEach((section) => {
//         const target = document.getElementById(section.id)
//         if (!target) return

//         gsap.from(target, {
//           opacity: 0,
//           y: 50,
//           duration: 1.2,
//           delay: section.animationDelay,
//           scrollTrigger: {
//             trigger: target,
//             start: 'top 80%',
//             end: 'top 20%',
//             scrub: 1,
//           },
//         })
//       })

//       // Tech stack carousel animation
//       if (techStackRef.current) {
//         gsap.from('.tech-item', {
//           x: (i) => i * 100 + 400,
//           opacity: 0,
//           stagger: 0.1,
//           duration: 1.5,
//           ease: 'power3.out',
//           scrollTrigger: {
//             trigger: techStackRef.current,
//             start: 'top 70%',
//             end: 'bottom 20%',
//             scrub: true,
//           },
//         })
//       }

//       // Philosophy typing effect
//       if (philosophyRef.current) {
//         ScrollTrigger.create({
//           trigger: philosophyRef.current,
//           start: 'top 70%',
//           onEnter: () => {
//             const element = document.querySelector('.philosophy-text')
//             if (element) {
//               element.classList.add('typing-active')
//             }
//           },
//         })
//       }

//       // Main image parallax
//       if (mainImageRef.current) {
//         gsap.to(mainImageRef.current, {
//           y: -80,
//           ease: 'none',
//           scrollTrigger: {
//             trigger: mainImageRef.current,
//             start: 'top bottom',
//             end: 'bottom top',
//             scrub: true,
//           },
//         })
//       }

//       // Stats counter animation
//       gsap.from('.stat-item', {
//         y: 30,
//         opacity: 0,
//         stagger: 0.15,
//         duration: 1,
//         scrollTrigger: {
//           trigger: '.stats-container',
//           start: 'top 80%',
//         },
//       })

//     }, containerRef)

//     return () => ctx.revert()
//   }, [isReducedMotion])

//   // Performance optimizations
//   useEffect(() => {
//     // Preload images
//     const preloadImages = () => {
//       const imageUrls = ['/images/kimdabit.jpg', '/images/workspace.jpg']
//       imageUrls.forEach(url => {
//         const img: HTMLImageElement = document.createElement('img')
//         img.src = url
//         img.onload = () => {
//           if (url === '/images/kimdabit.jpg') {
//             setIsImageLoaded(true)
//           }
//         }
//       })
//     }

//     preloadImages()

//     // Add will-change property to animated elements
//     const animatedElements = document.querySelectorAll('.animate-on-scroll')
//     animatedElements.forEach(el => {
//       el.classList.add('will-change-transform')
//     })

//     // Cleanup
//     return () => {
//       animatedElements.forEach(el => {
//         el.classList.remove('will-change-transform')
//       })
//     }
//   }, [])

//   return (
//     <div ref={containerRef} className="relative w-full overflow-hidden">
//       {/* Hero Section with Main Photo */}
//       <section className="relative min-h-[100vh] flex items-center justify-center">
//         <div ref={mainImageRef} className="absolute inset-0 w-full h-full">
//           <div className="relative w-full h-full">
//             {/* LQIP placeholder */}
//             <div className={`absolute inset-0 bg-gray-900 ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} />
            
//             <Image
//               src="/images/kimdabit.jpg"
//               alt="Kim Dabit working at desk"
//               quality={90}
//               priority
//               fill
//               onLoad={() => setIsImageLoaded(true)}
//               style={{ 
//                 transform: `scale(${imageScale.get()}) translateY(${imageY.get()}px)`,
//                 opacity: isImageLoaded ? 1 : 0,
//               }}
//               className="object-cover transition-opacity duration-700 clip-portrait"
//               sizes="(max-width: 768px) 100vw, 70vw"
//             />
//             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-primary" />
//           </div>
//         </div>

//         <motion.div 
//           style={{ opacity: heroOpacity, y: heroY }}
//           className="relative z-10 container mx-auto px-4 text-center"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.5 }}
//             className="max-w-4xl mx-auto"
//           >
//             <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
//               <TypeIt
//                 options={{
//                   strings: ["About Kim Dabit"],
//                   speed: 50,
//                   waitUntilVisible: true,
//                   cursor: true,
//                   cursorChar: "|"
//                 }}
//               />
//             </h1>
//             <div className="h-1 w-24 md:w-32 bg-secondary mx-auto mb-8"></div>
//             <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
//               Building <span className="text-secondary">exceptional</span> digital experiences with a passion for 
//               <span className="text-accent"> performance</span> and <span className="text-secondary">accessibility</span>.
//             </p>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 1.5 }}
//             className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
//           >
//             <div className="flex flex-col items-center cursor-pointer"
//                  onClick={() => {
//                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
//                  }}>
//               <span className="text-white/70 text-sm mb-2">Scroll to discover</span>
//               <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
//                 <motion.div 
//                   className="w-2 h-2 bg-secondary rounded-full"
//                   animate={{ 
//                     y: [0, 12, 0],
//                   }}
//                   transition={{ 
//                     repeat: Infinity,
//                     duration: 1.5,
//                     ease: "easeInOut"
//                   }}
//                 />
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* Bio Sections */}
//       <motion.div 
//         ref={bioRef} 
//         style={{ opacity: bioOpacity, y: bioY }}
//         className="relative py-20 bg-primary content-visibility-auto"
//       >
//         <div className="container mx-auto px-4">
//           {sections.map((section) => (
//             <div
//               key={section.id}
//               id={section.id}
//               className="max-w-4xl mx-auto mb-24 last:mb-0 animate-on-scroll"
//             >
//               <div className="relative">
//                 <p className="text-xl md:text-2xl text-white/90 mb-6">
//                   {section.content}
//                 </p>
//                 <div className="pl-6 border-l-2 border-secondary">
//                   <p className="text-lg text-secondary font-mono">
//                     {section.highlight}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </motion.div>

//       {/* Secondary Image with Shader Effect */}
//       <div className="relative py-20 bg-primary-dark">
//         <div className="container mx-auto px-4">
//           <div className="max-w-5xl mx-auto">
//             <div className="grid md:grid-cols-2 gap-12 items-center">
//               <div>
//                 <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">My Workspace</h2>
//                 <p className="text-lg text-white/80 mb-8">
//                   This is where the magic happens. A thoughtfully designed space that blends functionality with creativity, helping me deliver outstanding results for clients.
//                 </p>
//                 <div className="stats-container grid grid-cols-2 gap-4">
//                   {stats.map((stat, index) => (
//                     <div key={index} className="stat-item p-4 bg-primary rounded-lg border border-secondary/20">
//                       <div className="text-2xl md:text-3xl font-bold text-secondary mb-1">{stat.value}</div>
//                       <div className="text-sm text-white/70">{stat.label}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div ref={secondaryImageRef} className="relative overflow-hidden rounded-lg">
//                 <div 
//                   className="aspect-video w-full relative"
//                   onMouseEnter={() => setIsSecondaryImageHovered(true)}
//                   onMouseLeave={() => setIsSecondaryImageHovered(false)}
//                 >
//                   <Image
//                     src="/images/workspace.jpg"
//                     alt="Kim Dabit's workspace"
//                     fill
//                     className={`object-cover transition-all duration-700 ${
//                       isSecondaryImageHovered ? 'scale-110 filter-none' : 'scale-100 filter-grayscale'
//                     }`}
//                     sizes="(max-width: 768px) 100vw, 600px"
//                   />
//                   <div className={`absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent transition-opacity duration-500 ${
//                     isSecondaryImageHovered ? 'opacity-0' : 'opacity-70'
//                   }`} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tech Stack Carousel */}
//       <div ref={techStackRef} className="relative py-20 bg-primary content-visibility-auto">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
//             Tech Stack
//           </h2>
//           <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
//             {techStack.map((tech, index) => (
//               <div
//                 key={index}
//                 className="tech-item group flex flex-col items-center p-4 bg-primary-light/20 rounded-lg backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-secondary/50"
//                 style={{
//                   willChange: 'transform, opacity',
//                 }}
//               >
//                 <div className="w-16 h-16 mb-3 relative flex items-center justify-center">
//                   <div className="absolute inset-0 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300"></div>
//                   <div className="relative z-10 w-10 h-10">
//                     {/* Placeholder for tech icon - in a real implementation you'd use real SVGs */}
//                     <div className="w-10 h-10 rounded-md bg-gradient-to-r from-secondary/20 to-accent/20 flex items-center justify-center text-lg font-bold text-white">
//                       {tech.name.charAt(0)}
//                     </div>
//                   </div>
//                 </div>
//                 <span className="text-white/90 font-medium text-sm">{tech.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Philosophy Statement */}
//       <div ref={philosophyRef} className="relative py-24 bg-primary-dark content-visibility-auto">
//         <div className="container mx-auto px-4">
//           <div className="max-w-3xl mx-auto text-center">
//             <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">My Philosophy</h2>
//             <div className="philosophy-text opacity-0 transition-opacity duration-1000">
//               <TypeIt
//                 options={{
//                   strings: ["Every line of code should add value. Every interaction should feel intuitive. Every project should push boundaries while respecting fundamentals. This is how I approach development - with precision, creativity, and purpose."],
//                   speed: 30,
//                   waitUntilVisible: true,
//                   startDelay: 500,
//                   cursor: true,
//                   cursorChar: "|",
//                   lifeLike: true
//                 }}
//                 className="text-xl md:text-2xl text-white/90 leading-relaxed"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Call to Action */}
//       <div className="relative py-20 bg-gradient-to-b from-primary to-primary-dark">
//         <div className="container mx-auto px-4 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//           >
//             <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Let's Build Something Amazing</h2>
//             <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
//               Ready to bring your next project to life? I'm excited to collaborate and create something exceptional together.
//             </p>
//             <a 
//               href="#contact" 
//               className="inline-block px-8 py-4 bg-secondary text-primary font-bold rounded-lg shadow-lg hover:bg-secondary-light transition-colors duration-300"
//             >
//               Get in Touch
//             </a>
//           </motion.div>
//         </div>
//       </div>

//       {/* Custom CSS for image clip path */}
//       <style jsx global>{`
//         .clip-portrait {
//           clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
//         }
        
//         .typing-active {
//           opacity: 1 !important;
//         }
        
//         .will-change-transform {
//           will-change: transform, opacity;
//         }
        
//         .content-visibility-auto {
//           content-visibility: auto;
//         }
        
//         .filter-grayscale {
//           filter: grayscale(0.8);
//         }
        
//         @media (prefers-reduced-motion: reduce) {
//           * {
//             animation-duration: 0.01ms !important;
//             transition-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//             scroll-behavior: auto !important;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }
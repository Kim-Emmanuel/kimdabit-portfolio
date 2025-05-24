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
// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
// }

// // Bio section content
// const sections = [
//   {
//     id: 'intro',
//     content: "I'm a Full Stack Developer specializing in building exceptional digital experiences. With a strong foundation in modern web technologies, I create solutions that combine innovation with usability.",
//     highlight: "15+ successful projects delivered with 90+ Lighthouse scores",
//   },
//   {
//     id: 'expertise',
//     content: "My expertise lies in developing performant, scalable web applications with a focus on user experience and accessibility. I'm passionate about clean code, modern frameworks, and continuous learning.",
//     highlight: "React, Next.js, TypeScript, Node.js expert",
//   },
//   {
//     id: 'approach',
//     content: "I approach each project with a commitment to excellence, combining technical expertise with creative problem-solving. My work is characterized by attention to detail and a drive for optimal performance.",
//     highlight: "Data-driven development approach",
//   },
// ]

// const AboutSection = () => {
//   const { reduceMotion } = useA11y()
//   const containerRef = useRef<HTMLDivElement>(null)
//   const bioRef = useRef<HTMLDivElement>(null)
//   const [activeSection, setActiveSection] = useState(0)
//   const { scrollYProgress } = useScroll({
//     target: bioRef,
//     offset: ['start end', 'end start']
//   })

//   const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
//   const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

//   useEffect(() => {
//     if (!containerRef.current || reduceMotion) return

//     const ctx = gsap.context(() => {
//       ScrollTrigger.create({
//         trigger: containerRef.current,
//         start: 'top center',
//         end: 'bottom center',
//         onUpdate: (self) => {
//           const progress = self.progress
//           const newIndex = Math.min(
//             Math.floor(progress * sections.length),
//             sections.length - 1
//           )
//           setActiveSection(newIndex)
//         }
//       })
//     })

//     return () => ctx.revert()
//   }, [reduceMotion])

//   return (
//     <div className="min-h-screen py-20 bg-primary" ref={containerRef}>
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center mb-16"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
//             About Me
//           </h1>
//           <div className="max-w-2xl mx-auto">
//             <TypeIt
//               options={{
//                 strings: ["Building the future of the web, one pixel at a time."],
//                 speed: 50,
//                 waitUntilVisible: true,
//                 cursor: false
//               }}
//               className="text-xl text-white/80"
//             />
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Bio Content */}
//           <div ref={bioRef} className="space-y-8">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={sections[activeSection].id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-primary-light rounded-lg p-6 border border-secondary/10"
//               >
//                 <p className="text-white/90 leading-relaxed mb-4">
//                   {sections[activeSection].content}
//                 </p>
//                 <p className="text-secondary text-sm">
//                   {sections[activeSection].highlight}
//                 </p>
//               </motion.div>
//             </AnimatePresence>

//             {/* Section Navigation */}
//             <div className="flex gap-2">
//               {sections.map((section, index) => (
//                 <button
//                   key={section.id}
//                   onClick={() => {
//                     setActiveSection(index)
//                     if (containerRef.current) {
//                       const progress = index / (sections.length - 1)
//                       const targetScroll =
//                         containerRef.current.offsetTop +
//                         containerRef.current.offsetHeight * progress
//                       gsap.to(window, {
//                         scrollTo: targetScroll,
//                         duration: 1,
//                         ease: 'power2.inOut'
//                       })
//                     }
//                   }}
//                   className={`w-3 h-3 rounded-full transition-colors ${
//                     activeSection === index
//                       ? 'bg-secondary'
//                       : 'bg-secondary/30'
//                   }`}
//                   aria-label={`Navigate to ${section.id} section`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Image Section */}
//           <motion.div
//             style={{ y, opacity }}
//             className="relative aspect-square rounded-lg overflow-hidden"
//           >
//             <Image
//               src="/images/kimdabit.jpg"
//               alt="Kim Dabit"
//               fill
//               className="object-cover filter-grayscale"
//               priority
//             />
//           </motion.div>
//         </div>
//       </div>
      
//       <style jsx global>{`
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

// export default AboutSection

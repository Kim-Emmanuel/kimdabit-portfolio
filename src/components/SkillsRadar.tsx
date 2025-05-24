import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'

interface Skill {
  name: string
  value: number
  category: string
}

interface SkillsRadarProps {
  skills: Skill[]
  width?: number
  height?: number
}

const SkillsRadar = ({ skills, width = 500, height = 500 }: SkillsRadarProps) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !skills.length) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const margin = 50
    const radius = Math.min(width, height) / 2 - margin

    const svg = d3.select<SVGGElement, unknown>(svgRef.current)
      .append<SVGGElement>('g')
      .attr('transform', `translate(${width/2},${height/2})`)

    // Scale for the radar
    const angleScale = d3.scalePoint()
      .domain(skills.map(d => d.name))
      .range([0, 2 * Math.PI])

    const radiusScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius])

    // Draw the circles
    const circles = [20, 40, 60, 80, 100]
    circles.forEach(value => {
      svg.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radiusScale(value))
        .attr('class', 'fill-none stroke-secondary/20')
    })

    // Draw the lines from center to edge
    skills.forEach(skill => {
      const angle = angleScale(skill.name)!
      const line = [
        [0, 0],
        [radius * Math.cos(angle - Math.PI/2), radius * Math.sin(angle - Math.PI/2)]
      ]
      
      svg.append('line')
        .attr('x1', line[0][0])
        .attr('y1', line[0][1])
        .attr('x2', line[1][0])
        .attr('y2', line[1][1])
        .attr('class', 'stroke-secondary/20')
    })

    // Create the radar path
    const line = d3.lineRadial<Skill>()
      .angle(d => angleScale(d.name)!)
      .radius(d => radiusScale(d.value))
      .curve(d3.curveLinearClosed)

    svg.append('path')
      .datum(skills)
      .attr('d', line)
      .attr('class', 'fill-secondary/20 stroke-secondary stroke-2')
      .style('filter', 'drop-shadow(0 0 10px rgba(190, 242, 100, 0.3))')

    // Add dots at data points
    svg.selectAll('circle.dot')
      .data(skills)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => radiusScale(d.value) * Math.cos(angleScale(d.name)! - Math.PI/2))
      .attr('cy', d => radiusScale(d.value) * Math.sin(angleScale(d.name)! - Math.PI/2))
      .attr('r', 4)
      .attr('class', 'fill-accent stroke-none')

    // Add labels
    svg.selectAll('.label')
      .data(skills)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => (radius + 20) * Math.cos(angleScale(d.name)! - Math.PI/2))
      .attr('y', d => (radius + 20) * Math.sin(angleScale(d.name)! - Math.PI/2))
      .attr('dy', '0.35em')
      .attr('text-anchor', d => {
        const angle = angleScale(d.name)! * 180 / Math.PI
        return angle < 180 ? 'start' : 'end'
      })
      .text(d => d.name)
      .attr('class', 'fill-secondary text-sm font-mono')

  }, [skills, width, height])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
      style={{ willChange: 'transform, opacity' }}
    >
      <svg
        ref={svgRef}
        role="img"
        aria-label="Skills radar chart"
        width={width}
        height={height}
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
      />
    </motion.div>
  )
}

export default SkillsRadar

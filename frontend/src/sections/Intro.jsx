import { useEffect, useRef } from 'react'
import BrandMark from '../components/BrandMark'
import profileImage from '../assets/profile.jpg'
import './Intro.css'

function Intro() {
  const canvasRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = heroRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !hero || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: 0, y: 0, active: false }
    let particles = []
    let frameId
    let width = 0
    let height = 0

    const makeParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.44,
      vy: (Math.random() - 0.5) * 0.44,
      radius: 1.2 + Math.random() * 1.6,
    })

    const draw = () => {
      context.clearRect(0, 0, width, height)
      particles.forEach((particle, index) => {
        if (!reducedMotion.matches) {
          particle.x += particle.vx
          particle.y += particle.vy
          if (particle.x < 0 || particle.x > width) particle.vx *= -1
          if (particle.y < 0 || particle.y > height) particle.vy *= -1
        }
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = 'rgba(139, 183, 240, 0.6)'
        context.fill()
        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next]
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
          if (distance >= 145) continue
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(other.x, other.y)
          context.strokeStyle = 'rgba(118, 169, 231, ' + (0.16 * (1 - distance / 145)) + ')'
          context.lineWidth = 1
          context.stroke()
        }
        if (pointer.active) {
          const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y)
          if (distance < 190) {
            context.beginPath()
            context.moveTo(particle.x, particle.y)
            context.lineTo(pointer.x, pointer.y)
            context.strokeStyle = 'rgba(124, 168, 255, ' + (0.56 * (1 - distance / 190)) + ')'
            context.lineWidth = 1.2
            context.stroke()
          }
        }
      })
      if (pointer.active) {
        context.beginPath()
        context.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2)
        context.fillStyle = '#a5c5ff'
        context.fill()
      }
    }

    const animate = () => {
      draw()
      if (!reducedMotion.matches) frameId = window.requestAnimationFrame(animate)
    }
    const resize = () => {
      const bounds = hero.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      particles = Array.from({ length: Math.min(76, Math.max(28, Math.floor(width / 18))) }, makeParticle)
      draw()
    }
    const handlePointerMove = (event) => {
      const bounds = hero.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height
      if (reducedMotion.matches) draw()
    }
    const handlePointerLeave = () => {
      pointer.active = false
      if (reducedMotion.matches) draw()
    }
    const handleMotionChange = () => {
      window.cancelAnimationFrame(frameId)
      animate()
    }

    resize()
    animate()
    const observer = new ResizeObserver(resize)
    observer.observe(hero)
    hero.addEventListener('pointermove', handlePointerMove)
    hero.addEventListener('pointerleave', handlePointerLeave)
    reducedMotion.addEventListener('change', handleMotionChange)
    return () => {
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
      hero.removeEventListener('pointermove', handlePointerMove)
      hero.removeEventListener('pointerleave', handlePointerLeave)
      reducedMotion.removeEventListener('change', handleMotionChange)
    }
  }, [])

  return (
    <section className="intro" id="home" ref={heroRef}>
      <canvas ref={canvasRef} className="intro-canvas" aria-hidden="true" />
      <div className="intro-overlay" aria-hidden="true" />
      <div className="container intro-content">
        <div className="intro-layout">
          <div className="intro-text">
            <p className="intro-eyebrow">Multimodal ML · Model adaptation · Attention</p>
            <h1 className="intro-name">Ankith Reddy <span>Subhanpuram.</span></h1>
            <p className="intro-role">ML researcher <span>at UF IC3 / PRISMAp Lab</span></p>
            <p className="intro-description">
              I study how representations and training choices shape AI systems—from multimodal EHR Transformers
              and language-model adaptation to MoE capability retention and low-resource speech recognition.
              My long-term focus is multimodal foundation models across language, video, and audio.
            </p>
            <div className="intro-buttons">
              <a href="#projects" className="btn btn-primary">Explore my work <span aria-hidden="true">↗</span></a>
              <a href="/RESEARCH_CV.pdf" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Research CV</a>
            </div>
            <p className="intro-attention"><BrandMark /> Attention is earned, not demanded.</p>
          </div>
          <div className="intro-portrait">
            <div className="intro-image-frame">
              <img src={profileImage} alt="Ankith Reddy Subhanpuram" className="intro-image" />
            </div>
            <span className="intro-caption">Ankith Reddy Subhanpuram / ML Researcher</span>
          </div>
        </div>
      </div>
      <div className="intro-bottom" aria-hidden="true"><span>01 / Introduction</span><span>Scroll to explore ↓</span></div>
    </section>
  )
}

export default Intro

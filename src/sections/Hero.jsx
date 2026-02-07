/*
  ================================
  HERO SECTION
  ================================
  
  This is the first thing visitors see - the big intro section!
  
  React Concept #6: PROPS
  
  Props are how you pass data FROM a parent TO a child component.
  Think of props like function arguments.
  
  In this file, we'll also see how to create a reusable 
  background animation component.
*/

import { useEffect, useRef } from 'react'
import './Hero.css'
import profileImage from '../assets/profile.jpg'


// To use your own image:
// 1. Add your image to src/assets/ folder (e.g., profile.jpg)
// 2. Import it: import profileImage from '../assets/profile.jpg'
// 3. Replace the placeholder div with: <img src={profileImage} alt="Ankith Reddy" className="hero-image" />

function Hero() {
  // useRef gives us a reference to a DOM element
  // We'll use this to draw on the canvas
  const canvasRef = useRef(null)

  // Draw the neural network background animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []
    const mouse = { x: 0, y: 0, active: false }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles (nodes in our "neural network")
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = Math.random() * 2 + 1
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.6)'
        ctx.fill()
      }
    }

    // Initialize particles
    const numParticles = Math.min(80, Math.floor(window.innerWidth / 15))
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle())
    }

    // Draw connections between nearby particles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    // Mouse interaction - listen on window so it works even over other elements
    const handleMouseMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      drawConnections()

      // Mouse interaction - draw lines from cursor to nearby particles
      if (mouse.active) {
        // Draw a subtle glow at cursor position
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(123, 92, 255, 0.8)'
        ctx.fill()

        particles.forEach(particle => {
          const dx = particle.x - mouse.x
          const dy = particle.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(123, 92, 255, ${0.6 * (1 - distance / 200)})`
            ctx.lineWidth = 1.5
            ctx.stroke()

            // Make nearby particles glow bigger
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.radius + 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(123, 92, 255, ${0.4 * (1 - distance / 200)})`
            ctx.fill()
          }
        })
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section className="hero" id="home">
      {/* Neural network background */}
      <canvas ref={canvasRef} className="hero-canvas" />
      
      {/* Gradient overlay */}
      <div className="hero-overlay" />

      <div className="container hero-content">
        <div className="hero-layout">
          {/* Left side - Text content */}
          <div className="hero-text">
            {/* Greeting */}
            <p className="hero-greeting animate-fade-in-up">
              <span className="greeting-wave">👋</span> Hello, I'm
            </p>

            {/* Name */}
            <h1 className="hero-name animate-fade-in-up delay-1">
              Ankith Reddy
              <span className="hero-name-line">Subhanpuram</span>
            </h1>

            {/* Title with typing effect style */}
            <div className="hero-title-wrapper animate-fade-in-up delay-2">
              <h2 className="hero-title">
                AI & ML <span className="gradient-text">Researcher</span> @ University of Florida
              </h2>
            </div>

            {/* Description */}
            <p className="hero-description animate-fade-in-up delay-3">
              Master's student in AI Systems building intelligent healthcare solutions. 
              Specializing in LLMs, RAG systems, and clinical AI at the Biomedical AI Collaborative.
            </p>

            {/* CTA Buttons */}
            <div className="hero-buttons animate-fade-in-up delay-4">
              <a href="#projects" className="btn btn-primary">
                <span>View My Work</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#contact" className="btn btn-outline">
                <span>Get In Touch</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="hero-socials animate-fade-in-up delay-5">
              <a href="https://github.com/ankithreddys" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/ankithreddys/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="mailto:ankithreddy653@gmail.com" className="social-link" aria-label="Email">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right side - Profile Image */}
          <div className="hero-image-wrapper animate-fade-in delay-2">
            {/* 
              PLACEHOLDER IMAGE
              
              To add your real photo:
              1. Add your image to: src/assets/profile.jpg (or .png)
              2. At the top of this file, add: import profileImage from '../assets/profile.jpg'
              3. Replace the div below with:
                 <img src={profileImage} alt="Ankith Reddy Subhanpuram" className="hero-image" />
            */}
            <div className="hero-image-placeholder">
              <img
                src={profileImage}
                alt="Ankith Reddy Subhanpuram"
                className="hero-image"
              />
              <div className="placeholder-ring"></div>
              <div className="placeholder-ring ring-2"></div>
            </div>
            
          </div>
        </div>
      </div>

    </section>
  )
}

export default Hero

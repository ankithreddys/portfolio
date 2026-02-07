/*
  ================================
  NAVBAR COMPONENT
  ================================
  
  React Concept #2: COMPONENTS
  
  A component is a reusable piece of UI. Think of it like a LEGO brick.
  
  This file defines a Navbar component that we can use anywhere by writing:
  <Navbar />
  
  Components are just JavaScript functions that return JSX (HTML-like syntax).
  
  Notice how we:
  1. Import React hooks (useState, useEffect)
  2. Define the component function
  3. Return JSX (the HTML-like stuff)
  4. Export it so other files can use it
*/

import { useState, useEffect } from 'react'
import './Navbar.css'

function Navbar() {
  // React Concept #3: STATE with useState
  // 
  // State is data that can CHANGE over time.
  // When state changes, React automatically re-renders the component!
  //
  // useState returns an array with 2 things:
  // 1. The current value (isScrolled)
  // 2. A function to update it (setIsScrolled)
  //
  // false is the initial value
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // React Concept #4: EFFECTS with useEffect
  //
  // useEffect runs code AFTER the component renders.
  // Perfect for things like:
  // - Fetching data
  // - Setting up event listeners
  // - Timers
  //
  // The [] at the end means "run this once when component mounts"
  useEffect(() => {
    const handleScroll = () => {
      // If scrolled more than 50px, set isScrolled to true
      setIsScrolled(window.scrollY > 50)
    }

    // Add the scroll listener
    window.addEventListener('scroll', handleScroll)

    // Cleanup: Remove listener when component unmounts
    // This prevents memory leaks!
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation links - we'll map over this array to create the nav items
  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Resume', href: '/resume.pdf' },
  ]

  return (
    // JSX looks like HTML but it's actually JavaScript!
    // 
    // Notice: 
    // - className instead of class (class is reserved in JS)
    // - {isScrolled ? 'scrolled' : ''} - this is a ternary operator
    //   It adds 'scrolled' class when isScrolled is true
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo" aria-label="Ankith Reddy Subhanpuram">
          <span className="logo-sigma">Σ</span>
          <span className="logo-attn">
            <span className="logo-letter">A</span>
            <span className="logo-dot" aria-hidden="true">·</span>
            <span className="logo-letter">R</span>
            <sup className="logo-sup">S</sup>
          </span>
        </a>

        {/* Desktop Navigation */}
        <ul className="navbar-links">
          {/* React Concept #5: MAPPING ARRAYS
              
              .map() transforms each item in an array into JSX
              
              The 'key' prop is REQUIRED when rendering lists.
              React uses it to track which items changed.
          */}
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="nav-link">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Resume Button */}
        <a href="/blogs" className="btn btn-primary navbar-cta">
          Blogs
        </a>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            className="mobile-nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  )
}

// Export the component so other files can import it
export default Navbar

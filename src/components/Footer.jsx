/*
  ================================
  FOOTER COMPONENT
  ================================
*/

import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-left">
          <a href="#" className="footer-logo" aria-label="Ankith Reddy Subhanpuram">
            <span className="logo-sigma">Σ</span>
            <span className="logo-attn">
              <span className="logo-letter">A</span>
              <span className="logo-dot" aria-hidden="true">·</span>
              <span className="logo-letter">R</span>
              <sup className="logo-sup">S</sup>
            </span>
          </a>
          <p className="footer-tagline">
            Building intelligent systems that matter.
          </p>
        </div>

        <div className="footer-center">
          <nav className="footer-nav">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>

        <div className="footer-right">
          <p className="footer-copyright">
            © {currentYear} Ankith Reddy Subhanpuram
          </p>
          <p className="footer-built">
            Built with <span className="heart">❤️</span> and React
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

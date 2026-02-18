/*
  ================================
  HOME PAGE
  ================================
*/

import Hero from '../sections/Hero'
import About from '../sections/About'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'
import Leadership from '../sections/Leadership'
import Contact from '../sections/Contact'

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Leadership />
      <Contact />
    </main>
  )
}

export default Home

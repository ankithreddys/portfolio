/*
  ================================
  HOME PAGE
  ================================
*/

import Intro from '../sections/Intro'
import About from '../sections/About'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'
import Leadership from '../sections/Leadership'
import Contact from '../sections/Contact'

function Home() {
  return (
    <main>
      <Intro />
      <About />
      <Projects />
      <Skills />
      <Leadership />
      <Contact />
    </main>
  )
}

export default Home

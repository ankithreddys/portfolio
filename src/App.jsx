/*
  ================================
  APP.JSX - THE MAIN COMPONENT
  ================================
  
  React Concept Summary:
  
  This is the ROOT component of your React app. Everything flows from here!
  
  Think of it like the main() function in Python or C.
  
  The component tree looks like this:
  
  App
  ├── Navbar
  ├── Hero
  ├── About
  ├── Projects
  ├── Skills
  ├── Contact
  └── Footer
  
  Each of these is a separate, reusable component we built!
*/

// Import global styles (applies to whole app)
import './index.css'

// Import our components
// Notice the file paths - this is how we organize our code
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Import section components
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import ChatWidget from './components/Chat/ChatWidget'

function App() {
  return (
    // React Concept: Fragments
    // The <> </> is called a Fragment - it lets us return multiple
    // elements without adding extra divs to the DOM
    <>
      {/* Navigation - fixed at top */}
      <Navbar />

      {/* Main content wrapper */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
      </Routes>

      {/* Footer */}
      <Footer />
      <ChatWidget />
    </>
  )
}

// Export so main.jsx can import and render it
export default App

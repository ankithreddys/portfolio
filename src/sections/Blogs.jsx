/*
  ================================
  BLOGS SECTION
  ================================
  
  Placeholder section for future blog posts.
*/

import './Blogs.css'

function Blogs() {
  return (
    <section className="blogs section" id="blogs">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// Writing</span>
          <h2 className="section-title">
            Future <span className="gradient-text">Blogs</span>
          </h2>
          <p className="section-subtitle">
            I am building a space to share research notes, experiments, and technical write-ups.
          </p>
        </div>

        <div className="blogs-placeholder">
          <div className="blogs-card">
            <h3>Coming soon</h3>
            <p>
              No posts yet. Check back later for deep dives into clinical AI, LLMs, and
              applied ML engineering.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Blogs

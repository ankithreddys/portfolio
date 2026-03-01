/*
  ================================
  BLOGS SECTION
  ================================
*/

import './Blogs.css'

function Blogs() {
  return (
    <section className="blogs section" id="blogs">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">// Writing</span>
          <h2 className="section-title">
            Latest <span className="gradient-text">Blogs</span>
          </h2>
          <p className="section-subtitle">
            Research notes, practical experiments, and engineering playbooks from real AI builds.
          </p>
        </div>

        <div className="blogs-list" aria-label="Blogs list">
          <article className="blogs-card">
            <header className="blog-post-header">
              <p className="blog-post-meta">New content soon</p>
              <h3 className="blog-post-title">More posts are on the way</h3>
              <p className="blog-post-excerpt">
                I am currently preparing new writeups on practical AI engineering, LLM systems,
                and applied research workflows.
              </p>
            </header>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Blogs

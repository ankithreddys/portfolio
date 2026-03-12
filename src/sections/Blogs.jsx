/*
  ================================
  BLOGS SECTION
  ================================
*/

import './Blogs.css'

function Blogs() {
  const bpeMediumUrl = 'https://medium.com/@ankithreddy653/how-machines-learn-to-read-byte-pair-encoding-explained-ba4bd39c60ee'
  const bpeVisualizerUrl = '/bpe-visualizer.html'
  const wordsToTensorMediumUrl = 'https://medium.com/@ankithreddy653/from-words-to-tensors-how-llms-actually-read-text-7048eef833ae'
  const wordsToTensorVisualizerUrl = '/word-to-tensor.html'

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
              <p className="blog-post-meta">March 2026 · 20 min read</p>
              <h3 className="blog-post-title">Byte Pair Encoding (BPE): How Tokenization Works Under the Hood</h3>
              <p className="blog-post-excerpt">
                A practical walkthrough of BPE from scratch: word frequencies, pair merges, vocab
                growth, and why subword tokenization is critical for modern LLM pipelines.
              </p>
              <div className="blog-post-tags" aria-label="Post tags">
                <span className="blog-tag">NLP</span>
                <span className="blog-tag">Tokenization</span>
                <span className="blog-tag">BPE</span>
              </div>
            </header>

            <div className="blog-actions">
              <a
                href={bpeMediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-action-link"
                aria-label="Open BPE blog post on Medium"
              >
                Read on Medium
              </a>
              <a
                href={bpeVisualizerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-action-link blog-action-link-secondary"
                aria-label="Open BPE visualizer demo"
              >
                Open Visualizer
              </a>
            </div>
          </article>

          <article className="blogs-card">
            <header className="blog-post-header">
              <p className="blog-post-meta">March 2026 · 18 min read</p>
              <h3 className="blog-post-title">From Words to Tensors: How LLMs Actually Read Text</h3>
              <p className="blog-post-excerpt">
                A hands-on walkthrough of tokenization, BPE, sliding-window dataset creation, token
                embeddings, and positional embeddings, from raw text all the way to transformer-ready tensors.
              </p>
              <div className="blog-post-tags" aria-label="Post tags">
                <span className="blog-tag">LLM</span>
                <span className="blog-tag">Embeddings</span>
                <span className="blog-tag">PyTorch</span>
              </div>
            </header>

            <div className="blog-actions">
              <a
                href={wordsToTensorMediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-action-link"
                aria-label="Open From Words to Tensors blog post on Medium"
              >
                Read on Medium
              </a>
              <a
                href={wordsToTensorVisualizerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-action-link blog-action-link-secondary"
                aria-label="Open word to tensor interactive demo"
              >
                Open Interactive Demo
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Blogs

/*
  ================================
  SKILLS SECTION
  ================================
  
  React Concept #9: Component Organization
  
  Notice how we keep data (skillCategories) separate from presentation.
  This makes the component easier to maintain and update!
*/

import './Skills.css'

function Skills() {
  const skillCategories = [
    {
      title: 'Languages',
      icon: '💻',
      skills: ['Python', 'C', 'SQL', 'Linux', 'Bash']
    },
    {
      title: 'ML/DL Frameworks',
      icon: '🧠',
      skills: ['PyTorch', 'TensorFlow', 'Keras', 'scikit-learn', 'HuggingFace', 'JAX']
    },
    {
      title: 'LLMs & NLP',
      icon: '📝',
      skills: ['LLM Fine-tuning', 'RAG Systems', 'LangChain', 'LangGraph', 'NLTK', 'spaCy', 'Transformers']
    },
    {
      title: 'Data & Analytics',
      icon: '📊',
      skills: ['Pandas', 'NumPy', 'FAISS', 'Librosa', 'Jupyter', 'Data Visualization']
    },
    {
      title: 'MLOps & Infrastructure',
      icon: '☁️',
      skills: ['MLflow', 'Docker', 'Git', 'Apache Airflow', 'NVIDIA DGX', 'DDP', 'FSDP']
    },
    {
      title: 'Specialized Domains',
      icon: '🔬',
      skills: ['Speech Recognition', 'Audio Processing', 'Computer Vision', 'Clinical AI', 'Web Scraping']
    }
  ]

  return (
    <section className="skills section" id="skills">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">// Tech Stack</span>
          <h2 className="section-title">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="section-subtitle">
            The tools and technologies I use to build intelligent systems.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div 
              key={category.title} 
              className="skill-category"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3 className="category-title">{category.title}</h3>
              </div>
              <div className="skill-pills">
                {category.skills.map(skill => (
                  <span key={skill} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Fun fact / tagline */}
        <div className="skills-tagline">
          <p>
            <span className="tagline-icon">⚡</span>
            Currently exploring{' '}
            <strong>multimodal clinical AI</strong> and{' '}
            <strong>efficient LLM architectures</strong> at UF.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Skills

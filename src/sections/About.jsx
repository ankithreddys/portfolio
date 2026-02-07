/*
  ================================
  ABOUT SECTION
  ================================
  
  React Concept #7: Conditional Rendering
  
  In React, you can show/hide elements based on conditions.
  This is useful for tabs, accordions, and more!
*/

import './About.css'

function About() {
  // Data for the "cards" - keeps our JSX clean
  const highlights = [
    {
      icon: '🧠',
      title: 'LLMs & NLP',
      description: 'Fine-tuning large language models, RAG systems, and clinical AI applications'
    },
    {
      icon: '🔬',
      title: 'Research',
      description: 'Building synthetic EHR datasets and LLM evaluation frameworks at UF'
    },
    {
      icon: '🎤',
      title: 'Speech & Audio',
      description: 'ASR models, wav2vec2, multilingual speech recognition systems'
    },
    {
      icon: '⚡',
      title: 'MLOps',
      description: 'Distributed training on DGX systems, MLflow, Docker, and scalable pipelines'
    }
  ]

  const experience = [
    {
      role: 'Research Assistant',
      company: 'University of Florida - Biomedical AI Collaborative',
      period: 'Aug 2025 - Present',
      type: 'Research'
    },
    {
      role: 'AI Engineer Intern',
      company: 'Scholarship Auditions',
      period: 'May 2025 - Aug 2025',
      type: 'Industry'
    },
    {
      role: 'AI Research Intern',
      company: 'DRDO - CAIR',
      period: 'Oct 2023 - Mar 2024',
      type: 'Research'
    }
  ]

  return (
    <section className="about section" id="about">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">// About Me</span>
          <h2 className="section-title">
            Turning <span className="gradient-text">Data</span> into Intelligence
          </h2>
        </div>

        <div className="about-grid">
          {/* Left Column - Text */}
          <div className="about-text">
            <p className="about-intro">
              I'm a <strong>Master's student in AI Systems</strong> at the University of Florida, 
              working as a Research Assistant at the Intelligent Clinical Care Center (IC3).
            </p>
            
            <p>
              My research focuses on engineering synthetic clinical datasets with frontier models, 
              fine-tuning open-source LLMs on NVIDIA DGX systems, and building evaluation frameworks 
              for clinical AI. I've worked on everything from speech recognition at DRDO to 
              RAG-based chatbots and computer vision systems.
            </p>

            <p>
              Previously, I interned at Scholarship Auditions where I built RAG pipelines and 
              deep learning models for music education. At DRDO's Centre for AI and Robotics, 
              I engineered ASR models achieving 8.3 WER for low-resource languages.
            </p>

            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">3.83</span>
                <span className="stat-label">GPA at UF</span>
              </div>
              <div className="stat">
                <span className="stat-number">3+</span>
                <span className="stat-label">Research Projects</span>
              </div>
            </div>
          </div>

          {/* Right Column - Cards */}
          <div className="about-cards">
            {highlights.map((item, index) => (
              <div 
                key={item.title} 
                className="highlight-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="highlight-icon">{item.icon}</span>
                <div>
                  <h3 className="highlight-title">{item.title}</h3>
                  <p className="highlight-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="experience-section">
          <h3 className="experience-title">Experience</h3>
          <div className="experience-grid">
            {experience.map((exp, index) => (
              <div key={index} className="experience-card">
                <span className="experience-type">{exp.type}</span>
                <h4 className="experience-role">{exp.role}</h4>
                <p className="experience-company">{exp.company}</p>
                <p className="experience-period">{exp.period}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="education-section">
          <div className="education-card">
            <div className="education-icon">🎓</div>
            <div className="education-content">
              <h4>University of Florida</h4>
              <p className="education-degree">M.S. in Artificial Intelligence Systems</p>
              <p className="education-details">Aug 2024 - May 2026 • GPA: 3.83/4.00</p>
            </div>
          </div>
          <div className="education-card">
            <div className="education-icon">🎓</div>
            <div className="education-content">
              <h4>Vignana Bharathi Institute of Technology</h4>
              <p className="education-degree">B.Tech in Computer Science (AI & ML)</p>
              <p className="education-details">May 2020 - May 2024 • GPA: 8.76/10.0</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

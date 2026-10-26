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
      title: 'Multimodal EHR models',
      description: 'Collaborative work on typed EHR representations, long-history compression, and note fusion in MySurgeryRisk.'
    },
    {
      icon: '☁️',
      title: 'Language-model adaptation',
      description: 'Built 97,000+ accepted instruction examples from clinician-designed frameworks and fine-tuned three model families for PRISMA-ICU.'
    },
    {
      icon: '🔬',
      title: 'MoE capability retention',
      description: 'Independently designed shared/router/expert training comparisons across domain and general instruction data.'
    },
    {
      icon: '⚡',
      title: 'Low-resource speech',
      description: 'Fine-tuned pretrained wav2vec 2.0 for Bengali ASR and compared character-level with BPE output vocabularies.'
    }
  ]

  const experience = [
    {
      role: 'ML Researcher',
      company: 'University of Florida - IC3 / PRISMAp Lab',
      period: 'Aug 2025 - Present',
      type: 'Research'
    },
    {
      role: 'AI Engineer Co-op',
      company: 'University of Florida - IPPD | Oelrich Construction',
      period: 'Aug 2025 - May 2026',
      type: 'Industry'
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
          <span className="section-tag">About Me</span>
          <h2 className="section-title">
            Turning <span className="gradient-text">Data</span> into Intelligence
          </h2>
        </div>

        <div className="about-grid">
          {/* Left Column - Text */}
          <div className="about-text">
            <p className="about-intro">
              I'm an <strong>ML Researcher</strong> at the University of Florida's Intelligent Clinical Care Center (IC3) and PRISMAp Lab. I joined as a research assistant in August 2025 and have worked full-time as a researcher since May 2026. I earned an M.S. in Artificial Intelligence Systems from UF.
            </p>
            
            <p>
              My research spans collaborative work on a multimodal EHR Transformer for surgical-risk prediction and PRISMA-ICU, a conversational LLM adaptation effort. I independently designed a controlled MoE fine-tuning study to examine how updating shared, router, and expert weights relates to capability retention. Earlier, I fine-tuned wav2vec 2.0 for low-resource Bengali speech recognition at DRDO CAIR.
            </p>

            <p>
              For doctoral research, I want to investigate architectures and training strategies for multimodal foundation models across language, video, and audio. Alongside research, I have built permissions-aware RAG systems for construction documents and conversational AI for a scholarship platform.
            </p>

            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">3.90</span>
                <span className="stat-label">GPA at UF</span>
              </div>
              <div className="stat">
                <span className="stat-number">4</span>
                <span className="stat-label">Research efforts</span>
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
              <p className="education-details">Aug 2024 - May 2026 • GPA: 3.90/4.00</p>
            </div>
          </div>
          <div className="education-card">
            <div className="education-icon">🎓</div>
            <div className="education-content">
              <h4>Vignana Bharathi Institute of Technology</h4>
              <p className="education-degree">B.Tech in Computer Science (AI & ML)</p>
              <p className="education-details">Aug 2020 - May 2024 • CGPA: 8.76/10.0</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

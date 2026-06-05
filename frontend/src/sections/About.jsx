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
      title: 'LLMs & Fine-tuning',
      description: 'Fine-tuning 120B+ models with Axolotl/LoRA on NVIDIA B200 clusters, LLM-as-Judge evaluation with DeepEval'
    },
    {
      icon: '☁️',
      title: 'Enterprise RAG',
      description: 'Production RAG on AWS (ECS, Bedrock, OpenSearch) and Azure (Cosmos DB, DiskANN, RBAC-scoped retrieval)'
    },
    {
      icon: '🔬',
      title: 'Clinical & Research AI',
      description: 'Synthetic EHR generation, Transformer/Mamba/MoE modeling on ICU data, pathology report extraction'
    },
    {
      icon: '⚡',
      title: 'MLOps & HPC',
      description: 'FSDP2 distributed training on DGX/HiPerGator, Docker, Airflow, MLflow, Terraform'
    }
  ]

  const experience = [
    {
      role: 'AI Researcher',
      company: 'University of Florida - IC3 / PRISMAp',
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
              I'm an <strong>AI Researcher and ML Engineer</strong> at the University of Florida's Intelligent Clinical Care Center (IC3). I recently graduated with my M.S. in AI Systems from UF, where I also completed an enterprise AI Co-op architecting Azure-native RAG systems.
            </p>
            
            <p>
              At IC3, my research focuses on fine-tuning 120B+ clinical LLMs on NVIDIA B200 clusters, evaluating synthetic EHR datasets with LLM-as-Judge frameworks, and modeling temporal ICU trajectories using Transformer, Mamba, and Mixture-of-Experts (MoE) architectures. On the engineering side, I have architected production-grade, permissions-aware RAG pipelines on Azure and AWS.
            </p>

            <p>
              My background bridges the gap between deep learning research and robust system implementation. Before UF, I designed a Conformer-Wav2Vec2 ASR speech model at DRDO (CAIR), achieving a low 8.3% WER on low-resource languages, and engineered containerized search-and-retrieval systems at Scholarship Auditions.
            </p>

            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">3.89</span>
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
              <p className="education-details">Aug 2024 - May 2026 • GPA: 3.89/4.00</p>
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

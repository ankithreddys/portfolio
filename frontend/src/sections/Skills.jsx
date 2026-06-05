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
      skills: ['Python', 'SQL']
    },
    {
      title: 'AI / ML',
      icon: '🧠',
      skills: ['LLM Fine-tuning (LoRA, QLoRA, PEFT)', 'RAG Systems', 'Hybrid Retrieval (BM25 + Dense)', 'Reranking', 'Prompt Engineering (CoT, Few-Shot)', 'Conformer', 'Mamba (SSM)', 'Mixture-of-Experts (MoE)', 'Computer Vision', 'Speech Recognition', 'CTC']
    },
    {
      title: 'Frameworks & Libraries',
      icon: '📦',
      skills: ['PyTorch', 'TensorFlow', 'HuggingFace Transformers', 'LangChain', 'LangGraph', 'FastAPI', 'Gradio', 'scikit-learn', 'Axolotl', 'DeepEval', 'FAISS', 'DiskANN', 'Pandas', 'NumPy', 'Librosa', 'NLTK', 'spaCy']
    },
    {
      title: 'AWS',
      icon: '☁️',
      skills: ['ECS / Fargate', 'ECR', 'ElastiCache (Redis)', 'OpenSearch Service', 'Bedrock', 'Secrets Manager', 'CloudWatch', 'ALB', 'WAF', 'VPC', 'IAM']
    },
    {
      title: 'Azure',
      icon: '🔷',
      skills: ['Azure OpenAI', 'Azure AD', 'Microsoft Graph API', 'Cosmos DB', 'Key Vault', 'Container Apps Jobs', 'App Services', 'Azure File Share']
    },
    {
      title: 'MLOps & HPC',
      icon: '⚡',
      skills: ['MLflow', 'FSDP2', 'DDP', 'NVIDIA DGX / B200', 'HiPerGator', 'Apache Airflow', 'Docker', 'Terraform', 'Git']
    },
    {
      title: 'Data & Web',
      icon: '📊',
      skills: ['HDF5', 'Data Analytics', 'Web Scraping', 'Scrapy', 'Selenium']
    }
  ]

  return (
    <section className="skills section" id="skills">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Tech Stack</span>
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
            Currently fine-tuning{' '}
            <strong>clinical LLMs on NVIDIA B200 clusters</strong> and building{' '}
            <strong>enterprise RAG on AWS & Azure</strong> at UF.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Skills

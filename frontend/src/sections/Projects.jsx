/*
  ================================
  PROJECTS SECTION
  ================================
  
  React Concept #8: Reusable Components with Props
  
  We'll create a ProjectCard component that we can reuse
  for each project. We pass different data via props!
*/

import './Projects.css'

// ProjectCard is a CHILD component
// It receives props from the parent (Projects)
function ProjectCard({ project, index }) {
  return (
    <article className="project-card">
      <div className="project-image">
        <span className="project-index">{String(index + 1).padStart(2, '0')} / Selected work</span>
        <span className="project-domain">{project.tags[0]}</span>
      </div>

      {/* Project Content */}
      <div className="project-content">
        {/* Tags */}
        <div className="project-tags">
          {project.tags.map(tag => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>

        {/* Title & Description */}
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        {/* Links */}
        <div className="project-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Code</span>
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link project-link-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function Projects() {
  // Research and applied projects shown in the same card layout.
  const projects = [
    {
      title: 'MySurgeryRisk — Multimodal Perioperative Risk',
      description: 'Collaborated on a roughly 1.7M-parameter multitask Transformer for preoperative, end-of-surgery, and daily postoperative risk prediction. Contributed to typed variable–value–time tokens, six-hour postoperative summaries, 4,096-token history handling, and cross-attention from task tokens to frozen clinical-note embeddings. Participated in implementation and training; manuscript complete, preprint in preparation.',
      tags: ['Multimodal EHR', 'Transformer', 'Time series', 'Cross-attention'],
      emoji: '🏥',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'PRISMA-ICU — Conversational LLM Adaptation',
      description: 'Built more than 97,000 accepted question–answer examples from clinician-designed question frameworks using natural-language rewriting, synthetic answers, and a three-judge quality workflow. Fine-tuned Llama 3.3 70B, gpt-oss 20B, and Gemma 4 31B, then compared outputs with a separate judging framework. Clinical evaluation of base versus tuned Gemma is ongoing.',
      tags: ['Instruction data', 'SFT', 'LLM evaluation', 'ICU'],
      emoji: '🧬',
      gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
    },
    {
      title: 'MoE Fine-Tuning — Capability Retention',
      description: 'Independently designed a controlled study of shared, router, and expert weight updates across all eight train/freeze combinations and two instruction-data regimes. Training and generation for 14 runs and 112 checkpoints are complete; evaluation of reasoning, safety, instruction following, and tool-calling trajectories is ongoing. No causal conclusion is claimed yet.',
      tags: ['Mixture-of-Experts', 'Ablations', 'Capability retention', 'Evaluation']
    },
    {
      title: 'Pathology Report Analysis',
      description: 'Developing advanced prompting techniques — chain-of-thought, few-shot, and structured extraction — with frontier LLMs for automated analysis and structured information extraction from unstructured pathology reports.',
      tags: ['Prompt Engineering', 'CoT', 'Few-Shot', 'Clinical NLP'],
      emoji: '🔬',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
    },
    {
      title: 'Enterprise RBAC RAG System (Azure)',
      description: 'Permissions-aware RAG pipeline enforcing document-level RBAC via Azure AD + Microsoft Graph API. Hybrid retrieval fusing BM25 with DiskANN-indexed dense search and cross-encoder reranking, persisted in Cosmos DB. Deployed on Azure Container Apps with nightly ingestion jobs.',
      tags: ['Azure', 'LangGraph', 'DiskANN', 'Cosmos DB', 'RBAC'],
      emoji: '🔐',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Production RAG Chatbot (AWS)',
      description: 'Shipped a production RAG chatbot on AWS ECS/Fargate with Amazon Bedrock for LLM inference and OpenSearch as vector store across 20K+ documents. Hybrid retrieval + cross-encoder reranking improved relevance 25% and cut latency 35%. Session memory via ElastiCache Redis with distributed rate limiting.',
      tags: ['AWS', 'Bedrock', 'OpenSearch', 'FastAPI', 'LangGraph'],
      emoji: '💬',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      title: 'MSAIS Program Assistant',
      description: 'Conversational AI assistant for UF\'s MSAIS program using RAG with LangChain, FAISS, and HuggingFace. Deployed on HuggingFace Spaces with Gradio, powered by Llama-3.3-70B.',
      tags: ['RAG', 'LangChain', 'FAISS', 'Gradio'],
      emoji: '🎓',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      github: 'https://github.com/ankithreddys',
      demo: 'https://huggingface.co/spaces/arsubhanpuram/MSAIS_ASSISTANT'
    },
    {
      title: 'OrchestrAI',
      description: 'Stateful multi-agent orchestration framework (LangGraph, LangChain) coordinating 7 specialized LLM agents via DAG-based conditional routing. Built autonomous email/calendar execution with OAuth 2.0, fuzzy contact resolution, and LangSmith distributed tracing.',
      tags: ['LangGraph', 'LangSmith', 'Agents', 'OAuth 2.0'],
      emoji: '🤖',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      github: 'https://github.com/ankithreddys/OrchestrAI'
    },
    {
      title: 'Low-Resource Bengali ASR (DRDO CAIR)',
      description: 'Surveyed speech-recognition models and fine-tuned a pretrained wav2vec 2.0 encoder for Bengali audio and transcripts. Compared character-level and BPE output vocabularies; BPE performed better in the tested setup. The underlying speech corpus is non-public.',
      tags: ['wav2vec 2.0', 'Bengali ASR', 'BPE', 'Speech recognition'],
      emoji: '🎤',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      github: 'https://github.com/ankithreddys/wav2_vec2_low_resource'
    },
    {
      title: 'Virtual Surya Namaskar Coach',
      description: 'Real-time yoga posture analysis using OpenCV, TensorFlow, and MediaPipe for full-body landmark tracking and joint-angle extraction. Classifies 12 poses with sub-100ms inference; pose-correction pipeline detects per-joint deviations in real time.',
      tags: ['MediaPipe', 'TensorFlow', 'OpenCV', 'Pose Estimation'],
      emoji: '🧘',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      github: 'https://github.com/ankithreddys/Suryanamaskar'
    }
  ]

  return (
    <section className="projects section" id="projects">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">My Work</span>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Research in multimodal learning, language-model adaptation, MoE evaluation, and speech—alongside applied AI systems.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* More Projects Link */}
        <div className="projects-more">
          <a href="https://github.com/ankithreddys" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>View All on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects

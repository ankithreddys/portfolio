import './Leadership.css'

function Leadership() {
  const experiences = [
    {
      organization: 'Vignana Bharathi Institute of Technology',
      role: 'Teaching Assistant, Foundations of Machine Learning',
      location: 'Hyderabad, India',
      period: '2022 - 2023',
      points: [
        'Supported Foundations of Machine Learning teaching across two semesters.',
      ],
    },
    {
      organization: 'EpsilonPi, ML Club in VBIT',
      role: 'ML Associate',
      location: 'Hyderabad, India',
      period: 'Jul 2023 - May 2024',
      points: [
        'Led a team of four members in research and AI application development for university initiatives.',
      ],
    },
    {
      organization: 'VBIT AI Days 2023',
      role: 'Invited Speaker',
      location: 'Hyderabad, India',
      period: 'Sep 2023',
      points: [
        'Presented “The ML Edge” to approximately 500 attendees, introducing supervised, unsupervised, and reinforcement learning.',
        'Explained why evaluating AI models matters alongside building them, with a focus on AI ethics and justice.',
      ],
      filePath: '/VBIT%20LOA.pdf',
    },
  ]

  return (
    <section className="leadership section" id="leadership">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Community</span>
          <h2 className="section-title">
            Leadership & <span className="gradient-text">Volunteer Experience</span>
          </h2>
        </div>

        <div className="leadership-grid">
          {experiences.map((item) => (
            <article key={`${item.organization}-${item.role}`} className="leadership-card">
              <div className="leadership-head">
                <h3>{item.organization}</h3>
                <span className="leadership-role">{item.role}</span>
              </div>
              <p className="leadership-meta">{item.location}</p>
              <p className="leadership-period">{item.period}</p>
              <ul className="leadership-points">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {item.filePath && (
                <a
                  className="btn btn-outline recognition-link"
                  href={item.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Appreciation Letter
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Leadership

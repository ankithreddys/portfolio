import './Leadership.css'

function Leadership() {
  const experiences = [
    {
      organization: 'EpsilonPi, ML Club in VBIT',
      role: 'ML Associate',
      location: 'Hyderabad, India',
      period: 'Jul 2023 - May 2024',
      points: [
        'Led a team of four members in research and AI application development for university initiatives.',
      ],
    },
  ]

  const recognitions = [
    {
      title: 'Letter of Appreciation - ML Guest Lecture',
      description: 'Recognition for delivering a machine learning lecture to college students.',
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
            </article>
          ))}
        </div>

        <div className="recognitions">
          <h3 className="recognitions-title">Letters & Certificates</h3>
          <div className="recognitions-grid">
            {recognitions.map((item) => (
              <article key={item.title} className="recognition-card">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <a
                  className="btn btn-outline recognition-link"
                  href={item.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Leadership

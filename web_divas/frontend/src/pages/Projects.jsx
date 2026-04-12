import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'

const STACK_COLOR = {
  react: 'badge-blue', fastapi: 'badge-green', mongodb: 'badge-green',
  docker: 'badge-blue', python: 'badge-purple', javascript: 'badge-warn',
  typescript: 'badge-blue', node: 'badge-green', firebase: 'badge-warn',
  express: 'badge-purple',
}

function ProjectCard({ project, i }) {
  const accents = ['var(--accent)', 'var(--accent2)', 'var(--accent3)']
  const color = accents[i % 3]
  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 3, background: color }} />
      <div style={{ padding: '24px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
          {project.name}
        </h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {project.description}
        </p>
        {project.stack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.stack.map(t => (
              <span key={t} className={`badge ${STACK_COLOR[t.toLowerCase()] || 'badge-purple'}`}>{t}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 8 }}>
          {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 12, padding: '5px 14px' }}>github ↗</a>}
          {project.live   && <a href={project.live}   target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 12, padding: '5px 14px', borderColor: `${color}44`, color }}>live ↗</a>}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const api = useApi()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    api.get('/projects/')
      .then(res  => setProjects(res.data))
      .catch(()  => setError('failed to connect to backend.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '64px 0 80px' }}>
      <div className="container">
        <div style={s.label}>// projects</div>
        <h1 style={s.title}>WHAT WE'VE BUILT</h1>
        <p style={s.sub}>Real things. Shipped. Sometimes broken. Always learning.</p>
        <div className="divider" />

        {loading && <div style={s.state}><span className="blink" style={{ color: 'var(--accent)' }}>█</span> &nbsp;fetching projects...</div>}
        {error   && <div style={s.error}>⚠ {error}</div>}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginTop: 32 }}>
            {projects.length === 0
              ? <p style={{ color: 'var(--text-dim)' }}>no projects yet. go build something.</p>
              : projects.map((p, i) => <ProjectCard key={p._id} project={p} i={i} />)
            }
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  label: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 16 },
  title: { fontFamily: 'var(--font-pixel)', fontSize: 'clamp(0.9rem, 3vw, 1.6rem)', marginBottom: 12 },
  sub:   { fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-secondary)' },
  state: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)', padding: '40px 0' },
  error: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--danger)', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginTop: 16 },
}

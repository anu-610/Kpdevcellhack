import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const TILES = [
  { to: '/admin/team',     icon: '👥', label: 'MANAGE TEAM',     desc: 'add · edit · remove members',  color: 'var(--accent)'  },
  { to: '/admin/events',   icon: '📅', label: 'MANAGE EVENTS',   desc: 'create · update club events',  color: 'var(--accent2)' },
  { to: '/admin/projects', icon: '🚀', label: 'MANAGE PROJECTS', desc: 'showcase what the club built', color: 'var(--accent3)' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  return (
    <div style={{ padding: '64px 0 80px' }}>
      <div className="container">
        <div style={s.label}>// admin panel</div>
        <h1 style={s.title}>DASHBOARD</h1>
        <p style={s.sub}>
          <span style={{ color: 'var(--accent)' }}>authenticated as</span> {user?.email}
        </p>
        <div className="divider" />

        <div style={s.grid}>
          {TILES.map(tile => (
            <Link key={tile.to} to={tile.to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: 28, cursor: 'pointer' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 16 }}>{tile.icon}</div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', color: tile.color, marginBottom: 8, lineHeight: 1.8 }}>
                  {tile.label}
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {tile.desc}
                </p>
                <div style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: tile.color }}>
                  ./open →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <button onClick={logout} className="btn" style={{ color: 'var(--danger)', borderColor: 'rgba(248,113,113,0.25)', fontSize: 13 }}>
            $ logout
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  label: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 16 },
  title: { fontFamily: 'var(--font-pixel)', fontSize: 'clamp(0.9rem, 3vw, 1.6rem)', marginBottom: 12 },
  sub:   { fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-secondary)' },
  grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
}

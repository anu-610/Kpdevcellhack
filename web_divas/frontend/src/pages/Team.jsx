import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'

const ROLE_COLOR = {
  lead:   { badge: 'badge-green',  label: 'LEAD'   },
  core:   { badge: 'badge-blue',   label: 'CORE'   },
  member: { badge: 'badge-purple', label: 'MEMBER' },
  alumni: { badge: 'badge-warn',   label: 'ALUMNI' },
}

function MemberCard({ member, i }) {
  const role = ROLE_COLOR[member.role] || ROLE_COLOR.member
  const initials = member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['var(--accent)', 'var(--accent2)', 'var(--accent3)', 'var(--warn)']
  const color = colors[i % colors.length]

  return (
    <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, animationDelay: `${i * 0.05}s` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ ...s.avatar, border: `1px solid ${color}22`, color }}>
          {initials}
        </div>
        <div>
          <div style={s.name}>{member.name}</div>
          <div style={s.position}>{member.position || 'Developer'}</div>
        </div>
      </div>
      <span className={`badge ${role.badge}`}>{role.label}</span>
      {member.bio && <p style={s.bio}>{member.bio}</p>}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        {member.github && (
          <a href={member.github} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 12, padding: '5px 12px' }}>
            github ↗
          </a>
        )}
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 12, padding: '5px 12px' }}>
            linkedin ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default function Team() {
  const api = useApi()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/team/')
      .then(res  => setMembers(res.data))
      .catch(()  => setError('failed to connect to backend.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '64px 0 80px' }}>
      <div className="container">
        <div style={s.label}>// team</div>
        <h1 style={s.title}>CORE TEAM</h1>
        <p style={s.sub}>The humans behind the commits.</p>
        <div className="divider" />

        {loading && <div style={s.state}><span className="blink" style={{ color: 'var(--accent)' }}>█</span> &nbsp;loading members...</div>}
        {error   && <div style={s.error}>⚠ {error}</div>}

        {!loading && !error && (
          <div style={s.grid}>
            {members.length === 0
              ? <p style={{ color: 'var(--text-dim)' }}>no members found. admin can add some.</p>
              : members.map((m, i) => <MemberCard key={m._id} member={m} i={i} />)
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
  grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 32 },
  avatar: {
    width: 48, height: 48, borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-pixel)', fontSize: '0.6rem',
    background: 'var(--bg-elevated)', flexShrink: 0,
  },
  name:     { fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },
  position: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginTop: 2 },
  bio:      { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 },
  state:    { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)', padding: '40px 0' },
  error:    { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--danger)', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginTop: 16 },
}

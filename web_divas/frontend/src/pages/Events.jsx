import { useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'

const TYPE_BADGE = {
  hackathon: 'badge-green', session: 'badge-blue',
  workshop: 'badge-purple', talk: 'badge-warn',
  collab: 'badge-green', other: 'badge-purple',
}

function EventRow({ event }) {
  const badge = TYPE_BADGE[event.type?.toLowerCase()] || 'badge-purple'
  const date  = event.date ? new Date(event.date) : null
  const isPast = date && date < new Date()

  return (
    <div className="card" style={{ padding: '20px 24px', display: 'flex', gap: 24, alignItems: 'flex-start', opacity: isPast ? 0.6 : 1 }}>
      {/* Date column */}
      <div style={{ minWidth: 56, textAlign: 'center', flexShrink: 0 }}>
        {date ? (
          <>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '1rem', color: 'var(--accent)' }}>
              {date.getDate().toString().padStart(2, '0')}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              {date.toLocaleString('default', { month: 'short' })}
            </div>
          </>
        ) : (
          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>TBD</div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
          <span className={`badge ${badge}`}>{(event.type || 'event').toUpperCase()}</span>
          {isPast && <span className="badge" style={{ color: 'var(--text-dim)', borderColor: 'var(--border-dim)' }}>PAST</span>}
        </div>
        <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.55rem', lineHeight: 1.8, marginBottom: 8 }}>{event.name}</h3>
        {event.description && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.description}</p>}
        {event.venue && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>📍 {event.venue}</p>}
      </div>
    </div>
  )
}

export default function Events() {
  const api = useApi()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    api.get('/events/')
      .then(res  => setEvents(res.data))
      .catch(()  => setError('failed to connect to backend.'))
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const filtered = events.filter(e => {
    if (filter === 'upcoming') return e.date && new Date(e.date) >= now
    if (filter === 'past')     return e.date && new Date(e.date) < now
    return true
  })

  return (
    <div style={{ padding: '64px 0 80px' }}>
      <div className="container">
        <div style={s.label}>// events</div>
        <h1 style={s.title}>EVENTS</h1>
        <p style={s.sub}>Sessions, hackathons, workshops — what we're up to.</p>
        <div className="divider" />

        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {['all', 'upcoming', 'past'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn" style={{
              fontSize: 12, padding: '6px 16px',
              ...(filter === f ? { background: 'var(--accent)', color: '#000', borderColor: 'var(--accent)' } : {})
            }}>{f}</button>
          ))}
        </div>

        {loading && <div style={s.state}><span className="blink" style={{ color: 'var(--accent)' }}>█</span> &nbsp;loading events...</div>}
        {error   && <div style={s.error}>⚠ {error}</div>}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.length === 0
              ? <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>no events found.</p>
              : filtered.map(e => <EventRow key={e._id} event={e} />)
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

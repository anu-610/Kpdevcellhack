import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import api from '../api.js'
import { claimPageBootLoader } from '../utils/bootLoaderGate.js'

// ── Theme ─────────────────────────────────────────────────────
const C = {
  bg: '#0d1117',
  card: '#161b22',
  border: '#232b3a',
  fg: '#e8eaed',
  muted: '#7e8590',
  cyan: '#14b8a6',
  purple: '#8b5cf6',
  green: '#22c55e',
  pink: '#ec4899',
}

function getLocalDateKey(dateValue) {
  if (typeof dateValue === 'string' && dateValue.length >= 10) {
    return dateValue.slice(0, 10)
  }

  const date = new Date(dateValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getEventTypeFromDate(dateValue) {
  const eventDay = getLocalDateKey(dateValue)
  const todayDay = getLocalDateKey(new Date())

  if (eventDay === todayDay) return 'today'
  return eventDay > todayDay ? 'upcoming' : 'past'
}

// ── Typewriter hook ───────────────────────────────────────────
function useTypewriter(text, speed = 40, startDelay = 300) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(delay)
  }, [text, speed, startDelay])

  return { displayed, done }
}

// ── Blinking cursor ───────────────────────────────────────────
function Cursor({ color = C.cyan }) {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.75, repeat: Infinity }}
      style={{ color, fontWeight: 300 }}
    >
      █
    </motion.span>
  )
}

// ── Page header with typewriter ───────────────────────────────
function PageHeader() {
  const { displayed, done } = useTypewriter('ls -la ./events', 55, 200)

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Breadcrumb */}
      <div style={{
        fontFamily: '"Fira Code", monospace',
        fontSize: '12px',
        color: C.muted,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ color: C.cyan }}>kp-dev-cell</span>
        <span>/</span>
        <span style={{ color: C.fg }}>events</span>
      </div>

      {/* Terminal command line */}
      <div style={{
        fontFamily: '"Fira Code", monospace',
        fontSize: '15px',
        color: C.muted,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '28px',
      }}>
        <span style={{ color: C.green }}>dev@kp-cell</span>
        <span style={{ color: C.muted }}>:</span>
        <span style={{ color: C.cyan }}>~</span>
        <span style={{ color: C.muted }}>$</span>
        <span style={{ color: C.fg }}>{displayed}</span>
        {!done && <Cursor />}
      </div>

      {/* Big heading */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          margin: '0 0 12px 0',
        }}
      >
        <span style={{ color: C.fg }}>Events &amp; </span>
        <span style={{
          background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Sessions.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          color: C.muted,
          fontSize: '15px',
          fontFamily: '"Fira Code", monospace',
          margin: 0,
        }}
      >
        # workshops · hackathons · talks · competitions by KP Dev Cell
      </motion.p>
    </div>
  )
}

// ── Filter tabs ───────────────────────────────────────────────
function FilterBar({ filter, setFilter, counts }) {
  const filters = [
  { key: 'all', label: 'all', icon: '*' },
  { key: 'upcoming', label: 'upcoming', icon: '↑' },
  { key: 'today', label: 'today', icon: '●' },
  { key: 'past', label: 'past', icon: '✓' },
]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '36px',
        fontFamily: '"Fira Code", monospace',
        flexWrap: 'wrap',
        overflowX: 'auto',
      }}
    >
      {filters.map(f => {
        const active = filter === f.key
        return (
          <motion.button
            key={f.key}
            onClick={() => setFilter(f.key)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: `1px solid ${active ? 'rgba(20,184,166,0.4)' : C.border}`,
              backgroundColor: active ? 'rgba(20,184,166,0.08)' : 'transparent',
              color: active ? C.cyan : C.muted,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: '"Fira Code", monospace',
            }}
          >
            <span style={{ color: active ? C.cyan : '#374151' }}>{f.icon}</span>
            {f.label}
            {counts[f.key] !== undefined && (
              <span style={{
                backgroundColor: active ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(20,184,166,0.3)' : C.border}`,
                color: active ? C.cyan : '#4b5563',
                fontSize: '10px',
                padding: '1px 7px',
                borderRadius: '20px',
              }}>
                {counts[f.key]}
              </span>
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}

// ── Event type badge ──────────────────────────────────────────
function TypeBadge({ type }) {
  const isUpcoming = type === 'upcoming'
  const isToday = type === 'today'
  const isPast = type === 'past'

  const badgeBackground = isUpcoming
    ? 'rgba(34,197,94,0.1)'
    : isToday
      ? 'rgba(245,158,11,0.12)'
      : 'rgba(139,92,246,0.1)'

  const badgeBorder = isUpcoming
    ? 'rgba(34,197,94,0.25)'
    : isToday
      ? 'rgba(245,158,11,0.28)'
      : 'rgba(139,92,246,0.25)'

  const badgeColor = isUpcoming
    ? C.green
    : isToday
      ? '#f59e0b'
      : C.purple

  const dotColor = isUpcoming
    ? C.green
    : isToday
      ? '#f59e0b'
      : C.purple

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '10px',
      fontFamily: '"Fira Code", monospace',
      fontWeight: 600,
      letterSpacing: '0.08em',
      padding: '3px 10px',
      borderRadius: '20px',
      backgroundColor: badgeBackground,
      border: `1px solid ${badgeBorder}`,
      color: badgeColor,
      flexShrink: 0,
    }}>
      <motion.span
        animate={!isPast ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{
          width: '5px', height: '5px', borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block',
        }}
      />
      {type}
    </span>
  )
}

// ── Single event card ─────────────────────────────────────────
function EventCard({ event, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const hover = useMotionValue(0)
  const borderColor = useTransform(hover, [0, 1], [C.border, 'rgba(20,184,166,0.3)'])
  const cardShadow = useTransform(
    hover,
    [0, 1],
    ['0 2px 12px rgba(0,0,0,0.2)', '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(20,184,166,0.08)']
  )
  const dateBg = useTransform(
    hover,
    [0, 1],
    ['rgba(13,17,23,0.5)', 'linear-gradient(180deg, rgba(20,184,166,0.06), rgba(20,184,166,0.02))']
  )
  const imageFilter = useTransform(
    hover,
    [0, 1],
    ['brightness(0.6) saturate(0.7)', 'brightness(0.9)']
  )

  const date = new Date(event.date)
  const day = date.toLocaleDateString('en-IN', { day: '2-digit' })
  const month = date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()
  const year = date.getFullYear()
  const weekday = date.toLocaleDateString('en-IN', { weekday: 'long' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, x: -10 }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      onHoverStart={() => animate(hover, 1, { duration: 0.22 })}
      onHoverEnd={() => animate(hover, 0, { duration: 0.22 })}
      style={{
        backgroundColor: C.card,
        border: '1px solid',
        borderColor,
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: event.image_url ? '80px 1fr auto' : '80px 1fr',
        gap: 0,
        boxShadow: cardShadow,
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Left: Date column */}
      <motion.div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 12px',
        borderRight: `1px solid ${C.border}`,
        background: dateBg,
        minWidth: '80px',
        gap: '2px',
      }}>
        <span style={{
          fontFamily: '"Fira Code", monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: C.cyan,
          fontWeight: 600,
        }}>
          {month}
        </span>
        <span style={{
          fontSize: '32px',
          fontWeight: 900,
          color: C.fg,
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}>
          {day}
        </span>
        <span style={{
          fontFamily: '"Fira Code", monospace',
          fontSize: '10px',
          color: C.muted,
        }}>
          {year}
        </span>
      </motion.div>

      {/* Center: Content */}
      <div style={{ padding: '20px 24px', minWidth: 0 }}>
        {/* Top row: badge + title */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '8px',
        }}>
          <TypeBadge type={event.type} />
          <span style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '11px',
            color: C.muted,
            marginTop: '2px',
          }}>
            {weekday}
          </span>
        </div>

        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: C.fg,
          margin: '0 0 10px 0',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}>
          {event.title}
        </h2>

        <p style={{
          color: C.muted,
          fontSize: '13px',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {event.description}
        </p>

        {/* Bottom accent line on hover */}
        <motion.div
          style={{
            scaleX: hover,
            opacity: hover,
            height: '1px',
            background: `linear-gradient(90deg, ${C.cyan}, transparent)`,
            marginTop: '16px',
            transformOrigin: 'left',
          }}
        />
      </div>

      {/* Right: image (if exists) */}
      {event.image_url && (
        <div style={{
          width: '120px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <motion.img
            src={event.image_url}
            alt={event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: imageFilter,
            }}
          />
          {/* Overlay fade left */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, ${C.card} 0%, transparent 40%)`,
          }} />
        </div>
      )}

      {/* Top accent bar on hover */}
      <motion.div
        style={{
          scaleX: hover,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`,
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  )
}

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        textAlign: 'center',
        padding: '80px 24px',
        fontFamily: '"Fira Code", monospace',
      }}
    >
      <div style={{
        fontSize: '48px',
        marginBottom: '20px',
        color: C.border,
      }}>
        [ ]
      </div>
      <p style={{ color: C.muted, fontSize: '14px', margin: '0 0 8px 0' }}>
        <span style={{ color: C.cyan }}>$ </span>
        find ./events -type {filter} --result
      </p>
      <p style={{ color: '#374151', fontSize: '13px', margin: 0 }}>
        # no events found for &quot;{filter}&quot;
      </p>
    </motion.div>
  )
}

// ── Loading skeleton ──────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          style={{
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            height: '110px',
          }}
        />
      ))}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        fontFamily: '"Fira Code", monospace',
        fontSize: '12px',
        color: C.muted,
      }}>
        <span style={{ color: C.cyan }}>$ </span>
        fetching events<Cursor />
      </div>
    </div>
  )
}

function EventsBootLoader({ progress }) {
  const rounded = Math.round(progress)
  const stage = rounded < 35 ? 'mapping schedule graph' : rounded < 75 ? 'syncing event timeline' : 'arming live sessions'
  const pulseColor = rounded < 60 ? C.cyan : C.purple
  const sessionCode = useMemo(() => `EVT-${Math.random().toString(16).slice(2, 6).toUpperCase()}`, [])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 500;

  return (
    <>
      <style>{`
        @keyframes eventsSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes eventsPulse {
          0%, 100% { transform: scale(0.95); opacity: 0.4; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes eventsBlink {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.95; }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(900px 540px at 22% 16%, rgba(20,184,166,0.16), transparent 62%), radial-gradient(780px 520px at 86% 84%, rgba(139,92,246,0.13), transparent 64%), #080c13',
      }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(92vw, 620px)',
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: isMobile ? '16px 14px 14px' : '22px 20px 18px',
          background: 'rgba(9,13,21,0.9)',
          boxShadow: '0 12px 42px rgba(0,0,0,0.48)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            fontFamily: '"Fira Code", monospace',
            fontSize: 11,
            color: C.muted,
          }}>
            <span>events.runtime.boot</span>
            <span>{sessionCode}</span>
          </div>

          <div style={{ display: 'flex',
flexDirection: isMobile ? 'column' : 'row',
alignItems: 'center',
gap: isMobile ? 10 : 16, }}>
            <div style={{ position: 'relative', width: isMobile ? 72 : 118,
height: isMobile ? 72 : 118, margin: isMobile ? '0 auto 4px' : '0 auto', }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `1px solid ${C.border}`,
              }} />
              <div style={{
                position: 'absolute', inset: 16, borderRadius: '50%',
                border: `1px solid ${C.border}`,
              }} />
              <div style={{
                position: 'absolute', inset: 32, borderRadius: '50%',
                border: `1px dashed ${pulseColor}70`,
                animation: 'eventsPulse 1.5s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute', left: '50%', top: '50%',
                width: 10, height: 10, borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: pulseColor,
                boxShadow: `0 0 12px ${pulseColor}70`,
              }} />
            </div>

            <div>
              <div style={{ fontFamily: '"Fira Code", monospace', fontSize: 12, color: '#9db0c0', marginBottom: 10 }}>
                preparing.events.interface
              </div>

              <div style={{ height: 10, borderRadius: 999, background: '#0f1623', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                <div style={{
                  width: `${rounded}%`,
                  height: '100%',
                  transition: 'width 120ms linear',
                  background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`,
                  boxShadow: '0 0 12px rgba(139,92,246,0.25)',
                }} />
              </div>

              <div style={{ marginTop: 9, display: 'flex', justifyContent: 'space-between', fontFamily: '"Fira Code", monospace', fontSize: 11 }}>
                <span style={{ color: C.muted }}>{stage}</span>
                <span style={{ color: pulseColor }}>{rounded}%</span>
              </div>

              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <span
                    key={i}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 999,
                      backgroundColor: i <= Math.floor((rounded / 100) * 4) ? pulseColor : '#1f2838',
                      animation: i <= Math.floor((rounded / 100) * 4) ? 'eventsBlink 1.2s ease-in-out infinite' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Stats bar ─────────────────────────────────────────────────
function StatsBar({ events }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const upcoming = events.filter(e => e.type === 'upcoming').length
  const past = events.filter(e => e.type === 'past').length

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '32px',
        padding: '14px 20px',
        backgroundColor: 'rgba(13,17,23,0.6)',
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        fontFamily: '"Fira Code", monospace',
        fontSize: '12px',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ color: C.cyan }}>kp-dev-cell</span>
      <span style={{ color: '#374151' }}>/</span>
      <span style={{ color: C.fg }}>events</span>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <span style={{ color: C.muted }}>
          <span style={{ color: C.green }}>
            {upcoming}
          </span>
          {' '}upcoming
        </span>
        <span style={{ color: '#374151' }}>·</span>
        <span style={{ color: C.muted }}>
          <span style={{ color: C.purple }}>
            {past}
          </span>
          {' '}past
        </span>
        <span style={{ color: '#374151' }}>·</span>
        <span style={{ color: C.muted }}>
          <span style={{ color: '#f59e0b' }}>
            {events.filter(e => e.type === 'today').length}
          </span>
          {' '}today
        </span>
      </div>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────
function EventsPage() {
  const [introLoading, setIntroLoading] = useState(() => claimPageBootLoader('events'))
  const [introProgress, setIntroProgress] = useState(0)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (!introLoading) return

    const durationMs = 3200
    const start = performance.now()
    let rafId = 0

    const tick = (now) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setIntroProgress(eased * 100)

      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setIntroProgress(100)
        setTimeout(() => setIntroLoading(false), 260)
      }
    }

    rafId = requestAnimationFrame(tick)
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(rafId)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!introLoading) {
      document.body.style.overflow = ''
    }
  }, [introLoading])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data.map(event => ({
        ...event,
        type: getEventTypeFromDate(event.date),
      })))
    } catch (err) {
      console.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return events
    return events.filter(event => event.type === filter)
  }, [events, filter])

  const counts = useMemo(() => ({
    all: events.length,
    upcoming: events.filter(e => e.type === 'upcoming').length,
    today: events.filter(e => e.type === 'today').length,
    past: events.filter(e => e.type === 'past').length,
  }), [events])

  if (introLoading) {
    return <EventsBootLoader progress={introProgress} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: C.bg,
      color: C.fg,
      position: 'relative',
      paddingTop  : '56px',
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '30%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '20%',
        right: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '80px 32px 80px',
        position: 'relative',
        zIndex: 1,
      }}>
        <PageHeader />

        {!loading && events.length > 0 && <StatsBar events={events} />}

        <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.length === 0 ? (
                <EmptyState filter={filter} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filtered.map((event, i) => (
                    <EventCard key={event._id} event={event} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Footer note */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{
              textAlign: 'center',
              color: '#374151',
              fontSize: '12px',
              fontFamily: '"Fira Code", monospace',
              marginTop: '48px',
            }}
          >
            # events are updated regularly — check back soon
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default EventsPage

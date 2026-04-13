import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, animate } from 'framer-motion'
import api from '../../api.js'

const C = {
  bg: '#0D1117',
  card: '#161B26',
  elevated: '#1E2535',
  border: '#232B3A',
  cyan: '#14B8A6',
  purple: '#8B5CF6',
  fg: '#E8EAED',
  muted: '#7E8590',
}

// ── Glitch text effect ─────────────────────────────────────────
function GlitchText({ text, style }) {
  const [glitching, setGlitching] = useState(false)
  const glitchTimeoutRef = useRef(null)
  const chars = '!@#$%^&*<>{}[]|\\01'

  const triggerGlitch = () => {
    setGlitching(true)
    if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
    glitchTimeoutRef.current = setTimeout(() => setGlitching(false), 400)
  }

  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
    }
  }, [])

  return (
    <span
      onMouseEnter={triggerGlitch}
      style={{ cursor: 'default', ...style }}
    >
      {glitching
        ? text.split('').map((c, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [1, 0, 1], y: [0, -2, 0] }}
              transition={{ duration: 0.1, delay: i * 0.02 }}
              style={{
                color: Math.random() > 0.5 ? C.cyan : C.purple,
                display: 'inline-block',
              }}
            >
              {Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : c}
            </motion.span>
          ))
        : text}
    </span>
  )
}

// ── Terminal modal ─────────────────────────────────────────────
function TerminalModal({ member, onClose }) {
  const [lines, setLines] = useState([])
  const terminalLines = [
  `$ cat member.json`,
  `{`,
  `  "name": "${member.name || ''}",`,
  `  "role": "${member.role || ''}",`,
  `  "team": "${member.team || ''}",`,
  `  "bio": "${member.bio || 'No bio available'}",`,
  `  "status": "active"`,
  `}`,
  `$ _`,
].filter(Boolean)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < terminalLines.length) {
        setLines(prev => [...prev, terminalLines[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#0A0E16',
          border: `1px solid ${C.border}`,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          boxShadow: `0 0 60px rgba(20,184,166,0.15), 0 24px 80px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Terminal header */}
        <div style={{
          backgroundColor: '#161B26',
          borderBottom: `1px solid ${C.border}`,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div onClick={onClose} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F57', cursor: 'pointer' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FEBC2E' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28C840' }} />
          <span style={{
            marginLeft: '8px', color: C.muted,
            fontSize: '12px', fontFamily: '"Fira Code", monospace',
            flex: 1, textAlign: 'center',
          }}>
            member_info — bash
          </span>
        </div>

        {/* Terminal body */}
        <div style={{ padding: '20px', minHeight: '220px' }}>
          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.name}
                style={{
                  width: '56px', height: '56px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: `2px solid ${C.cyan}`,
                  filter: 'grayscale(20%)',
                }}
              />
            ) : (
              <div style={{
                width: '56px', height: '56px', borderRadius: '8px',
                background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: 900, color: '#fff',
                fontFamily: '"Fira Code", monospace',
              }}>
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ color: C.fg, fontWeight: 700, fontSize: '16px' }}>{member.name}</div>
              <div style={{ color: C.cyan, fontSize: '12px', fontFamily: '"Fira Code", monospace' }}>{member.role}</div>
            </div>
          </div>

          {/* Terminal lines */}
          <div style={{ fontFamily: '"Fira Code", monospace', fontSize: '12px', lineHeight: 1.8 }}>
            {lines.filter(line => line !== undefined && line !== null).map((line, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.15 }}
    style={{
      color: typeof line === 'string' && line.startsWith('$') ? C.cyan
        : typeof line === 'string' && (line.includes('"name"') || line.includes('"role"')) ? C.purple
        : typeof line === 'string' && line.includes(':') ? C.fg
        : C.muted,
    }}
  >
    {line}
  </motion.div>
))}
          </div>
        </div>

        {/* Footer links */}
        <div style={{
          borderTop: `1px solid ${C.border}`,
          padding: '12px 20px',
          display: 'flex', gap: '16px',
        }}>
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer"
              style={{ color: C.cyan, fontSize: '12px', fontFamily: '"Fira Code", monospace', textDecoration: 'none' }}>
              github ↗
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
              style={{ color: C.purple, fontSize: '12px', fontFamily: '"Fira Code", monospace', textDecoration: 'none' }}>
              linkedin ↗
            </a>
          )}
          <span
            onClick={onClose}
            style={{ marginLeft: 'auto', color: C.muted, fontSize: '12px', fontFamily: '"Fira Code", monospace', cursor: 'pointer' }}
          >
            [esc] close
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Hexagonal member card ──────────────────────────────────────
function MemberCard({ member, index, onSelect }) {
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const hover = useMotionValue(0)
  const cardShadow = useTransform(
    hover,
    [0, 1],
    [
      `0 0 0 1px ${C.border}, 0 4px 16px rgba(0,0,0,0.2)`,
      `0 0 0 1px ${C.cyan}, 0 0 24px rgba(20,184,166,0.2), 0 12px 40px rgba(0,0,0,0.4)`,
    ]
  )
  const imageScale = useTransform(hover, [0, 1], [1, 1.08])
  const imageFilter = useTransform(hover, [0, 1], ['grayscale(30%)', 'grayscale(0%)'])
  const avatarBg = useTransform(
    hover,
    [0, 1],
    [
      `linear-gradient(135deg, rgba(20,184,166,0.15), rgba(139,92,246,0.2))`,
      `linear-gradient(135deg, rgba(20,184,166,0.4), rgba(139,92,246,0.5))`,
    ]
  )
  const initialsColor = useTransform(hover, [0, 1], [C.muted, C.fg])
  const infoOverlayOpacity = useTransform(hover, [0, 1], [0, 1])

  // Random slight rotation for polaroid effect
  const rotation = ((index * 7) % 11) - 5

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      whileHover={{
        y: -12,
        rotate: rotation * 0.3,
        scale: 1.04,
        zIndex: 10,
      }}
      whileTap={{ scale: 0.97 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 200, damping: 20 }}
      onClick={() => onSelect(member)}
      onHoverStart={() => animate(hover, 1, { duration: 0.2 })}
      onHoverEnd={() => animate(hover, 0, { duration: 0.2 })}
      style={{
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Glowing border on hover */}
      <motion.div
        style={{
          backgroundColor: C.card,
          borderRadius: '14px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: cardShadow,
        }}
      >
        {/* Top color bar — unique per member */}
        <div style={{
          height: '3px',
          background: index % 2 === 0
            ? `linear-gradient(90deg, ${C.cyan}, ${C.purple})`
            : `linear-gradient(90deg, ${C.purple}, ${C.cyan})`,
        }} />

        {/* Photo or gradient avatar */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '160px' }}>
          {member.photo_url ? (
            <motion.img
              src={member.photo_url}
              alt={member.name}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                scale: imageScale,
                filter: imageFilter,
              }}
            />
          ) : (
            <motion.div
              style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '8px',
                background: avatarBg,
              }}
            >
              <motion.span style={{
                fontSize: '36px', fontWeight: 900,
                color: initialsColor,
                fontFamily: '"Fira Code", monospace',
              }}>
                {initials}
              </motion.span>
            </motion.div>
          )}

          {/* Hover overlay */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(13,17,23,0.9) 0%, transparent 60%)',
              display: 'flex', alignItems: 'flex-end',
              padding: '12px',
              opacity: infoOverlayOpacity,
              pointerEvents: 'none',
            }}
          >
            <span style={{
              color: C.cyan, fontSize: '10px',
              fontFamily: '"Fira Code", monospace',
              letterSpacing: '0.1em',
            }}>
              click for info →
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px' }}>
          <GlitchText
            text={member.name}
            style={{
              display: 'block',
              fontWeight: 700, color: C.fg,
              fontSize: '13px', marginBottom: '3px',
            }}
          />
          <div style={{
            color: C.cyan, fontSize: '10px',
            fontFamily: '"Fira Code", monospace',
            marginBottom: '2px',
          }}>
            {member.role}
          </div>
          <div style={{ color: C.muted, fontSize: '10px', marginBottom: '6px' }}>
  {member.team}
</div>

{member.bio && (
  <div style={{
    color: C.muted,
    fontSize: '10px',
    lineHeight: 1.5,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }}>
    {member.bio}
  </div>
)}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Scrolling name ticker ──────────────────────────────────────
function NameTicker({ members }) {
  if (!members.length) return null
  const items = [...members, ...members]
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      padding: '12px 0',
      marginBottom: '64px',
      backgroundColor: 'rgba(22,27,38,0.4)',
    }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '40px', width: 'max-content' }}
      >
        {items.map((m, i) => (
          <span key={i} style={{
            color: C.muted, fontSize: '11px',
            fontFamily: '"Fira Code", monospace',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: C.purple, marginRight: '6px' }}>{'>'}</span>
            {m.name}
            <span style={{ color: C.border, marginLeft: '6px' }}>/{m.role}</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────
export default function MembersSection() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState(null)
  const [filter, setFilter] = useState('all')
  const sectionRef = useRef(null)

  const normalizeMember = member => ({
    ...member,
    team: member.team || member.batch || '',
  })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  useEffect(() => {
    api.get('/members')
      .then(res => setMembers((res.data || []).map(normalizeMember)))
      .catch(err => console.error('Failed to fetch members', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') setSelectedMember(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const teams = useMemo(
    () => ['all', ...new Set(members.map(m => m.team).filter(Boolean).sort())],
    [members]
  )

  const filtered = useMemo(
    () => (filter === 'all' ? members : members.filter(m => m.team === filter)),
    [members, filter]
  )

  if (!loading && members.length === 0) return null

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        borderTop: `1px solid ${C.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Parallax bg grid */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(${C.border} 1px, transparent 1px),
            linear-gradient(90deg, ${C.border} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.15,
          y: bgY,
          pointerEvents: 'none',
        }}
      />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '20%', right: '-100px',
        width: '500px', height: '500px',
        background: `radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '-80px',
        width: '400px', height: '400px',
        background: `radial-gradient(circle, rgba(20,184,166,0.05), transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '100px 48px',
        position: 'relative', zIndex: 1,
      }}>

        {/* Section header */}
        <div style={{ marginBottom: '16px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}
          >
            <div style={{ width: '24px', height: '1px', backgroundColor: C.purple }} />
            <span style={{
              color: C.purple, fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: '"Fira Code", monospace',
            }}>
              Members
            </span>
          </motion.div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontWeight: 900,
                color: C.fg, margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              Everyone who<br />
              <span style={{
                background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ships code.
              </span>
            </motion.h2>

            {/* Live count badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                backgroundColor: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                padding: '10px 16px',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: C.cyan }}
              />
              <span style={{
                color: C.fg, fontWeight: 700,
                fontFamily: '"Fira Code", monospace', fontSize: '14px',
              }}>
                {members.length}
              </span>
              <span style={{ color: C.muted, fontSize: '12px', fontFamily: '"Fira Code", monospace' }}>
                active members
              </span>
            </motion.div>
          </div>
        </div>

        {/* Name ticker */}
        {!loading && <NameTicker members={members} />}

        {/* Team filter */}
        {teams.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}
          >
            {teams.map(b => (
              <motion.button
                key={b}
                onClick={() => setFilter(b)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: `1px solid ${filter === b ? C.purple : C.border}`,
                  backgroundColor: filter === b ? 'rgba(139,92,246,0.1)' : C.card,
                  color: filter === b ? C.purple : C.muted,
                  fontSize: '11px',
                  fontFamily: '"Fira Code", monospace',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.05em',
                }}
              >
                {b === 'all' ? '// all teams' : `team_${b}`}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Loading state */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ color: C.cyan, fontFamily: '"Fira Code", monospace', fontSize: '13px' }}
            >
              {'>'} fetching members...
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '16px',
              }}
            >
              {filtered.map((member, i) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  index={i}
                  onSelect={setSelectedMember}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom line */}
        {!loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              marginTop: '64px',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${C.purple}, ${C.cyan}, transparent)`,
              transformOrigin: 'left',
            }}
          />
        )}
      </div>

      {/* Terminal modal */}
      <AnimatePresence>
        {selectedMember && (
          <TerminalModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
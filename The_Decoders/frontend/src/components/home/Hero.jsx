import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { C } from '../../constants/theme'
import MatrixRain from './MatrixRain'
import api from '../../api.js'

// ── Typewriter hook ───────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx(i => (i + 1) % words.length)
          setCharIdx(0)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return displayed
}

// ── Typewriter for expanding message ─────────────────────────
function useMessageTypewriter(text, active, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const idxRef = useRef(0)

  useEffect(() => {
    if (!active) {
      setDisplayed('')
      setDone(false)
      idxRef.current = 0
      return
    }
    idxRef.current = 0
    setDisplayed('')
    setDone(false)

    const interval = setInterval(() => {
      idxRef.current += 1
      setDisplayed(text.slice(0, idxRef.current))
      if (idxRef.current >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [active, text, speed])

  return { displayed, done }
}

// ── Terminal Popup ────────────────────────────────────────────
function TerminalPopup({ announcement, onClose }) {
  const date = new Date(announcement.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  const [typingActive, setTypingActive] = useState(false)
  const { displayed, done } = useMessageTypewriter(announcement.message, typingActive, 16)
  const scrollRef = useRef(null)

  // start typewriter after popup animation
  useEffect(() => {
    const t = setTimeout(() => setTypingActive(true), 400)
    return () => clearTimeout(t)
  }, [])

  // auto-scroll as typewriter types
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayed])

  // close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Terminal window — stop click propagation so backdrop doesn't close when clicking inside */}
        <motion.div
          key="terminal"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '12px',
            overflow: 'hidden',
            fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace',
            boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(20,184,166,0.18)`,
            backgroundColor: '#0f1117',
          }}
        >
          {/* ── Title bar ── */}
          <div style={{
            backgroundColor: '#1c2030',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Traffic lights */}
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              {['#FF5F57', '#FFBD2E', '#28CA41'].map((color, i) => (
                <div
                  key={i}
                  onClick={i === 0 ? onClose : undefined}
                  style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: color,
                    cursor: i === 0 ? 'pointer' : 'default',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            {/* Title */}
            <div style={{
              flex: 1,
              textAlign: 'center',
              color: '#6B7280',
              fontSize: '12px',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              announcement.json — bash
            </div>
          </div>

          {/* ── Terminal body ── */}
          <div
            ref={scrollRef}
            style={{
              padding: '20px 20px 8px 20px',
              maxHeight: '320px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(20,184,166,0.2) transparent',
            }}
          >
            {/* $ cat announcement.json */}
            <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '12px' }}>
              <span style={{ color: C.cyan }}>$ </span>
              cat announcement.json
            </div>

            {/* JSON lines */}
            <div style={{ fontSize: '13px', lineHeight: 2, color: '#9CA3AF' }}>
              <div>
                <span style={{ color: C.cyan }}>"title"</span>
                <span style={{ color: '#6B7280' }}>: </span>
                <span style={{ color: '#e2e8f0' }}>"{announcement.title}"</span>
                <span style={{ color: '#6B7280' }}>,</span>
              </div>
              <div>
                <span style={{ color: C.cyan }}>"date"</span>
                <span style={{ color: '#6B7280' }}>: </span>
                <span style={{ color: '#e2e8f0' }}>"{date}"</span>
                <span style={{ color: '#6B7280' }}>,</span>
              </div>
              <div>
                <span style={{ color: C.cyan }}>"status"</span>
                <span style={{ color: '#6B7280' }}>: </span>
                <span style={{ color: '#4ade80' }}>"active"</span>
                <span style={{ color: '#6B7280' }}>,</span>
              </div>
              <div>
                <span style={{ color: C.cyan }}>"message"</span>
                <span style={{ color: '#6B7280' }}>: </span>
              </div>
              {/* Typewriter message */}
              <div style={{
                color: '#e2e8f0',
                paddingLeft: '12px',
                borderLeft: '2px solid rgba(20,184,166,0.25)',
                marginLeft: '4px',
                marginTop: '4px',
                marginBottom: '4px',
                lineHeight: 1.7,
                wordBreak: 'break-word',
                fontSize: '13px',
              }}>
                "{displayed}
                {!done && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    style={{ color: C.cyan }}
                  >|</motion.span>
                )}
                "
              </div>
            </div>

            {/* Closing brace + prompt */}
            {done && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '8px' }}
              >
                <div style={{ color: '#6B7280' }}>{'}'}</div>
                <div style={{ marginTop: '8px' }}>
                  <span style={{ color: C.cyan }}>$ </span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ color: '#9CA3AF' }}
                  >_</motion.span>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Footer: [esc] close ── */}
          <div style={{
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            backgroundColor: '#0f1117',
          }}>
            <motion.button
              onClick={onClose}
              whileHover={{ backgroundColor: 'rgba(20,184,166,0.12)', color: C.cyan }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#6B7280',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: '12px',
                padding: '5px 12px',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                transition: 'all 0.2s ease',
              }}
            >
              [esc] close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Desktop Floating Announcement Card ───────────────────────
function AnnouncementCard({ announcement, onOpenPopup }) {
  const date = new Date(announcement.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <motion.div
      layout
      onClick={() => onOpenPopup(announcement)}
      whileHover={{ scale: 1.02, borderColor: 'rgba(20,184,166,0.4)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        backgroundColor: 'rgba(22,27,38,0.92)',
        border: `1px solid ${C.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontSize: '13px',
        lineHeight: 1.7,
        backdropFilter: 'blur(14px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        width: '220px',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Top row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '8px', marginBottom: '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '5px', height: '5px', borderRadius: '50%',
              backgroundColor: C.cyan, display: 'inline-block', flexShrink: 0,
            }}
          />
          <span style={{
            color: C.cyan, fontSize: '10px',
            letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
          }}>
            announcement
          </span>
        </div>
        <span style={{ color: '#4B5563', fontSize: '10px' }}>{date}</span>
      </div>

      {/* Title */}
      <div style={{
        color: C.fg, fontWeight: 600, fontSize: '11px',
        lineHeight: 1.4, marginBottom: '5px',
      }}>
        {announcement.title}
      </div>

      {/* Preview message — 2 lines */}
      <div style={{
        color: '#6B7280', fontSize: '12px', lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {announcement.message}
      </div>

      {/* Hint */}
      <div style={{
        marginTop: '8px', fontSize: '10px',
        color: '#374151', letterSpacing: '0.08em', textAlign: 'right',
      }}>
        [ click to expand ]
      </div>
    </motion.div>
  )
}

// ── Mobile Ticker Strip ───────────────────────────────────────
function MobileTicker({ announcements, onOpenPopup }) {
  if (!announcements.length) return null

  // Duplicate for seamless infinite scroll
  const items = [...announcements, ...announcements, ...announcements]

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      padding: '10px 0',
      position: 'relative',
    }}>
      {/* Fade edges */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '40px', zIndex: 2,
        background: 'linear-gradient(to right, rgba(10,12,18,0.95), transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: '40px', zIndex: 2,
        background: 'linear-gradient(to left, rgba(10,12,18,0.95), transparent)',
        pointerEvents: 'none',
      }} />

      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{
          duration: announcements.length * 6,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          display: 'flex',
          gap: '12px',
          width: 'max-content',
        }}
      >
        {items.map((ann, i) => (
          <motion.button
            key={`${ann._id}-${i}`}
            onClick={() => onOpenPopup(ann)}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              backgroundColor: 'rgba(22,27,38,0.9)',
              border: `1px solid ${C.border}`,
              borderRadius: '20px',
              padding: '7px 14px',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontSize: '12px',
              color: C.muted,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Pulsing dot */}
            <motion.span
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              style={{
                width: '5px', height: '5px', borderRadius: '50%',
                backgroundColor: C.cyan, display: 'inline-block', flexShrink: 0,
              }}
            />
            <span style={{ color: C.cyan, fontSize: '10px', letterSpacing: '0.1em' }}>
              announce
            </span>
            <span style={{ color: '#9CA3AF' }}>→</span>
            <span style={{
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {ann.title}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

// ── Positions for up to 6 desktop announcement cards ─────────
const CARD_POSITIONS_POOL = [
  { top: '12%', right: '18%' },
  { top: '38%', right: '6%' },
  { top: '62%', right: '22%' },
  { top: '24%', right: '8%' },
  { bottom: '15%', right: '14%' },
  { bottom: '8%',  right: '28%' },
]
function shufflePositions(positions) {
  const shuffled = [...positions]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ── Data ─────────────────────────────────────────────────────
const TYPEWRITER_WORDS = [
  'Build. Break. Learn.',
  'Ship Real Projects.',
  'Write Clean Code.',
  'Learn Together.',
  'Go Beyond Curriculum.',
]

// ── Responsive hook ───────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])

  return isMobile
}

// ── Component ─────────────────────────────────────────────────
export default function Hero() {
  const typed = useTypewriter(TYPEWRITER_WORDS)
  const heroRef = useRef(null)
  const [announcements, setAnnouncements] = useState([])
  const [cardPositions] = useState(() => shufflePositions(CARD_POSITIONS_POOL))
  const [activePopup, setActivePopup] = useState(null)
  const isMobile = useIsMobile()

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (activePopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [activePopup])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements')
        const active = res.data.filter(a => a.active !== false).slice(0, 3)
        setAnnouncements(active)
      } catch (err) {
        console.error('Failed to fetch announcements')
      }
    }
    fetchAnnouncements()
  }, [])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Terminal Popup (shared for mobile + desktop) ── */}
      <AnimatePresence>
        {activePopup && (
          <TerminalPopup
            key={activePopup._id}
            announcement={activePopup}
            onClose={() => setActivePopup(null)}
          />
        )}
      </AnimatePresence>

      <motion.section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          opacity: heroOpacity,
        }}
      >
        {/* Matrix rain */}
        <MatrixRain heroRef={heroRef} />

        {/* Ambient orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '30%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '20%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* ── Desktop: floating cards ── */}
        {!isMobile && announcements.map((announcement, i) => (
          <div
            key={announcement._id}
            style={{
              position: 'absolute',
              zIndex: 3,
              ...cardPositions[i % cardPositions.length],
            }}
          >
            <AnnouncementCard
              announcement={announcement}
              onOpenPopup={setActivePopup}
            />
          </div>
        ))}

        {/* ── Main content ── */}
        <div style={{
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '0 24px' : '0 48px',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
        }}>

          {/* Club label pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              backgroundColor: 'rgba(20,184,166,0.08)',
              border: '1px solid rgba(20,184,166,0.25)',
              borderRadius: '20px', padding: '8px 18px',
              marginBottom: '36px',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: C.cyan, display: 'inline-block', flexShrink: 0,
              }}
            />
            <span style={{
              color: C.cyan, fontSize: isMobile ? '12px' : '14px', fontWeight: 500,
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              whiteSpace: 'nowrap',
            }}>
              Kammand Prompt Club — IIT Mandi
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontSize: isMobile ? 'clamp(40px, 12vw, 64px)' : 'clamp(52px, 8vw, 108px)',
              fontWeight: 900, lineHeight: 1.05,
              letterSpacing: '-0.04em',
              margin: '0 0 28px 0',
              maxWidth: isMobile ? '100%' : '760px',
            }}
          >
            <span style={{ color: C.fg }}>We don't</span>
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Just Code.
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontSize: isMobile ? 'clamp(15px, 4vw, 20px)' : 'clamp(20px, 3vw, 30px)',
              color: C.muted,
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              marginBottom: '48px',
              height: isMobile ? '32px' : '44px',
              display: 'flex', alignItems: 'center', gap: '2px',
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            <span style={{ color: C.cyan }}>$ </span>
            <span>{typed}</span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ color: C.cyan, fontWeight: 300 }}
            >|</motion.span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-start',
              width: '100%',
            }}
          >
            <motion.a
              href="/events"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: `linear-gradient(135deg, ${C.cyan}, #0e9488)`,
                color: '#fff',
                padding: isMobile ? '13px 24px' : '16px 32px',
                borderRadius: '12px',
                textDecoration: 'none', fontWeight: 700,
                fontSize: isMobile ? '14px' : '16px',
                boxShadow: '0 0 32px rgba(20,184,166,0.25)',
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              See upcoming events →
            </motion.a>
            <motion.a
              href="/resources"
              whileHover={{ scale: 1.04, borderColor: C.cyan, color: C.cyan }}
              whileTap={{ scale: 0.97 }}
              style={{
                border: `1px solid ${C.border}`,
                color: C.muted,
                padding: isMobile ? '13px 24px' : '16px 32px',
                borderRadius: '12px',
                textDecoration: 'none', fontWeight: 600,
                fontSize: isMobile ? '14px' : '16px',
                transition: 'all 0.2s ease', display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              Browse resources
            </motion.a>
          </motion.div>
        </div>

        {/* ── Mobile: ticker strip ── */}
        {isMobile && announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              marginTop: '40px',
            }}
          >
            {/* Label above ticker */}
            <div style={{
              textAlign: 'center',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontSize: '10px',
              color: '#4B5563',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              tap to read announcements
            </div>
            <MobileTicker
              announcements={announcements}
              onOpenPopup={setActivePopup}
            />
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute', bottom: '40px',
            left: '0',
right: '0',
margin: '0 auto',
width: 'fit-content',
            color: C.muted, fontSize: '14px',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            zIndex: 2,
          }}
        >
          <span>scroll</span>
          <div style={{ width: '1px', height: '32px', backgroundColor: C.border }} />
        </motion.div>
      </motion.section>
    </div>
  )
}
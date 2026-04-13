import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, animate } from 'framer-motion'

// ── Theme (matches your existing C.* pattern) ─────────────────
const C = {
  bg: '#0D1117',
  fg: '#E6EDF3',
  muted: '#7D8590',
  border: '#21262D',
  purple: '#A371F7',
  cyan: '#39D0D8',
  green: '#3FB950',
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => !document.hidden)

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return visible
}

function useVisibleInterval(callback, delay, enabled = true) {
  const visible = usePageVisible()

  useEffect(() => {
    if (!enabled || !visible) return
    const id = setInterval(callback, delay)
    return () => clearInterval(id)
  }, [callback, delay, enabled, visible])
}

// ── Links Data ────────────────────────────────────────────────
const LINKS = [
  {
    id: 'github',
    label: 'GitHub',
    sub: 'Star our repos',
    href: '#',
    color: '#E6EDF3',
    accent: '#A371F7',
    stat: '420+',
    statLabel: 'Stars',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
  },
  {
    id: 'discord',
    label: 'Discord',
    sub: 'Join the server',
    href: '#',
    color: '#5865F2',
    accent: '#5865F2',
    stat: '1K+',
    statLabel: 'Members',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    sub: 'Follow our journey',
    href: '#',
    color: '#E1306C',
    accent: '#E1306C',
    stat: '1K+',
    statLabel: 'Followers',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    sub: 'Connect with us',
    href: '#',
    color: '#0A66C2',
    accent: '#0A66C2',
    stat: '1K+',
    statLabel: 'Connections',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    sub: 'Community chat',
    href: '#',
    color: '#25D366',
    accent: '#25D366',
    stat: '1K+',
    statLabel: 'Members',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    sub: "Let's talk",
    href: '#',
    color: '#39D0D8',
    accent: '#39D0D8',
    stat: null,
    statLabel: "Let's Talk!",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
  },
]

// ── Animated Terminal Cursor ──────────────────────────────────
function TerminalCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
      style={{
        display: 'inline-block',
        width: '10px',
        height: '1.1em',
        backgroundColor: C.cyan,
        verticalAlign: 'text-bottom',
        marginLeft: '3px',
        borderRadius: '1px',
      }}
    />
  )
}

// ── Glitch Text ───────────────────────────────────────────────
function GlitchText({ text, color }) {
  const [glitching, setGlitching] = useState(false)
  const chars = '!<>-_\\/[]{}—=+*^?#@$%&'
  const glitchTimeoutRef = useRef(null)

  useVisibleInterval(() => {
    setGlitching(true)
    if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
    glitchTimeoutRef.current = setTimeout(() => setGlitching(false), 200)
  }, 3000 + Math.random() * 4000)

  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current)
    }
  }, [])

  return (
    <span style={{ position: 'relative', color }}>
      {glitching ? (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.4, 1, 0.6, 1] }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'inline-block',
            filter: 'blur(0.5px)',
          }}
        >
          {text.split('').map((ch, i) =>
            Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : ch
          ).join('')}
        </motion.span>
      ) : text}
    </span>
  )
}

// ── SSH Terminal Bot ──────────────────────────────────────────
// The unique centerpiece: an SSH-style bot face
// Eyes track the cursor, "face" reacts to hover
function SSHBot({ mouseX, mouseY }) {
  const containerRef = useRef(null)
  const [eyeAngles, setEyeAngles] = useState({ left: 0, right: 0 })
  const [eyeDist, setEyeDist] = useState({ left: 0, right: 0 })
  const [blinking, setBlinking] = useState(false)
  const [mood, setMood] = useState('idle') // idle | focused | happy
  const blinkTimeoutRef = useRef(null)

  // Blink randomly
  const blink = useCallback(() => {
    setBlinking(true)
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current)
    blinkTimeoutRef.current = setTimeout(() => setBlinking(false), 130)
  }, [])

  useVisibleInterval(() => {
    blink()
    if (Math.random() > 0.6) {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current)
      blinkTimeoutRef.current = setTimeout(blink, 250)
    }
  }, 2500 + Math.random() * 2000)

  useEffect(() => {
    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const leftEyeX = cx - 22
    const leftEyeY = cy - 8
    const rightEyeX = cx + 22
    const rightEyeY = cy - 8

    const laX = mouseX - leftEyeX, laY = mouseY - leftEyeY
    const raX = mouseX - rightEyeX, raY = mouseY - rightEyeY

    const leftAngle = Math.atan2(laY, laX)
    const rightAngle = Math.atan2(raY, raX)
    const leftDist = Math.min(Math.hypot(laX, laY), 100) / 100
    const rightDist = Math.min(Math.hypot(raX, raY), 100) / 100

    setEyeAngles({ left: leftAngle, right: rightAngle })
    setEyeDist({ left: leftDist, right: rightDist })

    const dist = Math.hypot(mouseX - cx, mouseY - cy)
    if (dist < 160) setMood('focused')
    else setMood('idle')
  }, [mouseX, mouseY])

  const pupilOffset = (angle, dist) => ({
    x: Math.cos(angle) * 5 * dist,
    y: Math.sin(angle) * 5 * dist,
  })

  const lp = pupilOffset(eyeAngles.left, eyeDist.left)
  const rp = pupilOffset(eyeAngles.right, eyeDist.right)

  const eyeScaleY = blinking ? 0.05 : 1

  return (
    <div
      ref={containerRef}
      style={{
        width: '120px',
        height: '120px',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Outer shell */}
      <motion.div
        animate={{
          boxShadow: mood === 'focused'
            ? `0 0 0 1px ${C.cyan}50, 0 0 30px ${C.cyan}30, 0 0 60px ${C.cyan}10`
            : `0 0 0 1px ${C.border}, 0 8px 32px rgba(0,0,0,0.6)`,
        }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '22px',
          backgroundColor: '#0D1117',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        {/* Scanline overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(57,208,216,0.015) 3px, rgba(57,208,216,0.015) 4px)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${C.cyan}08 1px, transparent 1px), linear-gradient(90deg, ${C.cyan}08 1px, transparent 1px)`,
          backgroundSize: '14px 14px',
          pointerEvents: 'none',
        }} />

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '18px',
          backgroundColor: '#161B26',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px',
        }}>
          {['#FF5F57','#FFBD2E','#28CA42'].map((c, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c, opacity: 0.8 }} />
          ))}
          <span style={{ marginLeft: '4px', fontSize: '7px', color: C.muted, fontFamily: 'monospace', opacity: 0.6 }}>
            bot@kpdev ~
          </span>
        </div>

        {/* Eyes */}
        <div style={{ display: 'flex', gap: '18px', marginTop: '10px', position: 'relative', zIndex: 3 }}>
          {[lp, rp].map((pupil, i) => (
            <div key={i} style={{
              width: '28px', height: '28px',
              borderRadius: '8px',
              backgroundColor: '#0a0e16',
              border: `1.5px solid ${C.cyan}60`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              boxShadow: `inset 0 0 8px ${C.cyan}20`,
            }}>
              <motion.div
                animate={{ scaleY: eyeScaleY, x: pupil.x, y: pupil.y }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                style={{
                  width: '10px', height: '10px',
                  borderRadius: '50%',
                  backgroundColor: C.cyan,
                  boxShadow: `0 0 6px ${C.cyan}, 0 0 12px ${C.cyan}80`,
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                {/* Pupil glare */}
                <div style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '3px', height: '3px',
                  borderRadius: '50%', backgroundColor: 'white', opacity: 0.7,
                }} />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Mouth — status bar */}
        <motion.div
          animate={{
            width: mood === 'focused' ? '52px' : '36px',
            backgroundColor: mood === 'focused' ? `${C.cyan}30` : `${C.border}`,
          }}
          transition={{ duration: 0.3 }}
          style={{
            height: '4px', borderRadius: '2px',
            position: 'relative', zIndex: 3,
          }}
        >
          <motion.div
            animate={{ width: mood === 'focused' ? '100%' : '40%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ height: '100%', backgroundColor: C.cyan, borderRadius: '2px' }}
          />
        </motion.div>

        {/* Status text */}
        <div style={{
          position: 'absolute', bottom: '6px',
          fontFamily: 'monospace', fontSize: '6px',
          color: mood === 'focused' ? C.cyan : C.muted,
          opacity: 0.6, letterSpacing: '0.05em',
          zIndex: 3, transition: 'color 0.3s',
        }}>
          {mood === 'focused' ? '● ONLINE' : '○ IDLE'}
        </div>
      </motion.div>
    </div>
  )
}

// ── Link Card ─────────────────────────────────────────────────
function LinkCard({ link, index }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 600)
  }

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      style={{ textDecoration: 'none' }}
    >
      <motion.div
        animate={{
          borderColor: hovered ? `${link.color}60` : `${C.border}`,
          backgroundColor: hovered ? `${link.color}08` : '#111720',
          y: hovered ? -3 : 0,
          boxShadow: hovered
            ? `0 8px 30px ${link.color}20, 0 0 0 1px ${link.color}30`
            : '0 2px 8px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          border: '1px solid',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ripple on click */}
        {clicked && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', left: '50%', top: '50%',
              width: '80px', height: '80px',
              borderRadius: '50%',
              backgroundColor: link.color,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Left accent bar */}
        <motion.div
          animate={{ height: hovered ? '70%' : '30%', opacity: hovered ? 1 : 0.4 }}
          style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '3px', borderRadius: '0 2px 2px 0',
            backgroundColor: link.color,
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{ color: hovered ? link.color : C.muted, scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0, marginLeft: '4px' }}
        >
          {link.icon}
        </motion.div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              color: C.fg,
              fontFamily: '"Fira Code", monospace',
              letterSpacing: '-0.01em',
            }}>
              {link.label}
            </span>
            <span style={{
              fontSize: '10px',
              color: C.muted,
              fontFamily: '"Fira Code", monospace',
              opacity: 0.6,
            }}>
              {link.sub}
            </span>
          </div>
          {link.stat && (
            <div style={{
              marginTop: '3px',
              fontSize: '11px',
              fontFamily: '"Fira Code", monospace',
              color: link.color,
              opacity: 0.8,
            }}>
              <span style={{ fontWeight: 700 }}>{link.stat}</span>
              <span style={{ color: C.muted, marginLeft: '4px' }}>{link.statLabel}</span>
            </div>
          )}
          {!link.stat && (
            <div style={{
              marginTop: '3px',
              fontSize: '11px',
              fontFamily: '"Fira Code", monospace',
              color: link.color,
              opacity: 0.8,
            }}>
              {link.statLabel}
            </div>
          )}
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
          style={{ color: link.color, flexShrink: 0 }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </motion.div>
      </motion.div>
    </motion.a>
  )
}

// ── Animated SSH command line ─────────────────────────────────
function SSHLine() {
  const commands = [
    'ssh connect --all-channels',
    'git clone https://kpdev.io',
    'npm install @kpdev/connect',
    'ping discord.kpdev.io',
  ]
  const [cmdIndex, setCmdIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const isVisible = usePageVisible()
  const nextCmdTimeoutRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return

    const cmd = commands[cmdIndex]
    let i = 0
    setDisplayed('')
    setTyping(true)
    const iv = setInterval(() => {
      i++
      setDisplayed(cmd.slice(0, i))
      if (i >= cmd.length) {
        clearInterval(iv)
        setTyping(false)
        nextCmdTimeoutRef.current = setTimeout(() => {
          setCmdIndex(prev => (prev + 1) % commands.length)
        }, 2200)
      }
    }, 45)

    return () => {
      clearInterval(iv)
      if (nextCmdTimeoutRef.current) clearTimeout(nextCmdTimeoutRef.current)
    }
  }, [cmdIndex, isVisible])

  return (
    <div style={{
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
      fontSize: '12px',
      color: C.muted,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}>
      <span style={{ color: C.green }}>❯</span>
      <span style={{ color: C.cyan, opacity: 0.5 }}>~/connect</span>
      <span style={{ color: C.muted, opacity: 0.4 }}>$</span>
      <span style={{ color: C.fg }}>{displayed}</span>
      {typing && <TerminalCursor />}
    </div>
  )
}

// ── Main Connect Section ──────────────────────────────────────
export default function Connect() {
  const sectionRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [rawMouse, setRawMouse] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const moveRafRef = useRef(null)

useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768)
  check()
  window.addEventListener('resize', check)
  return () => window.removeEventListener('resize', check)
}, [])

  useEffect(() => {
    if (isMobile) return

    const onMove = (e) => {
      if (moveRafRef.current) return
      const { clientX, clientY } = e
      moveRafRef.current = requestAnimationFrame(() => {
        setRawMouse({ x: clientX, y: clientY })
        moveRafRef.current = null
      })
    }

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (moveRafRef.current) cancelAnimationFrame(moveRafRef.current)
    }
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: C.bg,
        borderTop: `1px solid ${C.border}`,
        padding: '80px 0 100px',
        overflow: 'hidden',
      }}
    >
      {/* Background noise texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -10%, ${C.cyan}06, transparent)`,
        pointerEvents: 'none',
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${C.border}40 1px, transparent 1px), linear-gradient(90deg, ${C.border}40 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        opacity: 0.3,
      }} />

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: isMobile ? '0 20px' : '0 48px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '52px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '24px', height: '1px', backgroundColor: C.cyan }} />
            <span style={{
              color: C.cyan, fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: '"Fira Code", monospace',
            }}>
              sys.connect()
            </span>
          </div>
          <h2 style={{
            margin: '10px 0 0',
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 900,
            color: C.fg,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            Find Us Online
          </h2>
          <p style={{
            marginTop: '14px',
            fontSize: '14px',
            color: C.muted,
            fontFamily: '"Fira Code", monospace',
            lineHeight: 1.7,
            maxWidth: '480px',
          }}>
            <GlitchText text="// We hang out everywhere devs do." color={C.muted} />
            {' '}Drop in, star a repo, or just say hi.
          </p>
        </motion.div>

        {/* Main layout */}
        <div style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 280px',
  gap: isMobile ? '24px' : '48px',
  alignItems: 'start',
}}>

          {/* Left: link grid */}
          <div style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: '12px',
}}>
            {LINKS.map((link, i) => (
              <LinkCard key={link.id} link={link} index={i} />
            ))}
          </div>

          {/* Right: bot + terminal */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              position: 'sticky',
              top: '80px',
            }}
          >
            {/* Bot face */}
            <SSHBot mouseX={rawMouse.x} mouseY={rawMouse.y} />

            {/* Bot speech bubble */}
            <div style={{
              backgroundColor: '#111720',
              border: `1px solid ${C.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
              width: '100%',
              position: 'relative',
            }}>
              {/* Bubble pointer */}
              <div style={{
                position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
                width: '10px', height: '6px',
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: `6px solid ${C.border}`,
              }} />

              {/* Terminal prompt */}
              <SSHLine />

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: C.border, margin: '10px 0' }} />

              {/* Status rows */}
              {[
                { label: 'uptime', value: '99.9%', color: C.green },
                { label: 'members', value: '4K+', color: C.cyan },
                { label: 'repos', value: '12', color: C.purple },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '10px', fontFamily: '"Fira Code", monospace',
                  marginBottom: '4px',
                }}>
                  <span style={{ color: C.muted }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Decorative tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
              {['#OpenSource', '#BuildInPublic', '#DevCommunity'].map(tag => (
                <span key={tag} style={{
                  fontSize: '9px',
                  fontFamily: '"Fira Code", monospace',
                  color: C.purple,
                  backgroundColor: `${C.purple}10`,
                  border: `1px solid ${C.purple}25`,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  letterSpacing: '0.04em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Code2,
  CalendarDays,
  BookOpen,
  Radio,
  Menu,
  X,
} from 'lucide-react'

const C = {
  bg: '#090D14',
  card: '#111825',
  border: '#1e2a3a',
  cyan: '#14B8A6',
  purple: '#8B5CF6',
  fg: '#E8EAED',
  muted: '#5a6880',
}

const navItems = [
  { icon: Home,         label: 'Home',    path: '/' },
  { icon: CalendarDays, label: 'Events',  path: '/events' },
  { icon: BookOpen,     label: 'Docs',    path: '/resources' },
]

const terminalLines = [
  '> npm run dev',
  '> git push origin main',
  '> docker compose up',
  '> python train.py',
  '> node server.js',
  '> cargo build --release',
]

function TerminalTicker() {
  const [idx, setIdx] = useState(0)
  const idxRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % terminalLines.length
      setIdx(idxRef.current)
    }, 2200)

    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ width: '100%', overflow: 'hidden', padding: '2px 0', textAlign: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          style={{
            color: C.cyan,
            fontSize: '8px',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 6px',
          }}
        >
          {terminalLines[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function getNudge(index, hoveredIndex) {
  if (hoveredIndex === null || index === hoveredIndex) return { y: 0, scale: 1, opacity: 1 }
  const diff = index - hoveredIndex
  if (Math.abs(diff) === 1) return { y: diff > 0 ? 7 : -7, scale: 0.95, opacity: 0.7 }
  if (Math.abs(diff) === 2) return { y: diff > 0 ? 3 : -3, scale: 0.97, opacity: 0.85 }
  return { y: 0, scale: 1, opacity: 1 }
}

export default function Navbar() {
  const location = useLocation()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  if(location.pathname === "/admin" || location.pathname === "/login") {
    return null
  }

  // ── MOBILE LAYOUT ─────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Top bar: logo left, hamburger right */}
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '16px',
            paddingRight: '16px',
            // backgroundColor: C.bg,
            // borderBottom: `1px solid ${C.border}`,
            zIndex: 200,
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              style={{ position: 'relative', width: '40px', height: '40px', cursor: 'pointer' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: '-3px', borderRadius: '50%',
                  background: `conic-gradient(from 0deg, ${C.cyan}, ${C.purple} 50%, transparent 50%)`,
                  zIndex: 0,
                }}
              />
              <div style={{
                position: 'absolute', inset: '-1px', borderRadius: '50%',
                backgroundColor: C.bg, zIndex: 1,
              }} />
              <div style={{
                position: 'absolute', inset: '3px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2, overflow: 'hidden',
              }}>
                <img
                  src="/logo.png"
                  alt="KP Dev Cell logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          </Link>

          {/* Brand name */}
          <span style={{
            color: C.fg,
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: '"Fira Code", monospace',
            flex: 1,
            marginLeft: '12px',
          }}>
            KP DEV CELL
          </span>

          {/* Hamburger / Close button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMobileOpen(prev => !prev)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: mobileOpen ? `${C.cyan}18` : C.card,
              border: `1px solid ${mobileOpen ? C.cyan + '55' : C.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: mobileOpen ? C.cyan : C.muted,
              transition: 'all 0.2s ease',
            }}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Bottom sheet overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 150,
                }}
              />

              {/* Bottom sheet */}
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  position: 'fixed',
                  bottom: 0, left: 0, right: 0,
                  backgroundColor: C.card,
                  borderTop: `1px solid ${C.border}`,
                  borderRadius: '20px 20px 0 0',
                  zIndex: 160,
                  paddingBottom: '32px',
                  paddingTop: '8px',
                  boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
                }}
              >
                {/* Drag handle */}
                <div style={{
                  width: '36px', height: '4px',
                  backgroundColor: C.border,
                  borderRadius: '2px',
                  margin: '0 auto 20px',
                }} />

                {/* Terminal ticker */}
                <div style={{
                  padding: '8px 20px 16px',
                  borderBottom: `1px solid ${C.border}`,
                  marginBottom: '8px',
                }}>
                  <TerminalTicker />
                </div>

                {/* Nav items */}
                {navItems.map((item, i) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.25 }}
                    >
                      <Link
                        to={item.path}
                        style={{ textDecoration: 'none', display: 'block' }}
                        onClick={() => setMobileOpen(false)}
                      >
                        <motion.div
                          whileTap={{ scale: 0.97 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '14px 24px',
                            backgroundColor: isActive ? `${C.cyan}10` : 'transparent',
                            borderLeft: isActive ? `3px solid ${C.cyan}` : '3px solid transparent',
                            color: isActive ? C.cyan : C.muted,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Icon size={20} strokeWidth={1.8} />
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            fontFamily: '"Fira Code", monospace',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}>
                            {item.label}
                          </span>
                          {isActive && (
                            <motion.div
                              layoutId="mobile-active-dot"
                              style={{
                                marginLeft: 'auto',
                                width: '6px', height: '6px',
                                borderRadius: '50%',
                                backgroundColor: C.cyan,
                              }}
                            />
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Live indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '16px 24px 0',
                  borderTop: `1px solid ${C.border}`,
                  marginTop: '8px',
                }}>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.cyan }}
                  />
                  <span style={{
                    color: C.muted, fontSize: '10px',
                    fontFamily: '"Fira Code", monospace', letterSpacing: '0.06em',
                  }}>
                    live · updated regularly
                  </span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // ── DESKTOP LAYOUT (unchanged) ────────────────────────────
  return (
    <nav
      style={{
        position: 'fixed',
        left: 0, top: 0,
        height: '100vh',
        width: '90px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '22px',
        paddingBottom: '20px',
        zIndex: 100,
      }}
    >
      {/* ── TOP: Logo + ticker ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            style={{ position: 'relative', width: '56px', height: '56px', cursor: 'pointer' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-3px', borderRadius: '50%',
                background: `conic-gradient(from 0deg, ${C.cyan}, ${C.purple} 50%, transparent 50%)`,
                zIndex: 0,
              }}
            />
            <div style={{
              position: 'absolute', inset: '-1px', borderRadius: '50%',
              backgroundColor: C.bg, zIndex: 1,
            }} />
            <div style={{
              position: 'absolute', inset: '3px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2, overflow: 'hidden',
            }}>
              <img
                src="/logo.png"
                alt="KP Dev Cell logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </motion.div>
        </Link>
        <TerminalTicker />
      </div>

      {/* ── MIDDLE: Nav icons ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          const isHovered = hoveredIndex === index
          const nudge = getNudge(index, hoveredIndex)

          return (
            <div key={index}>
              {item.dividerBefore && (
                <div style={{
                  width: '36px', height: '1px',
                  background: `linear-gradient(to right, transparent, ${C.border}, transparent)`,
                  margin: '4px auto 12px',
                }} />
              )}

              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link to={item.path} style={{ textDecoration: 'none', display: 'block' }}>
                  <motion.div
                    animate={{
                      y: nudge.y,
                      scale: isHovered ? 1.3 : nudge.scale,
                      opacity: nudge.opacity,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '16px',
                      margin: '8px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: isActive || isHovered ? 'rgba(20,184,166,0.08)' : C.card,
                      border: isActive || isHovered ? `1px solid rgba(20,184,166,0.45)` : `1px solid ${C.border}`,
                      color: isActive || isHovered ? C.cyan : C.muted,
                      boxShadow: isActive || isHovered ? `0 0 22px rgba(20,184,166,0.12)` : `0 2px 8px rgba(0,0,0,0.25)`,
                    }}
                  >
                    <AnimatePresence>
                      {(isActive || isHovered) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 28, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{
                            position: 'absolute', left: 0, top: '50%',
                            transform: 'translateY(-50%)',
                            width: '3px',
                            background: `linear-gradient(to bottom, ${C.cyan}, ${C.purple})`,
                            borderRadius: '0 3px 3px 0',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {(isActive || isHovered) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: 'absolute', inset: 0,
                            background: `radial-gradient(circle at center, rgba(20,184,166,0.18), transparent 70%)`,
                            borderRadius: '16px',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.div
                      animate={{
                        rotate: isHovered ? [-10, 10, 0] : 0,
                        scale: isHovered ? 1.2 : 1,
                        y: isHovered || isActive ? -5 : 0,
                      }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      <Icon size={22} strokeWidth={1.8} />
                    </motion.div>

                    <motion.span
                      animate={{
                        opacity: isHovered || isActive ? 1 : 0,
                        y: isHovered || isActive ? 0 : 4,
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        bottom: '7px',
                        zIndex: 1,
                        fontSize: '7.5px',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: '"Fira Code", monospace',
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                </Link>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -16, scale: 0.93 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -6, scale: 0.93 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        left: 'calc(100% + 14px)',
                        top: '50%',
                        transform: 'translateY(-80%)',
                        backgroundColor: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: '9px',
                        padding: '7px 13px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 200,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
                      }}
                    >
                      <span style={{
                        color: C.fg, fontSize: '12px', fontWeight: 500,
                        fontFamily: '"Fira Code", monospace',
                      }}>
                        <span style={{ color: C.cyan }}>/</span>
                        {item.label.toLowerCase()}
                      </span>
                      <div style={{
                        position: 'absolute', left: '-5px', top: '50%',
                        transform: 'translateY(-50%) rotate(45deg)',
                        width: '8px', height: '8px',
                        backgroundColor: C.card,
                        border: `1px solid ${C.border}`,
                        borderRight: 'none', borderTop: 'none',
                      }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── BOTTOM: Pulse + brand ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.cyan }}
          />
          <span style={{
            color: C.muted, fontSize: '8px',
            fontFamily: '"Fira Code", monospace', letterSpacing: '0.06em',
          }}>
            live
          </span>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} style={{ textAlign: 'center', cursor: 'default' }}>
          <span style={{
            color: C.fg, fontSize: '8px', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            lineHeight: 1.6, display: 'block',
            fontFamily: '"Fira Code", monospace',
          }}>
            KP<br />DEV<br />CELL
          </span>
        </motion.div>
      </div>
    </nav>
  )
}
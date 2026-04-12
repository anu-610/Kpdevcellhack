import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Lock } from 'lucide-react'
import AdminLoginModal from './AdminLoginModal'
function MountainLogo() {
  return (
    <img
      src="/logo.png"
      alt=""
      style={{
        width: 38,
        height: 38,
        objectFit: 'contain',
        flexShrink: 0,
        filter: 'invert(1) hue-rotate(135deg)',  // tweak hue-rotate to match your teal color
      }}
    />
  )
}

// Order: Home · Events · Resources · Highlights · Team · About
const navLinks = [
  { path: '/',           label: 'Home' },
  { path: '/events',     label: 'Events' },
  { path: '/resources',  label: 'Resources' },
  { path: '/highlights', label: 'Highlights' },
  { path: '/team',       label: 'Team' },
  { path: '/about',      label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isActive = (p) => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: scrolled ? 'rgba(6,8,10,0.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'background 0.35s, backdrop-filter 0.35s, border-color 0.35s',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0, minWidth: 160 }}>
          <MountainLogo />
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#fff', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '-0.01em', display: 'block', lineHeight: 1.15 }}>
              Kamand Prompt
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(0,255,136,0.5)', fontSize: '0.54rem', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block' }}>
              · IIT Mandi
            </span>
          </div>
        </Link>

        {/* Centered glass pill — desktop */}
        <nav className="kp-desk-nav" style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 2,
          padding: '5px 7px',
          background: 'rgba(8,12,16,0.8)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 100,
          boxShadow: '0 2px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          {navLinks.map(({ path, label }) => {
            const active = isActive(path)
            return (
              <Link key={path} to={path} style={{
                padding: '6px 13px', borderRadius: 100,
                fontSize: '0.78rem', fontWeight: active ? 600 : 400,
                textDecoration: 'none',
                color: active ? '#00ff88' : 'rgba(195,210,225,0.72)',
                background: active ? 'rgba(0,255,136,0.1)' : 'transparent',
                border: `1px solid ${active ? 'rgba(0,255,136,0.2)' : 'transparent'}`,
                transition: 'all 0.18s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(195,210,225,0.72)'; e.currentTarget.style.background = 'transparent' } }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right spacer + mobile btn */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 160 }}>
          <button className="kp-mob-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{
            background: 'rgba(8,12,16,0.8)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
            color: '#8a9aaa', cursor: 'pointer', width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', top: 62, left: 0, right: 0, zIndex: 39,
        overflow: 'hidden', maxHeight: mobileOpen ? 440 : 0,
        transition: 'max-height 0.3s ease',
        background: 'rgba(5,8,11,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: mobileOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}>
        <div style={{ padding: '10px 16px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navLinks.map(({ path, label }) => {
            const active = isActive(path)
            return (
              <Link key={path} to={path} style={{
                padding: '11px 14px', borderRadius: 10, textDecoration: 'none',
                fontSize: '0.9rem', fontWeight: active ? 600 : 400,
                color: active ? '#00ff88' : 'rgba(175,195,210,0.75)',
                background: active ? 'rgba(0,255,136,0.07)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Floating Admin */}
      <button onClick={() => setShowLoginModal(true)} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px',
        background: 'rgba(6,9,13,0.88)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
        color: '#627080', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500,
        transition: 'border-color 0.15s, color 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.38)'; e.currentTarget.style.color = '#00ff88' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#627080' }}
      >
        <Lock size={13} /> Admin
      </button>

      <AdminLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <style>{`
        @media (max-width: 860px) { .kp-desk-nav { display: none !important; } }
        @media (min-width: 861px) { .kp-mob-btn  { display: none !important; } }
      `}</style>
    </>
  )
}
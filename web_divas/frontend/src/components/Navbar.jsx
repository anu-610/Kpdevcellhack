import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const NAV_LINKS = [
  { to: '/',         label: 'home'     },
  { to: '/team',     label: 'team'     },
  { to: '/projects', label: 'projects' },
  { to: '/events',   label: 'events'   },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        {/* Logo */}
        <NavLink to="/" style={s.logo}>
          <span style={s.logoIcon}>⬡</span>
          <div>
            <div style={s.logoTitle}>KP DEV CELL</div>
            <div style={s.logoSub}>kammand prompt club · iit mandi</div>
          </div>
        </NavLink>

        {/* Desktop links */}
        <div style={s.links}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              ...s.link, ...(isActive ? s.linkActive : {})
            })}>
              <span style={{ color: 'var(--accent)', marginRight: 4 }}>./</span>{label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/admin" style={({ isActive }) => ({
                ...s.link, color: 'var(--accent3)', ...(isActive ? { ...s.linkActive, borderColor: 'var(--accent3)' } : {})
              })}>
                <span style={{ color: 'var(--accent3)', marginRight: 4 }}>⚙</span>admin
              </NavLink>
              <button onClick={handleLogout} style={s.logoutBtn}>logout</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary" style={{ fontSize: 12, padding: '7px 16px' }}>
              $ login
            </NavLink>
          )}
        </div>

        <button style={s.burger} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
      </div>

      {open && (
        <div style={s.mobileMenu}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              ...s.mobileLink, ...(isActive ? { color: 'var(--accent)' } : {})
            })} onClick={() => setOpen(false)}>
              <span style={{ color: 'var(--accent)' }}>./</span>{label}
            </NavLink>
          ))}
          {user
            ? <button onClick={() => { handleLogout(); setOpen(false) }} style={{ ...s.mobileLink, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', textAlign: 'left' }}>logout</button>
            : <NavLink to="/login" style={s.mobileLink} onClick={() => setOpen(false)}>./login</NavLink>
          }
        </div>
      )}
    </nav>
  )
}

const s = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border-dim)',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 32px',
    height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' },
  logoIcon: { fontSize: '1.4rem', color: 'var(--accent)', lineHeight: 1 },
  logoTitle: { fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', color: 'var(--text-primary)', letterSpacing: '1px' },
  logoSub: { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.5px', marginTop: 2 },
  links: { display: 'flex', alignItems: 'center', gap: 4 },
  link: {
    fontFamily: 'var(--font-mono)', fontSize: '13px',
    color: 'var(--text-secondary)', textDecoration: 'none',
    padding: '6px 12px', borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    transition: 'all 0.15s',
  },
  linkActive: {
    color: 'var(--accent)',
    background: 'transparent',
    borderColor: 'var(--accent)',
  },
  logoutBtn: {
    fontFamily: 'var(--font-mono)', fontSize: '13px',
    color: 'var(--danger)', background: 'none',
    border: '1px solid rgba(248,113,113,0.25)',
    padding: '6px 14px', borderRadius: 'var(--radius-md)',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  burger: { display: 'none', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' },
  mobileMenu: {
    borderTop: '1px solid var(--border-dim)',
    background: 'var(--bg-surface)',
    padding: '8px 32px 16px',
    display: 'flex', flexDirection: 'column', gap: 2,
  },
  mobileLink: {
    fontFamily: 'var(--font-mono)', fontSize: '13px',
    color: 'var(--text-secondary)', textDecoration: 'none',
    padding: '10px 0', borderBottom: '1px solid var(--border-dim)',
  },
}

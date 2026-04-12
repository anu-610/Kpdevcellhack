import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, BookOpen, Trophy, FolderOpen, LogOut, Images, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function MountainLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L28 26H4L16 4Z" fill="#00ff88" fillOpacity="0.2" />
      <path d="M16 4L22 16L28 26H16L16 4Z" fill="#00ff88" fillOpacity="0.4" />
      <path d="M16 4L10 14L4 26H16V4Z" stroke="#00ff88" strokeWidth="1.5" fill="none" />
      <path d="M16 4L22 16L28 26" stroke="#00ff88" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

const navItems = [
  { path: '/admin',              label: 'Overview',    icon: LayoutDashboard, end: true },
  { path: '/admin/team',         label: 'Team',        icon: Users },
  { path: '/admin/events',       label: 'Events',      icon: Calendar },
  { path: '/admin/resources',    label: 'Resources',   icon: BookOpen },
  { path: '/admin/achievements', label: 'Achievements',icon: Trophy },
  { path: '/admin/highlights',   label: 'Highlights',  icon: Images },
  { path: '/admin/projects',     label: 'Projects',    icon: FolderOpen },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 768) setSidebarOpen(false)
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!sidebarOpen) return
    const handleClickOutside = (e) => {
      const sidebar = document.getElementById('admin-sidebar')
      const menuBtn = document.getElementById('admin-menu-btn')
      if (sidebar && !sidebar.contains(e.target) && menuBtn && !menuBtn.contains(e.target)) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  const handleSignOut = async () => {
    try { await signOut() } catch (e) { console.error(e) }
    finally { navigate('/', { replace: true }) }
  }

  const fullName  = user?.user_metadata?.full_name || user?.user_metadata?.name || ''
  const email     = user?.email || ''
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''
  const initials  = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() || '?'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', position: 'relative' }}>
      {/* Hamburger button (mobile only) */}
      <button
        id="admin-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1100,
          background: '#0d1218',
          border: '1px solid #1c242f',
          borderRadius: 8,
          width: 40,
          height: 40,
          display: 'none', // hidden by default, shown via media query
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#00ff88',
          backdropFilter: 'blur(4px)',
        }}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - slides in on mobile */}
      <aside
        id="admin-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '260px',
          background: '#060809',
          borderRight: '1px solid #161c24',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'thin',
          scrollbarColor: '#1a2030 transparent',
          zIndex: 1050,
          transition: 'transform 0.25s ease',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: sidebarOpen ? '2px 0 12px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '18px 16px', borderBottom: '1px solid #161c24', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <MountainLogo />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>KP Dev Cell</span>
          </div>
          <span style={{ display: 'block', marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#00ff88' }}>
            Admin Panel
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => { if (window.innerWidth < 768) setSidebarOpen(false) }}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '9px 12px', borderRadius: 10, textDecoration: 'none',
                  border: `1px solid ${isActive ? '#1d3a2d' : 'transparent'}`,
                  background: isActive ? 'rgba(0,255,136,0.07)' : 'transparent',
                  color: isActive ? '#fff' : '#7a8694',
                  fontSize: '0.86rem', fontWeight: 500,
                  transition: 'all 0.15s', position: 'relative',
                })}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span style={{ position: 'absolute', left: 0, top: 7, bottom: 7, width: 3, borderRadius: '0 3px 3px 0', background: '#00ff88' }} />}
                    <item.icon size={16} style={{ color: isActive ? '#00ff88' : 'inherit', flexShrink: 0 }} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div style={{ padding: '10px', borderTop: '1px solid #161c24', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', background: '#0d1218', border: '1px solid #1c242f', borderRadius: 12 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName || 'Admin'} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display = 'none' }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,255,136,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#00ff88', flexShrink: 0 }}>
                {initials}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName || 'Admin'}</p>
              <p style={{ margin: 0, fontSize: '0.68rem', color: '#4a5a6a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</p>
            </div>
            <button onClick={handleSignOut} title="Sign out" style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 7, border: '1px solid #1e2a38', background: 'transparent', color: '#5a6a7a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ff7b7b'; e.currentTarget.style.background = '#2a1418'; e.currentTarget.style.borderColor = '#3d1820' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#5a6a7a'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#1e2a38' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area with left margin on desktop */}
      <main
        style={{
          minWidth: 0,
          overflowX: 'hidden',
          background: '#0a0a0a',
          marginLeft: '260px', // matches sidebar width on desktop
          transition: 'margin-left 0.25s ease',
        }}
      >
        <Outlet />
      </main>

      {/* Responsive CSS via style tag */}
      <style>{`
        @media (max-width: 768px) {
          #admin-menu-btn {
            display: flex !important;
          }
          main {
            margin-left: 0 !important;
            padding-top: 56px;
          }
        }
        @media (min-width: 769px) {
          #admin-sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </div>
  )
}
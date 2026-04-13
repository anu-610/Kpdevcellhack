import { useState, useEffect, useRef } from 'react'
import MembersAdmin from '../components/admin/MembersAdmin.jsx'
import EventsAdmin from '../components/admin/EventsAdmin.jsx'
import AnnouncementsAdmin from '../components/admin/AnnouncementsAdmin.jsx'
import AdminAccessPanel from '../components/admin/AdminAccessPanel.jsx'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'Members',      icon: '👥', cmd: 'members.sh'      },
  { id: 'Events',       icon: '📅', cmd: 'events.sh'       },
  { id: 'Announcements',icon: '📢', cmd: 'announce.sh'     },
  { id: 'Admin Access', icon: '🔐', cmd: 'access.sh'       },
]

/* ── Animated scanline / grid background ── */
function AdminBg() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(20,184,166,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20,184,166,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />
      {/* Radial glow top-left */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '60vw', height: '60vh',
        background: 'radial-gradient(ellipse, rgba(20,184,166,0.055) 0%, transparent 65%)',
      }} />
      {/* Radial glow bottom-right */}
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '50vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(139,91,246,0.045) 0%, transparent 65%)',
      }} />
      {/* Scanline */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
      }} />
    </div>
  )
}

/* ── Blinking terminal cursor ── */
function useVisibleInterval(callback, delay) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    let timerId = null

    const start = () => {
      if (timerId) return
      timerId = setInterval(() => {
        callbackRef.current()
      }, delay)
    }

    const stop = () => {
      if (!timerId) return
      clearInterval(timerId)
      timerId = null
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    start()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [delay])
}

function Cursor({ color = '#14B8A6' }) {
  const [on, setOn] = useState(true)
  useVisibleInterval(() => setOn(v => !v), 530)

  return (
    <span style={{
      display: 'inline-block', width: 8, height: 16,
      background: on ? color : 'transparent',
      verticalAlign: 'middle', marginLeft: 3,
      transition: 'background 0.1s',
    }} />
  )
}

/* ── Top bar ── */
function TopBar({ activeTab, onLogout, isMobile, onMenuToggle, sidebarOpen }) {
  const [time, setTime] = useState(new Date())
  useVisibleInterval(() => setTime(new Date()), 1000)

  const pad = n => String(n).padStart(2, '0')
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  const dateStr = time.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: 'rgba(10,13,18,0.92)',
      borderBottom: '1px solid rgba(20,184,166,0.15)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center',
      padding: '0 28px', height: 52,
      fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace',
    }}>
      {isMobile && (
        <button
          onClick={onMenuToggle}
          aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
          style={{
            marginRight: 12,
            width: 32,
            height: 32,
            borderRadius: 7,
            border: '1px solid rgba(20,184,166,0.3)',
            backgroundColor: 'rgba(20,184,166,0.08)',
            color: '#14B8A6',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          {sidebarOpen ? '×' : '☰'}
        </button>
      )}

      {/* Traffic lights */}
      <div style={{ display: isMobile ? 'none' : 'flex', gap: 7, marginRight: 20, flexShrink: 0 }}>
        {['#FF5F57','#FFBD2E','#28CA41'].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c, opacity: 0.85 }} />
        ))}
      </div>

      {/* Path breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4B5563', minWidth: 0 }}>
        <span style={{ color: '#14B8A6' }}>~/admin</span>
        {!isMobile && <span>/</span>}
        <span
          style={{
            color: '#e2e8f0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: isMobile ? 115 : 'none',
          }}
        >
          {TABS.find(t => t.id === activeTab)?.cmd}
        </span>
        {/* {!isMobile && <Cursor />} */}
      </div>

      <div style={{ flex: 1 }} />

      {/* Right side info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 20, fontSize: 11 }}>
        {!isMobile && <span style={{ color: '#374151' }}>{dateStr}</span>}
        <span style={{ color: '#14B8A6', letterSpacing: '0.08em' }}>{timeStr}</span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          backgroundColor: 'rgba(20,184,166,0.08)',
          border: '1px solid rgba(20,184,166,0.2)',
          borderRadius: 6, padding: '4px 10px',
          display: isMobile ? 'none' : 'flex',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#28CA41', display: 'inline-block' }} />
          <span style={{ color: '#9CA3AF', fontSize: 11 }}>root@kp-admin</span>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: 'none',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 6,
            color: '#ef4444',
            fontFamily: 'inherit',
            fontSize: 11,
            padding: isMobile ? '4px 8px' : '4px 12px',
            cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = 'rgba(239,68,68,0.1)'
            e.target.style.borderColor = 'rgba(239,68,68,0.6)'
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.borderColor = 'rgba(239,68,68,0.3)'
          }}
        >
          {isMobile ? 'logout' : '$ logout'}
        </button>
      </div>
    </div>
  )
}

/* ── Sidebar ── */
function Sidebar({ activeTab, setActiveTab, isMobile, open, onClose }) {
  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    if (isMobile) onClose()
  }

  return (
    <div style={{
      position: 'fixed', top: 52, left: 0, bottom: 0,
      width: isMobile ? '78vw' : 220,
      maxWidth: isMobile ? 300 : 'none',
      zIndex: isMobile ? 120 : 50,
      backgroundColor: 'rgba(10,13,18,0.88)',
      borderRight: '1px solid rgba(20,184,166,0.1)',
      backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
      padding: '20px 0',
      transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
      transition: 'transform 0.2s ease',
    }}>
      {/* Explorer label */}
      <div style={{
        padding: '0 18px 14px',
        fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: '#374151',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        marginBottom: 8,
      }}>
        EXPLORER
      </div>

      {/* Nav items */}
      {TABS.map((tab, i) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 18px',
              background: active ? 'rgba(20,184,166,0.09)' : 'none',
              border: 'none',
              borderLeft: active ? '2px solid #14B8A6' : '2px solid transparent',
              color: active ? '#e2e8f0' : '#6B7280',
              fontFamily: 'inherit',
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.18s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.color = '#9CA3AF'
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.color = '#6B7280'
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12 }}>{tab.id}</div>
              <div style={{ fontSize: 10, color: active ? '#14B8A6' : '#374151', marginTop: 1 }}>
                ./{tab.cmd}
              </div>
            </div>
            {active && (
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                backgroundColor: '#14B8A6',
                boxShadow: '0 0 6px #14B8A6',
              }} />
            )}
          </button>
        )
      })}

      {/* Bottom status */}
      <div style={{ flex: 1 }} />
      <div style={{
        margin: '0 14px',
        padding: '10px 12px',
        backgroundColor: 'rgba(20,184,166,0.05)',
        border: '1px solid rgba(20,184,166,0.12)',
        borderRadius: 8,
        fontSize: 11, color: '#4B5563',
        lineHeight: 1.7,
        display: isMobile ? 'none' : 'block',
      }}>
        <div style={{ color: '#14B8A6', marginBottom: 2 }}>$ sys.status</div>
        <div>db: <span style={{ color: '#28CA41' }}>connected</span></div>
        <div>auth: <span style={{ color: '#28CA41' }}>active</span></div>
        <div>env: <span style={{ color: '#FFBD2E' }}>production</span></div>
      </div>
    </div>
  )
}

/* ── Tab bar (open files) ── */
function TabBar({ activeTab, setActiveTab, isMobile }) {
  return (
    <div style={{
      position: 'fixed', top: 52, left: isMobile ? 0 : 220, right: 0, zIndex: 49,
      backgroundColor: 'rgba(13,17,23,0.9)',
      borderBottom: '1px solid rgba(20,184,166,0.1)',
      padding: '0 6px', height: 38,
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
      backdropFilter: 'blur(10px)',
      overflowX: 'auto',
    }}>
      <div style={{
        minWidth: '100%',
        width: 'max-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0 16px', height: 38,
                background: active ? 'rgba(22,27,38,0.95)' : 'transparent',
                border: 'none',
                borderTop: active ? '1px solid #14B8A6' : '1px solid transparent',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                color: active ? '#e2e8f0' : '#4B5563',
                fontFamily: 'inherit',
                fontSize: 12,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11 }}>{tab.icon}</span>
              {tab.cmd}
              {active && <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#14B8A6', marginLeft: 2 }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main ── */
function AdminPage() {
  const [activeTab, setActiveTab] = useState('Members')
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 900
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    toast.success('Session terminated')
    navigate('/')
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #0D1117; }
        html, body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(20,184,166,0.25); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(20,184,166,0.45); }
      `}</style>

      <AdminBg />
      <TopBar
        activeTab={activeTab}
        onLogout={handleLogout}
        isMobile={isMobile}
        onMenuToggle={() => setSidebarOpen(v => !v)}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} isMobile={isMobile} />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            top: 52,
            backgroundColor: 'rgba(2,6,23,0.55)',
            zIndex: 110,
          }}
        />
      )}

      {/* Content area */}
      <div style={{
        marginLeft: isMobile ? 0 : 220,
        marginTop: 52 + 38,
        minHeight: 'calc(100vh - 90px)',
        position: 'relative', zIndex: 1,
        padding: isMobile ? '18px 14px 22px' : '28px 32px',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
      }}>
        {/* Breadcrumb header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: '#4B5563',
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          <span style={{ color: '#14B8A6' }}>$</span>
          <span>executing</span>
          <span style={{ color: '#e2e8f0' }}>./{TABS.find(t => t.id === activeTab)?.cmd}</span>
          <span style={{ color: '#374151' }}>{isMobile ? '--mobile' : '--mode=interactive'}</span>
          <Cursor />
        </div>

        {/* Panel */}
        <div key={activeTab} style={{ animation: 'fadeIn 0.22s ease' }}>
          {activeTab === 'Members'       && <MembersAdmin />}
          {activeTab === 'Events'        && <EventsAdmin />}
          {activeTab === 'Announcements' && <AnnouncementsAdmin />}
          {activeTab === 'Admin Access'  && <AdminAccessPanel />}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

export default AdminPage
import { useState, useEffect, useRef } from 'react'
import { signInWithEmailAndPassword, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SYMBOLS = [
  '<', '>', '{', '}', '/', '<>', '</>', '...', '?', ':', '&&', '||', '{{', '}}',
  '{/*', '*/}', '"', "'", '`', '(', ')', '.', '&', '=>', '!=', '===', '++', '--',
  '//', '/*', '*/', '0', '1', 'const', 'let', 'return', 'null', 'true', 'false',
  'if', 'else', 'for', 'import', 'export', 'class', 'async', 'await', '[]', ';', '~', '**', '!', 'typeof', 'new',
]

function randomColor() {
  const r = Math.random()
  const a = (Math.random() * 0.2 + 0.04).toFixed(2)
  if (r < 0.52) return `rgba(20,184,166,${a})`
  if (r < 0.78) return `rgba(139,181,246,${a})`
  return `rgba(139,91,246,${a})`
}

function makeParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    size: Math.random() * 6 + 11,
    color: randomColor(),
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.32,
    life: Math.random(),
    lifeSpeed: Math.random() * 0.004 + 0.001,
    lifeDir: Math.random() > 0.5 ? 1 : -1,
    angle: Math.random() * Math.PI * 2,
    rot: (Math.random() - 0.5) * 0.012,
  }
}

function CodeBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []
    const COUNT = 240

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < COUNT; i++) {
      particles.push(makeParticle(canvas.width, canvas.height))
    }

    function animate() {
      animId = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.angle += p.rot
        p.life += p.lifeSpeed * p.lifeDir
        if (p.life >= 1 || p.life <= 0) p.lifeDir *= -1
        if (p.x < -80) p.x = canvas.width + 20
        if (p.x > canvas.width + 80) p.x = -20
        if (p.y < -40) p.y = canvas.height + 10
        if (p.y > canvas.height + 40) p.y = -10
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.globalAlpha = p.life * 0.88
        ctx.font = `${p.size}px 'Courier New', monospace`
        ctx.fillStyle = p.color
        ctx.fillText(p.sym, 0, 0)
        ctx.restore()
      }
    }

    animate()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%', zIndex: 0,
      }}
    />
  )
}

function DevLogo() {
  return (
    <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute', width: 7, height: 7, borderRadius: '50%',
        background: '#14B8A6', boxShadow: '0 0 8px #14B8A6',
        transformOrigin: '50% 50%',
        animation: 'orbitA 2.8s linear infinite',
      }} />
      <div style={{
        position: 'absolute', width: 5, height: 5, borderRadius: '50%',
        background: '#8B5CF6', boxShadow: '0 0 6px #8B5CF6',
        transformOrigin: '50% 50%',
        animation: 'orbitB 4s linear infinite reverse',
      }} />
      <svg width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'ringPulse 3s ease-in-out infinite' }}>
        <defs>
          <linearGradient id="chevL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="chevR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="slashG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <circle cx="27" cy="27" r="26" fill="none" stroke="rgba(20,184,166,0.18)" strokeWidth="1" />
        <circle cx="27" cy="27" r="20" fill="none" stroke="rgba(139,91,246,0.12)" strokeWidth="0.5" strokeDasharray="3 4" />
        <path d="M22 13 L10 27 L22 41" stroke="url(#chevL)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M32 13 L44 27 L32 41" stroke="url(#chevR)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="30" y1="16" x2="24" y2="38" stroke="url(#slashG)" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const credential = EmailAuthProvider.credential(email, password)
      await reauthenticateWithCredential(
        auth.currentUser || (await signInWithEmailAndPassword(auth, email, password)).user,
        credential
      )
      await updatePassword(auth.currentUser, newPassword)
      toast.success('Password changed successfully')
      navigate('/admin')
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect')
      } else if (err.code === 'auth/user-not-found') {
        toast.error('No account found with this email')
      } else {
        toast.error('Something went wrong — try logging in first')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes ringPulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(20,184,166,0.5)) drop-shadow(0 0 18px rgba(59,130,246,0.25)); }
          50%       { filter: drop-shadow(0 0 20px rgba(139,91,246,0.7)) drop-shadow(0 0 36px rgba(20,184,166,0.35)); }
        }
        @keyframes orbitA {
          0%   { transform: rotate(0deg)   translateX(33px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(33px) rotate(-360deg); }
        }
        @keyframes orbitB {
          0%   { transform: rotate(90deg)  translateX(28px) rotate(-90deg); }
          100% { transform: rotate(450deg) translateX(28px) rotate(-450deg); }
        }
        @keyframes scanAnim {
          0%   { top: 0;    opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 0.2; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lp-input {
          background: rgba(13,17,23,0.75);
          border: 1px solid rgba(35,43,58,0.95);
          border-radius: 10px;
          padding: 12px 14px;
          color: #E8EAED;
          font-size: 14px;
          font-family: 'Courier New', monospace;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s, background 0.25s;
          width: 100%;
          box-sizing: border-box;
        }
        .lp-input::placeholder { color: #3a4050; }
        .lp-input:hover {
          border-color: rgba(20,184,166,0.45);
          box-shadow: 0 0 10px rgba(20,184,166,0.14), 0 2px 8px rgba(0,0,0,0.3);
          transform: translateY(-1px);
        }
        .lp-input:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 18px rgba(20,184,166,0.28), 0 2px 12px rgba(0,0,0,0.4);
          transform: translateY(-1px);
          background: rgba(20,184,166,0.04);
        }
        .lp-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, rgba(20,184,166,0.92), rgba(139,181,246,0.75));
          border: none;
          border-radius: 10px;
          color: #0D1117;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-family: 'Courier New', monospace;
          cursor: pointer;
          margin-top: 6px;
          transition: transform 0.25s, box-shadow 0.25s;
          position: relative;
          overflow: hidden;
        }
        .lp-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(139,181,246,0.92), rgba(20,184,166,0.75));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .lp-btn:hover { transform: translateY(-2px); box-shadow: 0 0 26px rgba(20,184,166,0.55); }
        .lp-btn:hover::before { opacity: 1; }
        .lp-btn:active { transform: translateY(0); }
        .lp-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .lp-btn span { position: relative; z-index: 1; }
        .lp-switch span {
          color: #14B8A6;
          cursor: pointer;
          transition: color 0.2s, text-shadow 0.2s;
        }
        .lp-switch span:hover {
          color: #8B5CF6;
          text-shadow: 0 0 8px rgba(139,91,246,0.45);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#0D1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Courier New', monospace",
      }}>
        <CodeBackground />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420, margin: '2rem auto', padding: '0 1rem' }}>
          <div style={{
            background: 'rgba(22,27,38,0.78)',
            border: '1px solid rgba(20,184,166,0.25)',
            borderRadius: 20,
            padding: '2.5rem 2rem 2rem',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            boxShadow: '0 0 50px rgba(20,184,166,0.07), 0 0 0 1px rgba(139,181,246,0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.7), transparent)',
              animation: 'scanAnim 3.5s ease-in-out infinite',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.4rem' }}>
              <DevLogo />
              <div style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', color: '#14B8A6', marginTop: 10 }}>
                KP Dev Cell
              </div>
            </div>

            <h1 style={{
              fontSize: 22, fontWeight: 500, textAlign: 'center',
              color: '#E8EAED', marginBottom: 4, letterSpacing: 0.5,
            }}>
              {mode === 'login' ? 'Member Access' : 'Set Password'}
              <span style={{
                display: 'inline-block', width: 9, height: 16,
                background: '#14B8A6', marginLeft: 6, verticalAlign: 'middle',
                animation: 'cursorBlink 1s step-end infinite',
              }} />
            </h1>
            <p style={{ fontSize: 12, textAlign: 'center', color: '#7E8590', marginBottom: '1.8rem' }}>
              {mode === 'login' ? '// restricted — authorized personnel only' : '// update your credentials'}
            </p>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 0, animation: 'fadeSlideIn 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                  <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#7E8590' }}>email_address</label>
                  <input
                    className="lp-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="dev@kpdevcell.in"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                  <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#7E8590' }}>password</label>
                  <input
                    className="lp-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                  />
                </div>
                <button type="submit" disabled={loading} className="lp-btn">
                  <span>{loading ? '$ logging in...' : '$ ./login --execute'}</span>
                </button>
                <p className="lp-switch" style={{ textAlign: 'center', fontSize: 12, color: '#4a5060', marginTop: '1rem' }}>
                  first time?{' '}
                  <span onClick={() => setMode('change')}>set_password()</span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 0, animation: 'fadeSlideIn 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                  <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#7E8590' }}>email_address</label>
                  <input
                    className="lp-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="dev@kpdevcell.in"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                  <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#7E8590' }}>current_password</label>
                  <input
                    className="lp-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                  <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#7E8590' }}>new_password</label>
                  <input
                    className="lp-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                  <label style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#7E8590' }}>confirm_password</label>
                  <input
                    className="lp-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                  />
                </div>
                <button type="submit" disabled={loading} className="lp-btn">
                  <span>{loading ? '$ updating...' : '$ ./update --password'}</span>
                </button>
                <p className="lp-switch" style={{ textAlign: 'center', fontSize: 12, color: '#4a5060', marginTop: '1rem' }}>
                  already done?{' '}
                  <span onClick={() => setMode('login')}>back_to_login()</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage

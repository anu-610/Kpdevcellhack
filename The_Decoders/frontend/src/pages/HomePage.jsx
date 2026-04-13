import { useEffect, useMemo, useState } from 'react'
import { C } from '../constants/theme'
import Hero           from '../components/home/Hero'
import About          from '../components/home/About'
import Team           from '../components/home/Team'
import Projects       from '../components/home/Projects'
import Footer         from '../components/home/Footer'
import { Ticker }     from '../components/shared'
import CustomScrollbar from '../components/CustomScrollbar'
import MembersSection from '../components/home/MembersSection'
import Connect from '../components/home/Connect'
import { claimPageBootLoader } from '../utils/bootLoaderGate.js'

const TICKER_ITEMS = [
  'Web Development', 'System Design', 'Open Source', 'Hackathons',
  'DSA Sessions', 'DevOps', 'AI/ML', 'Peer Learning',
  'Code Reviews', 'Project Building',
]

const BOOT_STEPS = [
  'Booting knowledge matrix',
  'Warming project modules',
  'Syncing member constellation',
  'Composing interactive sections',
  'Launching homepage core',
]

function HomeLoader({ progress }) {
  const rounded = Math.round(progress)
  const activeStep = Math.min(BOOT_STEPS.length - 1, Math.floor((rounded / 100) * BOOT_STEPS.length))
  const sessionId = useMemo(
    () => `KP-${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
    []
  )

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 500;

  return (
    <>
      <style>{`
        @keyframes homeLoaderPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.15); opacity: 1; }
        }
        @keyframes homeLoaderSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes homeLoaderGrid {
          from { transform: translateY(0); }
          to   { transform: translateY(42px); }
        }
        @keyframes homeLoaderGlow {
          0%, 100% { opacity: 0.4; filter: blur(8px); }
          50%      { opacity: 0.95; filter: blur(12px); }
        }
        @keyframes homeLoaderText {
          0%   { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(1100px 700px at 16% 14%, rgba(20,184,166,0.22), transparent 55%), radial-gradient(900px 600px at 86% 84%, rgba(16,185,129,0.16), transparent 58%), #05080d',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          animation: 'homeLoaderGrid 1.4s linear infinite',
          opacity: 0.55,
        }} />

        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(92vw, 620px)',
          border: '1px solid rgba(20,184,166,0.26)',
          borderRadius: 18,
          background: 'linear-gradient(180deg, rgba(5,8,13,0.8), rgba(5,8,13,0.95))',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 12px 42px rgba(0,0,0,0.48), inset 0 0 24px rgba(20,184,166,0.08)',
          padding: isMobile ? '16px 14px 14px' : '22px 20px 18px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 18,
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            fontSize: 11,
            color: '#5f7384',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            <span>Knowledge Park Interface</span>
            <span>{sessionId}</span>
          </div>

          <div style={{
            display: 'flex',
flexDirection: isMobile ? 'column' : 'row',
alignItems: 'center',
gap: isMobile ? 10 : 16,
          }}>
            <div style={{
              position: 'relative',
              width: isMobile ? 72 : 110,
height: isMobile ? 72 : 110,
              margin: isMobile ? '0 auto 4px' : '0 auto',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1px solid rgba(20,184,166,0.32)',
                animation: 'homeLoaderSpin 5s linear infinite',
              }} />
              <div style={{
                position: 'absolute',
                inset: 14,
                borderRadius: '50%',
                border: '1px dashed rgba(16,185,129,0.5)',
                animation: 'homeLoaderSpin 3.2s linear infinite reverse',
              }} />
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #34d399 0%, #0f766e 62%, #052e2b 100%)',
                animation: 'homeLoaderPulse 1.4s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(52,211,153,0.2), rgba(52,211,153,0))',
                animation: 'homeLoaderGlow 1.4s ease-in-out infinite',
              }} />
            </div>

            <div>
              <div style={{
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 12,
                color: '#87a5b8',
                marginBottom: 10,
              }}>
                initialising.homepage.core
              </div>

              <div style={{
                height: 10,
                borderRadius: 999,
                overflow: 'hidden',
                border: '1px solid rgba(20,184,166,0.35)',
                background: 'rgba(15,23,42,0.8)',
              }}>
                <div style={{
                  width: `${rounded}%`,
                  height: '100%',
                  transition: 'width 120ms linear',
                  background: 'linear-gradient(90deg, #0ea5a4, #34d399)',
                  boxShadow: '0 0 14px rgba(52,211,153,0.35)',
                }} />
              </div>

              <div style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 11,
                color: '#6f8a9a',
              }}>
                <span style={{ animation: 'homeLoaderText 220ms ease' }}>{BOOT_STEPS[activeStep]}</span>
                <span style={{ color: '#34d399' }}>{String(rounded).padStart(2, '0')}%</span>
              </div>

              <div style={{
                marginTop: 12,
                display: 'grid',
                gap: 4,
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 10,
              }}>
                {BOOT_STEPS.map((line, idx) => {
                  const done = idx < activeStep
                  const current = idx === activeStep
                  return (
                    <div
                      key={line}
                      style={{
                        color: done ? '#34d399' : current ? '#b4c6d3' : '#4c5f6d',
                        opacity: done || current ? 1 : 0.62,
                      }}
                    >
                      {done ? '[ok]' : current ? '[..]' : '[  ]'} {line}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default function HomePage() {
  const [loading, setLoading] = useState(() => claimPageBootLoader('home'))
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!loading) return

    const durationMs = 3400
    const start = performance.now()
    let rafId = 0

    const tick = (now) => {
      const elapsed = now - start
      const t = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased * 100)

      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        setTimeout(() => setLoading(false), 320)
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
    if (!loading) {
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <div style={{
      backgroundColor: C.bg,
      minHeight: '100vh',
      fontFamily: '"Inter", system-ui, sans-serif',
      overflowX: 'hidden',
    }}>
      {loading ? (
        <HomeLoader progress={progress} />
      ) : (
        <>
          <CustomScrollbar />
          <Hero />
          <Ticker items={TICKER_ITEMS} />
          <About />
          <Team />
          <MembersSection />
          <Projects />
          <Connect />
          <Footer />
        </>
      )}
    </div>
  )
}
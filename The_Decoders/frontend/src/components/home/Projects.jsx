import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { C } from '../../constants/theme'

// ── Project Data ──────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    number: '01',
    title: 'KP Dev Cell Website',
    description:
      'Official club website built with React, Express, MongoDB and Firebase. Features an admin dashboard, event management, and member access control.',
    stack: ['React', 'Express', 'MongoDB', 'Firebase', 'Docker'],
    github: '#',
    color: C.purple,
  },
  {
    id: 2,
    number: '02',
    title: 'AI Code Assistant',
    description:
      'An intelligent code completion and review tool powered by machine learning. Integrates with VS Code and provides real-time suggestions.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'TensorFlow'],
    github: '#',
    color: C.cyan,
  },
  {
    id: 3,
    number: '03',
    title: 'Real-time Collaboration',
    description:
      'A collaborative coding platform with live cursors, voice chat, and integrated terminal — built for remote pair programming.',
    stack: ['Node.js', 'React', 'Redis', 'WebRTC'],
    github: '#',
    color: '#EC4899',
  },
  {
    id: 4,
    number: '04',
    title: 'DevOps Dashboard',
    description:
      'Unified monitoring dashboard for CI/CD pipelines, container orchestration, and infrastructure health with real-time alerting.',
    stack: ['Go', 'Kubernetes', 'Prometheus', 'Grafana'],
    github: '#',
    color: '#F97316',
  },
]

const TOTAL = PROJECTS.length

// ── Single Project Card ───────────────────────────────────────
function ProjectCard({ project, index, activeIndex, direction }) {
  const offset   = index - activeIndex
  const isActive = offset === 0
  const isBehind = offset > 0
  const isGone   = offset < 0

  const rotateX = isGone ? (direction > 0 ? -55 : 55) : 0
  const scale   = isBehind ? Math.max(0.88, 1 - offset * 0.04) : 1
  const y       = isBehind ? offset * 6 : 0
  const opacity = isGone ? 0 : isBehind ? Math.max(0.3, 1 - offset * 0.25) : 1
  const zIndex  = TOTAL - Math.abs(offset)

  return (
    <motion.div
      animate={{ rotateX, scale, y, opacity }}
      transition={{ type: 'spring', stiffness: 68, damping: 20, mass: 1.15 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex,
        originY: 0,
        transformStyle: 'preserve-3d',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        backgroundColor: '#161B26',
        border: `1px solid ${project.color}28`,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isActive
          ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${project.color}18`
          : '0 8px 24px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.3s ease',
      }}>

        {/* Top accent bar */}
        <div style={{
          height: '3px',
          background: `linear-gradient(90deg, ${project.color}, transparent)`,
          flexShrink: 0,
        }} />

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '280px', height: '280px',
          background: `radial-gradient(circle at top right, ${project.color}10, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          padding: '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1,
        }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}>
            <h2 style={{
              margin: 0,
              fontSize: 'clamp(20px, 2.8vw, 30px)',
              fontWeight: 800,
              color: C.fg,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              maxWidth: '80%',
            }}>
              {project.title}
            </h2>
            <span style={{
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontSize: '14px',
              color: project.color,
              opacity: 0.7,
              flexShrink: 0,
              paddingTop: '4px',
            }}>
              ({project.number})
            </span>
          </div>

          {/* Description */}
          <p style={{
            margin: '0 0 20px 0',
            fontSize: '14px',
            color: C.muted,
            lineHeight: 1.7,
            maxWidth: '560px',
          }}>
            {project.description}
          </p>

          {/* Stack tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '24px' }}>
            {project.stack.map(tech => (
              <span key={tech} style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                backgroundColor: `${project.color}12`,
                border: `1px solid ${project.color}30`,
                color: project.color,
              }}>
                {tech}
              </span>
            ))}
          </div>

          {/* Github link */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontSize: '12px',
              color: C.purple,
              textDecoration: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            view on github
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Decorative code */}
        <div style={{
          position: 'absolute', bottom: '24px', right: '32px',
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          fontSize: '10px', color: project.color, opacity: 0.1,
          lineHeight: 1.6, pointerEvents: 'none', userSelect: 'none',
        }}>
          {['const init = async () => {', '  await build();', '  return success;', '};'].map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Progress dots ─────────────────────────────────────────────
function ProgressDots({ activeIndex }) {
  return (
    <div style={{
      display: 'flex', gap: '8px',
      alignItems: 'center', justifyContent: 'center',
      marginTop: '20px',
    }}>
      {PROJECTS.map((p, i) => (
        <motion.div
          key={p.id}
          animate={{
            width: i === activeIndex ? '24px' : '6px',
            backgroundColor: i === activeIndex ? p.color : 'rgba(255,255,255,0.15)',
          }}
          transition={{ duration: 0.3 }}
          style={{ height: '6px', borderRadius: '3px' }}
        />
      ))}
    </div>
  )
}

// ── Main Projects Section ─────────────────────────────────────
export default function Projects() {
  const sectionRef  = useRef(null)
  const stageRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const activeRef   = useRef(0)
  const lastStepTs = useRef(0)
  const wheelAccum = useRef(0)

  useEffect(() => { activeRef.current = activeIndex }, [activeIndex])

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, idx))
    setActiveIndex(clamped)
    activeRef.current = clamped
  }, [])

  // Trap only when the card stage is near viewport center.
  // This avoids hijacking page scroll too early/late.
  const stageInView = useCallback(() => {
    const el = stageRef.current
    if (!el) return false
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    return rect.top <= vh * 0.65 && rect.bottom >= vh * 0.35
  }, [])

  useEffect(() => {
    let touchStartY = 0

    const onWheel = (e) => {
      if (!stageInView()) return

      const cur = activeRef.current
      wheelAccum.current += e.deltaY
      const now = Date.now()

      // Wait until scroll intent is clear, then move one card.
      if (Math.abs(wheelAccum.current) < 36) return
      if (now - lastStepTs.current < 180) return

      const step = wheelAccum.current > 0 ? 1 : -1

      // First card + scrolling up → release
      if (cur === 0 && step < 0) {
        wheelAccum.current = 0
        return
      }
      // Last card + scrolling down → release
      if (cur === TOTAL - 1 && step > 0) {
        wheelAccum.current = 0
        return
      }

      // Trap scroll
      e.preventDefault()
      e.stopPropagation()

      lastStepTs.current = now
      wheelAccum.current = 0
      setDirection(step)
      goTo(cur + step)
    }

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const onTouchMove = (e) => {
      if (!stageInView()) return
      const delta = touchStartY - e.touches[0].clientY
      const cur   = activeRef.current
      const now = Date.now()

      if (cur === 0 && delta < 0) return
      if (cur === TOTAL - 1 && delta > 0) return

      if (Math.abs(delta) > 36 && now - lastStepTs.current >= 180) {
        e.preventDefault()
        lastStepTs.current = now
        touchStartY = e.touches[0].clientY
        const step = delta > 0 ? 1 : -1
        setDirection(step)
        goTo(cur + step)
      }
    }

    const onKey = (e) => {
      if (!stageInView()) return
      if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        setDirection(1)
        goTo(activeRef.current + 1)
      }
      if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault()
        setDirection(-1)
        goTo(activeRef.current - 1)
      }
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })
    window.addEventListener('keydown',    onKey)

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('keydown',    onKey)
    }
  }, [goTo, stageInView])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: C.bg,
        borderTop: `1px solid ${C.border}`,
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '80px 0 80px',
      }}
    >
      {/* Section heading */}
      <div style={{ padding: '0 48px', maxWidth: '1100px', margin: '0 auto 48px', width: '100%', boxSizing: 'border-box' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '24px', height: '1px', backgroundColor: C.cyan }} />
            <span style={{
              color: C.cyan,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: '"Fira Code", monospace',
            }}>
              What We Build
            </span>
          </div>
          <h2 style={{
            margin: '10px 0 0',
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 900, color: C.fg,
            letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
            Projects
          </h2>
        </motion.div>
      </div>

      {/* Card stage */}
      <div style={{
        maxWidth: '820px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px',
        boxSizing: 'border-box',
      }} ref={stageRef}>
        {/* 3D viewport */}
        <div style={{ perspective: '1200px', perspectiveOrigin: '50% 40%' }}>
          <div style={{ position: 'relative', height: '320px' }}>
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                activeIndex={activeIndex}
                direction={direction}
              />
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <ProgressDots activeIndex={activeIndex} />

        {/* Hint */}
        <div style={{
          textAlign: 'center', marginTop: '28px', marginBottom: '24px',
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          fontSize: '11px', color: C.muted, opacity: 0.4,
        }}>
          {activeIndex === 0
            ? '↓ scroll to browse projects'
            : activeIndex === TOTAL - 1
            ? '↓ scroll to continue'
            : `${activeIndex + 1} / ${TOTAL} — scroll for next`}
        </div>
      </div>
    </section>
  )
}
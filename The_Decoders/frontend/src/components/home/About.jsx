import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { C } from '../../constants/theme'
import { Section, SectionLabel } from '../shared'
import { ScrambleText } from '../../hooks/useScramble.jsx'

function usePageVisible() {
  const [visible, setVisible] = useState(() => !document.hidden)

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return visible
}

// ── Scrambled stat counter ────────────────────────────────────
// The number itself counts up driven by scroll, with random digit
// flicker before it resolves to the real value.
function ScrambleStatCard({ value, label, suffix = '+', sectionRef, scrollStart, scrollEnd }) {
  const [displayVal, setDisplayVal] = useState('--')
  const [locked, setLocked]         = useState(false)
  const isVisible = usePageVisible()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 90%', 'end 60%'],
  })

  const progress = useTransform(scrollYProgress, [scrollStart, scrollEnd], [0, 1])

  useMotionValueEvent(progress, 'change', (p) => {
    if (p <= 0) {
      setDisplayVal(prev => (prev === '--' ? prev : '--'))
      setLocked(prev => (prev ? false : prev))
      return
    }
    if (p >= 1) {
      const finalVal = String(value)
      setDisplayVal(prev => (prev === finalVal ? prev : finalVal))
      setLocked(prev => (prev ? prev : true))
      return
    }
    // During scramble: show random digits
    setLocked(prev => (prev ? false : prev))
    const digits = String(value).length
    const next = Array(digits).fill(0).map(() => Math.floor(Math.random() * 10)).join('')
    setDisplayVal(prev => (prev === next ? prev : next))
  })

  // Flicker loop while not locked
  useEffect(() => {
    if (locked || !isVisible) return

    const id = setInterval(() => {
      const p = progress.get()
      if (p <= 0 || p >= 1) return
      const digits = String(value).length
      // Partially reveal: left chars resolve based on progress
      const resolvedDigits = Math.floor(p * digits)
      const real = String(value).padStart(digits, '0')
      const next = real.split('').map((d, i) =>
        i < resolvedDigits ? d : String(Math.floor(Math.random() * 10))
      ).join('')
      setDisplayVal(prev => (prev === next ? prev : next))
    }, 80)

    return () => clearInterval(id)
  }, [locked, value, progress, isVisible])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '28px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`,
      }} />
      <div style={{
        fontSize: '42px', fontWeight: 800,
        color: locked ? C.cyan : 'rgba(20,184,166,0.5)',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        letterSpacing: '-0.02em',
        transition: 'color 0.3s ease',
      }}>
        {displayVal}{locked ? suffix : ''}
      </div>
      <div style={{
        color: C.muted, fontSize: '13px', marginTop: '6px',
        letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </motion.div>
  )
}

// ── Scrambled section heading ─────────────────────────────────
// Splits the heading into lines so line breaks are preserved exactly.
function ScrambleHeading({ lines, sectionRef }) {
  // Stagger each line's reveal window
  const lineOffsets = lines.map((_, i) => ({
    start: i * 0.08,
    end:   i * 0.08 + 0.35,
  }))

  return (
    <h2 style={{
      fontSize: 'clamp(28px, 4vw, 44px)',
      fontWeight: 800,
      color: C.fg,
      margin: '0 0 48px 0',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    }}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block' }}>
          <ScrambleText
            text={line}
            sectionRef={sectionRef}
            startOffset={lineOffsets[i].start}
            endOffset={lineOffsets[i].end}
            resolvedColor={C.fg}
            scrambleColor="rgba(20,184,166,0.3)"
          />
        </span>
      ))}
    </h2>
  )
}

// ── Scrambled paragraph ───────────────────────────────────────
function ScrambleParagraph({ text, sectionRef, startOffset, endOffset, style = {} }) {
  return (
    <p style={{ color: C.muted, fontSize: '15px', lineHeight: 1.8, ...style }}>
      <ScrambleText
        text={text}
        sectionRef={sectionRef}
        startOffset={startOffset}
        endOffset={endOffset}
        resolvedColor={C.muted}
        scrambleColor="rgba(126,133,144,0.3)"
      />
    </p>
  )
}

// ── Data ─────────────────────────────────────────────────────
const TECH_STACK = [
  'React', 'Node.js', 'Python', 'FastAPI', 'MongoDB',
  'Docker', 'Git', 'Linux', 'TypeScript', 'REST APIs',
  'PostgreSQL', 'Redis', 'AWS', 'CI/CD', 'Open Source',
]

const TECH_ACCENTS = ['#14b8a6', '#8b5cf6', '#22c55e', '#ec4899']

function TechMatrixChip({ tech, index }) {
  const accent = TECH_ACCENTS[index % TECH_ACCENTS.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -3, scale: 1.02 }}
      style={{
        border: `1px solid ${accent}44`,
        background: `linear-gradient(180deg, ${accent}16, rgba(13,17,23,0.7))`,
        borderRadius: 10,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        backgroundColor: accent,
        boxShadow: `0 0 12px ${accent}99`,
        flexShrink: 0,
      }} />
      <span style={{
        color: '#d1d5db',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontSize: 12,
      }}>
        {tech}
      </span>
      <span style={{
        marginLeft: 'auto',
        color: '#4b5563',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontSize: 10,
      }}>
        v{(index % 4) + 1}.x
      </span>
    </motion.div>
  )
}

const PARA_1 = "KP Dev Cell is IIT Mandi's development club. We exist to bridge the gap between curriculum and industry — through real projects, honest feedback, and a culture of building things that actually work."
const PARA_2 = "No gatekeeping. No prerequisites. If you're curious and willing to put in the work — you belong here."

// ── Component ─────────────────────────────────────────────────
export default function About() {
  const sectionRef = useRef(null)

  return (
    <>
      {/* ── About ── */}
      <div ref={sectionRef}>
        <Section>
          <SectionLabel>About</SectionLabel>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}>

            {/* Left: scrambled text */}
            <div>
              <ScrambleHeading
                lines={['A club built by builders,', 'for builders.']}
                sectionRef={sectionRef}
              />
              <ScrambleParagraph
                text={PARA_1}
                sectionRef={sectionRef}
                startOffset={0.15}
                endOffset={0.55}
                style={{ margin: '0 0 20px 0' }}
              />
              <ScrambleParagraph
                text={PARA_2}
                sectionRef={sectionRef}
                startOffset={0.3}
                endOffset={0.65}
                style={{ margin: 0 }}
              />
            </div>

            {/* Right: scrambled stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ScrambleStatCard
                value={20}  label="Members"          suffix="+"
                sectionRef={sectionRef} scrollStart={0.1} scrollEnd={0.45}
              />
              <ScrambleStatCard
                value={100}  label="Alumini"   suffix="+"
                sectionRef={sectionRef} scrollStart={0.2} scrollEnd={0.5}
              />
              <ScrambleStatCard
                value={10}  label="Sessions held"    suffix="+"
                sectionRef={sectionRef} scrollStart={0.3} scrollEnd={0.55}
              />
              <ScrambleStatCard
                value={4}   label="Projects" suffix=""
                sectionRef={sectionRef} scrollStart={0.4} scrollEnd={0.6}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* ── Tech stack ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <Section style={{ padding: '64px 48px' }}>
          <SectionLabel>What we work with</SectionLabel>

          <style>{`
            @keyframes techScanline {
              from { transform: translateY(-100%); }
              to { transform: translateY(460px); }
            }
          `}</style>

          <div style={{
            position: 'relative',
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(13,17,23,0.95), rgba(13,17,23,0.75))',
            boxShadow: 'inset 0 0 40px rgba(20,184,166,0.06), 0 10px 30px rgba(0,0,0,0.35)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 14px',
              borderBottom: `1px solid ${C.border}`,
              backgroundColor: 'rgba(10,13,18,0.85)',
            }}>
              {['#ef4444', '#f59e0b', '#22c55e'].map((dot, i) => (
                <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: dot, opacity: 0.85 }} />
              ))}
              <span style={{
                marginLeft: 8,
                color: '#6b7280',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 11,
              }}>
                ~/kp-dev-cell/stack/runtime
              </span>
            </div>

            <div style={{
              padding: '14px 16px 8px',
              borderBottom: `1px solid ${C.border}`,
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              fontSize: 12,
              color: '#9ca3af',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <span style={{ color: '#22c55e' }}>dev@kp</span>
              <span style={{ color: '#6b7280' }}>:</span>
              <span style={{ color: '#14b8a6' }}>~</span>
              <span style={{ color: '#6b7280' }}>$</span>
              <span style={{ color: '#e5e7eb' }}>npx kp-toolkit stack --live --verified</span>
            </div>

            <div style={{ position: 'relative', padding: '18px 16px 16px' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 60,
                background: 'linear-gradient(180deg, rgba(20,184,166,0.07), transparent)',
                animation: 'techScanline 3.2s linear infinite',
                pointerEvents: 'none',
              }} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: 10,
              }}>
                {TECH_STACK.map((tech, i) => (
                  <TechMatrixChip key={tech} tech={tech} index={i} />
                ))}
              </div>

              <div style={{
                marginTop: 14,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 14,
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 11,
                color: '#4b5563',
              }}>
                <span><span style={{ color: '#14b8a6' }}>{TECH_STACK.length}</span> packages active</span>
                <span>•</span>
                <span>workspace status: <span style={{ color: '#22c55e' }}>stable</span></span>
                <span>•</span>
                <span>review mode: <span style={{ color: '#8b5cf6' }}>strict</span></span>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </>
  )
}
import { motion } from 'framer-motion'
import { C } from '../../constants/theme'

export function Section({ children, style }) {
  return (
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '100px 48px',
        position: 'relative',
        zIndex: 1,
        ...style,
      }}
    >
      {children}
    </section>
  )
}

export function SectionLabel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}
    >
      <div style={{ width: '24px', height: '1px', backgroundColor: C.cyan }} />
      <span
        style={{
          color: C.cyan,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
        }}
      >
        {children}
      </span>
    </motion.div>
  )
}

export function SectionTitle({ children }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        fontSize: 'clamp(28px, 4vw, 44px)',
        fontWeight: 800,
        color: C.fg,
        margin: '0 0 48px 0',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      }}
    >
      {children}
    </motion.h2>
  )
}

export function Ticker({ items }) {
  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 0',
        backgroundColor: 'rgba(22,27,38,0.5)',
      }}
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              color: C.muted,
              fontSize: '12px',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ color: C.cyan, marginRight: '8px' }}>{'>'}</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
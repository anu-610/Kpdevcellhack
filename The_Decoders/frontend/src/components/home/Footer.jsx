import { motion } from 'framer-motion'
import { C } from '../../constants/theme'

const SOCIAL_LINKS = [
  { label: 'Instagram', url: '#' },
  { label: 'LinkedIn',  url: '#' },
  { label: 'GitHub',    url: '#' },
  { label: 'Email',     url: 'mailto:devcell@iitmandi.ac.in' },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${C.border}`,
      padding: '48px',
      maxWidth: '1100px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '24px',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Brand */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            userSelect: 'none', overflow: 'hidden',
          }}>
            <img
              src="/logo.png"
              alt="KP Dev Cell logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <span style={{ color: C.fg, fontWeight: 700, fontSize: '15px', marginLeft: '-7px' }}>KP Dev Cell</span>
        </div>
        <p style={{ color: C.muted, fontSize: '12px', margin: 0 }}>
          Kammand Prompt Club — IIT Mandi
        </p>
      </div>

      {/* Social links */}
      <nav style={{ display: 'flex', gap: '24px' }}>
        {SOCIAL_LINKS.map(({ label, url }) => (
          <motion.a
            key={label}
            href={url}
            whileHover={{ color: C.cyan }}
            style={{
              color: C.muted,
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'color 0.2s',
            }}
          >
            {label}
          </motion.a>
        ))}
      </nav>

      {/* Copyright */}
      <p style={{
        color: C.muted, fontSize: '11px',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        margin: 0,
      }}>
        © 2025 KP Dev Cell · Built by{' '}
        <span style={{ color: C.cyan }}>the DeCoders</span>
      </p>
    </footer>
  )
}

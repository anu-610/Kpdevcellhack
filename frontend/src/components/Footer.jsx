import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

function GithubIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

const quickLinks = [
  { path: '/',           label: 'Home' },
  { path: '/events',     label: 'Events' },
  { path: '/resources',  label: 'Resources' },
  { path: '/highlights', label: 'Highlights' },
  { path: '/team',       label: 'Team' },
  { path: '/about',      label: 'About' },
]

const communityLinks = [
  { href: 'https://github.com/KamandPrompt',       label: 'GitHub',    Icon: GithubIcon },
  { href: 'https://instagram.com/kamandprompt',     label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://chat.whatsapp.com/kamandprompt', label: 'WhatsApp',  Icon: MessageCircle },
]

const linkStyle = {
  color: '#4a6070',
  fontSize: '0.82rem',
  textDecoration: 'none',
  transition: 'color 0.15s',
  lineHeight: 1,
}

const headingStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.58rem',
  color: 'rgba(0,255,136,0.55)',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  margin: '0 0 12px',
}

export default function Footer() {
  return (
    <footer style={{ background: '#060809', borderTop: '1px solid #0e1620', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px clamp(20px,5vw,60px) 0', boxSizing: 'border-box' }}>

        {/* ── 3-column grid: brand | links | community ── */}
        <div style={{
          display: 'grid',
          // Desktop: fixed 3 cols. Tablet: 2 cols. Mobile: 1 col.
          gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)',
          gap: '32px 40px',
          paddingBottom: 24,
        }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginBottom: 8 }}>
              <img
                src="/logo.png"
                alt="KP"
                style={{ width: 30, height: 30, objectFit: 'contain', flexShrink: 0, mixBlendMode: 'screen' }}
              />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e0eef8', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Kamand Prompt
              </span>
            </Link>
            <p style={{ color: '#4a6070', fontSize: '0.78rem', lineHeight: 1.6, margin: '0 0 2px' }}>
              The Programming Club @ IIT Mandi
            </p>
            <p style={{ color: '#304050', fontSize: '0.74rem', margin: 0 }}>
              IIT Mandi, Himachal Pradesh
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p style={headingStyle}>Quick Links</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {quickLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4a6070'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <p style={headingStyle}>Community</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {communityLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', gap: 7 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4a6070'}
                >
                  <Icon size={13} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid #0e1620',
          padding: '12px 0 14px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}>
          <p style={{ color: '#243040', fontSize: '0.7rem', margin: 0 }}>
            © 2026 KAMAND PROMPT, IIT Mandi. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            {['Privacy Policy', 'Terms of Use'].map(t => (
              <a key={t} href="#" style={{ color: '#243040', fontSize: '0.7rem', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#4a6070'}
                onMouseLeave={e => e.currentTarget.style.color = '#243040'}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive: collapse to 1 col on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
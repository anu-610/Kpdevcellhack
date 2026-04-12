export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.top}>
          <div>
            <div style={s.brand}>⬡ KP DEV CELL</div>
            <div style={s.sub}>Kammand Prompt Club · IIT Mandi</div>
          </div>
          <div style={s.links}>
            {['home','team','projects','events'].map(l => (
              <a key={l} href={`/${l === 'home' ? '' : l}`} style={s.link}>./{l}</a>
            ))}
          </div>
        </div>
        <div style={s.bottom}>
          <span style={{ color: 'var(--text-dim)' }}>// built with ♥ by <span style={{ color: 'var(--accent)' }}>Ritika and Shreya</span></span>
          <span style={{ color: 'var(--text-dim)' }}>© {year} kp dev cell</span>
        </div>
      </div>
    </footer>
  )
}
const s = {
  footer: { borderTop: '1px solid var(--border-dim)', marginTop: 80, background: 'var(--bg-surface)' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '40px 32px 32px' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 24 },
  brand: { fontFamily: 'var(--font-pixel)', fontSize: '0.65rem', color: 'var(--accent)', marginBottom: 8 },
  sub: { fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)' },
  links: { display: 'flex', gap: 24 },
  link: { fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' },
  bottom: {
    display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
    paddingTop: 24, borderTop: '1px solid var(--border-dim)',
    fontFamily: 'var(--font-mono)', fontSize: '12px',
  },
}

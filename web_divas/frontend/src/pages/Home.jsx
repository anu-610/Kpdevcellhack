// Home.jsx — Robotronics-inspired aesthetic
// Corner brackets, numbered sections, ticker, bold full-width layout

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ── Reusable corner bracket box ────────────────────────
function Brackets({ children, color = 'rgba(0,255,136,0.4)', style = {} }) {
  const b = { position:'absolute', width:14, height:14, borderColor:color, borderStyle:'solid' }
  return (
    <div style={{ position:'relative', ...style }}>
      <div style={{ ...b, top:0,     left:0,  borderWidth:'2px 0 0 2px' }} />
      <div style={{ ...b, top:0,     right:0, borderWidth:'2px 2px 0 0' }} />
      <div style={{ ...b, bottom:0,  left:0,  borderWidth:'0 0 2px 2px' }} />
      <div style={{ ...b, bottom:0,  right:0, borderWidth:'0 2px 2px 0' }} />
      {children}
    </div>
  )
}

// ── Terminal — single typewriter ──────────────────────
const TERM_TEXT = [
  { text: '$ whoami',                        color: '#fbbf24' },
  { text: '> kp_dev_cell @ iit_mandi',       color: '#00ff88' },
  { text: '',                                color: ''        },
  { text: '$ ls ./club',                     color: '#fbbf24' },
  { text: '> members/  projects/  events/',  color: '#8888a8' },
  { text: '',                                color: ''        },
  { text: '$ cat mission.txt',               color: '#fbbf24' },
  { text: '> build things that matter.',     color: '#00ff88' },
  { text: '> shipping since 2022.',          color: '#00ff88' },
  { text: '',                                color: ''        },
  { text: '$ ./join --club kp_dev_cell',     color: '#fbbf24' },
  { text: '> welcome aboard 🚀',             color: '#a78bfa' },
]

function TerminalBody() {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (lineIdx >= TERM_TEXT.length) return
    const line = TERM_TEXT[lineIdx].text
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 35)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0) }, line === '' ? 120 : 180)
      return () => clearTimeout(t)
    }
  }, [lineIdx, charIdx])

  const lines = TERM_TEXT.slice(0, lineIdx).map((l, i) => (
    <div key={i} style={{ color: l.color || 'var(--text-secondary)', minHeight: '1.9em' }}>
      {l.text || '\u00a0'}
    </div>
  ))
  const current = TERM_TEXT[lineIdx]
  if (current) {
    lines.push(
      <div key={lineIdx} style={{ color: current.color || 'var(--text-secondary)', minHeight: '1.9em' }}>
        {current.text.slice(0, charIdx)}<span className="blink" style={{ color: 'var(--accent)' }}>█</span>
      </div>
    )
  }
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.9, padding: '18px 22px', minHeight: 280 }}>{lines}</div>
}

// ── Scrolling ticker ───────────────────────────────────
const ITEMS = ['REACT','✦','FASTAPI','✦','MONGODB','✦','DOCKER','✦','FIREBASE','✦','PYTHON','✦','TYPESCRIPT','✦','OPEN SOURCE','✦','HACKATHONS','✦','IIT MANDI','✦']
function Ticker() {
  const all = [...ITEMS, ...ITEMS]
  return (
    <div style={{ overflow:'hidden', borderTop:'1px solid var(--border-dim)', background:'var(--bg-surface)', padding:'11px 0' }}>
      <div style={{ display:'flex', gap:32, whiteSpace:'nowrap', animation:'ticker 28s linear infinite' }}>
        {all.map((item,i) => (
          <span key={i} style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'2px', color: item==='✦' ? 'var(--accent)' : 'var(--text-dim)' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Section label with line ────────────────────────────
function SectionMark({ num, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:40 }}>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--accent)', letterSpacing:'1px' }}>{num}</span>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--border-bright)' }}>//</span>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)', letterSpacing:'2px', textTransform:'uppercase' }}>{label}</span>
      <div style={{ flex:1, height:1, background:'var(--border-dim)' }} />
    </div>
  )
}

export default function Home() {
  const [stats, setStats] = useState({ members: 0, projects: 0, events: 0 })

  useEffect(() => {
    const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    const base = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`
    
    Promise.all([
      fetch(`${base}/team/`).then(r => r.json()),
      fetch(`${base}/projects/`).then(r => r.json()),
      fetch(`${base}/events/`).then(r => r.json()),
    ]).then(([team, projects, events]) => {
      setStats({
        members: Array.isArray(team) ? team.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        events: Array.isArray(events) ? events.length : 0,
      })
    }).catch(() => {})
  }, [])

  return (
    <div>
      {/* ══ HERO ═══════════════════════════════════════ */}
      <section style={s.hero}>
        <svg style={s.dotBg} width="100%" height="100%">
          <defs>
            <pattern id="dp" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#00ff88" opacity="0.25"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dp)"/>
        </svg>

        {/* Big corner brackets for the whole hero */}
        <div style={{ ...s.hc, top:28,    left:28,    borderWidth:'2px 0 0 2px' }} />
        <div style={{ ...s.hc, top:28,    right:28,   borderWidth:'2px 2px 0 0' }} />
        <div style={{ ...s.hc, bottom:72, left:28,    borderWidth:'0 0 2px 2px' }} />
        <div style={{ ...s.hc, bottom:72, right:28,   borderWidth:'0 2px 2px 0' }} />

        <div className="container" style={s.heroGrid}>
          {/* Left */}
          <div>
            <div style={s.pill}>
              <span style={s.pillDot} />
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)', letterSpacing:'1.5px' }}>ONLINE · IIT MANDI, HP</span>
            </div>

            <h1 style={s.title}>
              KAMMAND<br />
              <span style={{ color:'var(--accent)' }}>PROMPT</span><br />
              CLUB
            </h1>

            <p style={s.sub}>
              The developer community at IIT Mandi.<br />
              We ship real code. We learn fast.<br />We build what matters.
            </p>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <Link to="/projects" className="btn btn-primary" style={{ fontSize:13 }}>$ explore_projects</Link>
              <Link to="/team"     className="btn"             style={{ fontSize:13 }}>./meet_the_team</Link>
            </div>
          </div>

          {/* Right — terminal */}
          <Brackets style={{ width:'100%' }}>
            <div style={s.terminal}>
              <div style={s.termBar}>
                <div style={{ display:'flex', gap:5 }}>
                  {['#f87171','#fbbf24','#00ff88'].map(c => <div key={c} style={{ width:9, height:9, borderRadius:'50%', background:c }} />)}
                </div>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)', flex:1, textAlign:'center' }}>bash — kp@devbox</span>
              </div>
              <TerminalBody />
            </div>
          </Brackets>
        </div>

        <Ticker />
      </section>

      {/* ══ STATS ══════════════════════════════════════ */}
      <section style={{ padding:'72px 0', borderBottom:'1px solid var(--border-dim)' }}>
        <div className="container">
          <SectionMark num="01" label="by the numbers" />
          <div style={s.statsGrid}>
            {[
             { v: stats.members + '+',  l:'active members',     c:'var(--accent)'  },
             { v: stats.projects + '+', l:'projects shipped',   c:'var(--accent2)' },
             { v: stats.events + '+',   l:'events hosted',      c:'var(--accent3)' },
             { v: '72h',                l:'hackathon duration', c:'var(--warn)'    },
            ].map(({ v, l, c }) => (
              <div key={l} style={s.statCard}>
                <div style={{ fontFamily:'var(--font-pixel)', fontSize:'clamp(1.4rem,3vw,2rem)', color:c, marginBottom:10 }}>{v}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)', letterSpacing:'1px', textTransform:'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ABOUT ══════════════════════════════════════ */}
      <section style={{ padding:'80px 0', borderBottom:'1px solid var(--border-dim)' }}>
        <div className="container">
          <SectionMark num="02" label="about" />
          <div style={s.aboutGrid}>
            <div>
              <h2 style={{ fontFamily:'var(--font-pixel)', fontSize:'clamp(0.8rem,2vw,1.1rem)', lineHeight:1.9, marginBottom:24 }}>
                WE BUILD.<br />WE BREAK.<br />WE LEARN.
              </h2>
              <p style={s.bodyText}>
                KP Dev Cell is the technical wing of Kammand Prompt Club at IIT Mandi —
                a group of developers obsessed with building real things. Web apps, APIs, tools,
                and whatever keeps us up at 3am.
              </p>
              <p style={{ ...s.bodyText, marginTop:14 }}>
                We run sessions, host hackathons, collab on open source, and make sure
                that by graduation, you've actually shipped something.
              </p>
              <Link to="/team" className="btn" style={{ marginTop:28, display:'inline-block', fontSize:13 }}>
                ./meet_core_team →
              </Link>
            </div>

            <Brackets style={{ width:'100%' }}>
              <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border-dim)', borderRadius:6, overflow:'hidden', margin:12 }}>
                <div style={{ background:'var(--bg-elevated)', borderBottom:'1px solid var(--border-dim)', padding:'9px 14px', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'var(--accent)', fontSize:10 }}>●</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)' }}>club.py</span>
                </div>
                <pre style={{ fontFamily:'var(--font-mono)', fontSize:12.5, padding:'18px 20px', whiteSpace:'pre', overflowX:'auto', lineHeight:1.9, color:'var(--text-secondary)', margin:0 }}>{
`\x1b`/* dummy — using JSX spans below */}
                  <span style={{ color:'#a78bfa' }}>class </span>
                  <span style={{ color:'#4d9fff' }}>KPDevCell</span>{`:\n    name    = `}
                  <span style={{ color:'#00ff88' }}>"Kammand Prompt Club"</span>{`\n    college = `}
                  <span style={{ color:'#00ff88' }}>"IIT Mandi"</span>{`\n    since   = `}
                  <span style={{ color:'#fbbf24' }}>2022</span>{`\n\n    `}
                  <span style={{ color:'#a78bfa' }}>def </span>
                  <span style={{ color:'#fbbf24' }}>join</span>{`(self, dev):\n        self.members.append(dev)\n        dev.`}
                  <span style={{ color:'#fbbf24' }}>level_up</span>{`()\n        `}
                  <span style={{ color:'#a78bfa' }}>return </span>
                  <span style={{ color:'#00ff88' }}>"welcome 🚀"</span>{`\n\n`}
                  <span style={{ color:'#4a4a6a' }}># you belong here</span>{`\nclub = `}
                  <span style={{ color:'#4d9fff' }}>KPDevCell</span>{`()\nclub.`}
                  <span style={{ color:'#fbbf24' }}>join</span>{`(you)`}
                </pre>
              </div>
            </Brackets>
          </div>
        </div>
      </section>

      {/* ══ WHAT WE DO ════════════════════════════════ */}
      <section style={{ padding:'80px 0', borderBottom:'1px solid var(--border-dim)' }}>
        <div className="container">
          <SectionMark num="03" label="what we do" />
          <div style={s.whatGrid}>
            {[
              { n:'01', title:'Web Development',  desc:'Full-stack apps — React, FastAPI, MongoDB, Docker. End to end.', c:'var(--accent)'  },
              { n:'02', title:'Dev Sessions',     desc:'Weekly hands-on sessions. Real code, real problems. All levels.', c:'var(--accent2)' },
              { n:'03', title:'Hackathons',       desc:'72 hours. One problem. Your stack. Ship it.', c:'var(--accent3)' },
              { n:'04', title:'Open Source',      desc:'We maintain and contribute to real projects with real users.', c:'var(--warn)'    },
              { n:'05', title:'Code Reviews',     desc:'PRs, comments, debates on tabs vs spaces. Proper dev culture.', c:'var(--accent)'  },
              { n:'06', title:'Ship & Deploy',    desc:'Every project goes live. Docker, Netlify, Render — make it happen.', c:'var(--accent2)' },
            ].map(({ n, title, desc, c }) => (
              <div key={n} style={s.whatCard} 
                onMouseEnter={e => {
                 e.currentTarget.style.transform = 'translateY(-4px)'
                 e.currentTarget.style.background = '#1c1c2a'
                 e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)'
                }}
                onMouseLeave={e => {
                 e.currentTarget.style.transform = 'translateY(0)'
                 e.currentTarget.style.background = '#16161f'
                 e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
               }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:22, color:c, opacity:0.3 }}>{n}</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:18, color:c }}>⬡</span>
                </div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:600, marginBottom:10, color:'var(--text-primary)' }}>{title}</div>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-secondary)', lineHeight:1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EVENTS ════════════════════════════════════ */}
      <section style={{ padding:'80px 0', borderBottom:'1px solid var(--border-dim)' }}>
        <div className="container">
          <SectionMark num="04" label="upcoming events" />
          <div style={s.evGrid}>
            <Brackets style={{ width:'100%' }}>
              <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-dim)', borderRadius:6, padding:28, margin:12 }} className="pop-card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                  <span className="badge badge-green">HACKATHON</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)' }}>06 – 09 APR 2026</span>
                </div>
                <h3 style={{ fontFamily:'var(--font-pixel)', fontSize:'0.6rem', lineHeight:2, marginBottom:14 }}>
                  KP DEV CELL<br />INTERNAL HACKATHON
                </h3>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text-secondary)', lineHeight:1.8 }}>
                  72 hours. Build something real. Best project becomes the official Dev Cell website.
                  Your name in the footer for as long as the club exists.
                </p>
                <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--border-dim)', display:'flex', gap:24, flexWrap:'wrap' }}>
                  {[['DURATION','72 HRS'],['FORMAT','SOLO / TEAM'],['PRIZE','HOSTED FOREVER']].map(([k,v]) => (
                    <div key={k}>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-dim)', letterSpacing:'1px' }}>{k}</div>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--accent)', marginTop:4 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Brackets>

            <div style={{ paddingTop:12 }}>
              <div style={{ fontFamily:'var(--font-pixel)', fontSize:'0.5rem', color:'var(--accent2)', marginBottom:16, lineHeight:1.9 }}>MORE DROPPING SOON</div>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text-secondary)', lineHeight:1.8, marginBottom:24 }}>
                Sessions, workshops, collabs and more. Watch this space.
              </p>
              <Link to="/events" className="btn" style={{ fontSize:13 }}>./view_all_events →</Link>
              <div style={{ marginTop:36 }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-dim)', letterSpacing:'1px', marginBottom:12 }}>STACK WE USE</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {['React','FastAPI','MongoDB','Docker','Firebase','Python','TypeScript'].map(t => (
                    <span key={t} className="badge badge-green" style={{ fontSize:10 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ JOIN CTA ══════════════════════════════════ */}
      <section style={{ padding:'80px 0' }}>
        <div className="container">
          <Brackets color="rgba(0,255,136,0.25)" style={{ width:'100%' }}>
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-mid)', borderRadius:8, padding:'64px 32px', textAlign:'center', margin:0 }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--accent)', letterSpacing:'3px', marginBottom:20 }}>// join the club</div>
              <h2 style={{ fontFamily:'var(--font-pixel)', fontSize:'clamp(0.7rem,2.5vw,1.2rem)', lineHeight:1.9, marginBottom:20 }}>
                READY TO BUILD<br /><span style={{ color:'var(--accent)' }}>SOMETHING REAL?</span>
              </h2>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:14, color:'var(--text-secondary)', maxWidth:480, lineHeight:1.85, margin:'0 auto 32px' }}>
                KP Dev Cell is always looking for developers who want to ship, learn, and build things that matter.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <Link to="/team"     className="btn btn-primary" style={{ fontSize:13 }}>$ meet_the_team</Link>
                <Link to="/projects" className="btn"             style={{ fontSize:13 }}>./explore_projects</Link>
              </div>
            </div>
          </Brackets>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: {
    position:'relative', minHeight:'92vh',
    display:'flex', flexDirection:'column',
    borderBottom:'1px solid var(--border-dim)', overflow:'hidden',
  },
  dotBg: { position:'absolute', inset:0, pointerEvents:'none' },
  hc: { position:'absolute', width:22, height:22, borderColor:'rgba(0,255,136,0.25)', borderStyle:'solid' },
  heroGrid: {
    display:'grid', gridTemplateColumns:'1fr 1fr',
    gap:56, alignItems:'center',
    padding:'80px 32px 48px',
    position:'relative', zIndex:1, flex:1,
  },
  pill: {
    display:'inline-flex', alignItems:'center', gap:8,
    border:'1px solid var(--border-mid)', borderRadius:100,
    padding:'5px 14px', marginBottom:28,
  },
  pillDot: {
    width:6, height:6, borderRadius:'50%',
    background:'var(--accent)', display:'inline-block',
    boxShadow:'0 0 6px var(--accent)',
    animation:'blink 2s ease-in-out infinite',
  },
  title: {
    fontFamily:'var(--font-pixel)',
    fontSize:'clamp(1.4rem,4vw,2.8rem)',
    lineHeight:1.55, marginBottom:24,
  },
  sub: {
    fontFamily:'var(--font-mono)', fontSize:14,
    color:'var(--text-secondary)', lineHeight:1.9, marginBottom:32,
  },
  terminal: {
    background:'var(--bg-surface)',
    border:'1px solid var(--border-mid)',
    borderRadius:6, overflow:'hidden', margin:12,
  },
  termBar: {
    background:'var(--bg-elevated)',
    borderBottom:'1px solid var(--border-dim)',
    padding:'10px 14px', display:'flex', alignItems:'center', gap:10,
  },
  statsGrid: {
    display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',
    border:'1px solid var(--border-dim)', borderRadius:8, overflow:'hidden',
  },
  statCard: {
    padding:'32px 28px', background:'var(--bg-card)',
    borderRight:'1px solid var(--border-dim)',
  },
  aboutGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' },
  bodyText: { fontFamily:'var(--font-mono)', fontSize:14, color:'var(--text-secondary)', lineHeight:1.85 },
  whatGrid: {
    display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',
    border:'1px solid var(--border-dim)', borderRadius:8,
  },
  whatCard: {
  padding:'28px 24px', background:'var(--bg-card)',
  borderRight:'1px solid var(--border-dim)',
  borderBottom:'1px solid var(--border-dim)',
  transition:'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease',
},
  evGrid: { display:'grid', gridTemplateColumns:'3fr 2fr', gap:32, alignItems:'start' },
}

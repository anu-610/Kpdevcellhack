import { useEffect } from 'react'
import { Code, Shield, Terminal, Cpu, MapPin, Mail, ExternalLink } from 'lucide-react'
import PageBackdrop from '../components/PageBackdrop'
import ScrollReveal from '../components/ScrollReveal'
import ElectricBorder from '../components/ElectricBorder'

const values = [
  { icon: Code,     title: 'Build Real Things',   desc: "We ship production-grade software, not just side projects. Every line of code solves a real problem.",              color: '#00ff88' },
  { icon: Shield,   title: 'Break to Understand', desc: "Security isn't an afterthought. We actively break systems to understand how they work from the inside.",            color: '#ff6b6b' },
  { icon: Terminal, title: 'Own the Stack',        desc: "From kernel to cloud. We run our own servers, manage our own infra, and learn from every failure.",                color: '#ffd93d' },
  { icon: Cpu,      title: 'Open Source First',   desc: "Everything we build is shared. We believe in transparency, community, and learning in public.",                    color: '#6bcfff' },
]

const timeline = [
  { year: '2018', event: 'Founded as the PROGRAMMING CLUB at IIT Mandi' },
  { year: '2020', event: 'Rebranded to Kamand Prompt — expanded scope to full-stack and open source' },
  { year: '2021', event: 'First CTF team formed. Participated in 10+ national competitions' },
  { year: '2022', event: 'Launched KP Dev Cell as the engineering arm of the club' },
  { year: '2023', event: 'Open sourced 5+ internal tools. 50+ active members across domains' },
  { year: '2024', event: 'Hosted MANY Tech Meet events. Expanded mentorship programs' },
]

const contacts = [
  { icon: MapPin,      text: 'IIT Mandi, HP',              href: null },
  { icon: Mail,        text: 'b25379@students.iitmandi.ac.in',     href: 'mailto:b25379@students.iitmandi.ac.in' },
  { icon: ExternalLink,text: 'GitHub — KamandPrompt',      href: 'https://github.com/KamandPrompt' },
]

export default function About() {
  useEffect(() => { document.title = 'About — KAMAND PROMPT' }, [])

  return (
    <div style={{ position: 'relative', background: '#080a0c' }}>
      <PageBackdrop />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ height: 62 }} />

        {/* Hero */}
        <section style={{ padding: 'clamp(56px,10vw,96px) clamp(20px,5vw,72px) 56px', maxWidth: 1280, margin: '0 auto' }}>
          <ScrollReveal>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>About Us</p>
            <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', fontWeight: 700, color: '#e0eef8', letterSpacing: '-0.025em', margin: '0 0 18px', maxWidth: 640 }}>
              Kamand Prompt
            </h1>
            <p style={{ color: '#6a8090', fontSize: 'clamp(0.86rem, 1.4vw, 0.97rem)', lineHeight: 1.8, maxWidth: 580, margin: 0 }}>
              We are the Programming club of IIT Mandi — a community of students who build, break, and learn together.
              From system administration to full-stack development, from CTF competitions to open source contributions,
              we work on real problems with real stakes.
            </p>
          </ScrollReveal>
        </section>

        {/* Values */}
        <section style={{ padding: '0 clamp(20px,5vw,72px) 64px', maxWidth: 1280, margin: '0 auto' }}>
          <ScrollReveal>
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#e0eef8', fontWeight: 600, margin: '0 0 26px' }}>What We Stand For</h2>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={0.07 * (i + 1)}>
                <ElectricBorder color={v.color} speed={0.6} chaos={0.07} thickness={1.2} style={{ borderRadius: 14 }}>
                  <div style={{ background: '#0b1016', borderRadius: 14, padding: 'clamp(16px,2.5vw,24px)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${v.color}10`, border: `1px solid ${v.color}24`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <v.icon size={17} style={{ color: v.color }} />
                    </div>
                    <h3 style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e0eef8', fontSize: '0.86rem', fontWeight: 600, margin: '0 0 7px' }}>{v.title}</h3>
                    <p style={{ color: '#5a7080', fontSize: '0.8rem', lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
                  </div>
                </ElectricBorder>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section style={{ padding: '0 clamp(20px,5vw,72px) 64px', maxWidth: 1280, margin: '0 auto' }}>
          <ScrollReveal>
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#e0eef8', fontWeight: 600, margin: '0 0 32px' }}>Our Journey</h2>
          </ScrollReveal>
          <div style={{ position: 'relative', paddingLeft: 26 }}>
            <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'linear-gradient(to bottom, rgba(0,255,136,0.4), transparent)' }} />
            {timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={0.07 * (i + 1)}>
                <div style={{ position: 'relative', marginBottom: 26 }}>
                  <div style={{ position: 'absolute', left: -30, top: 5, width: 7, height: 7, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 7px rgba(0,255,136,0.5)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', color: 'rgba(0,255,136,0.6)', letterSpacing: '0.1em', display: 'block', marginBottom: 3 }}>{item.year}</span>
                  <p style={{ color: '#7a8e9e', fontSize: '0.86rem', lineHeight: 1.65, margin: 0, maxWidth: 540 }}>{item.event}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Contact strip */}
        <section style={{ padding: '0 clamp(20px,5vw,72px) 72px', maxWidth: 1280, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ padding: 'clamp(22px,4vw,36px)', background: '#0b1016', border: '1px solid #1a2535', borderRadius: 16, display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e0eef8', fontSize: 'clamp(0.95rem,2vw,1.2rem)', fontWeight: 600, margin: '0 0 6px' }}>Want to get involved?</h2>
                <p style={{ color: '#5a7080', fontSize: '0.83rem', margin: 0 }}>Reach out — we're always looking for curious people.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {contacts.map(({ icon: Icon, text, href }) =>
                  href ? (
                    <a key={text} href={href} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 8, border: '1px solid #1e2a38', background: '#0f1820', color: '#7a8e9e', fontSize: '0.78rem', textDecoration: 'none', transition: 'color 0.15s, border-color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#00ff88'; e.currentTarget.style.borderColor = 'rgba(0,255,136,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#7a8e9e'; e.currentTarget.style.borderColor = '#1e2a38' }}
                    >
                      <Icon size={12} /> {text}
                    </a>
                  ) : (
                    <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 8, border: '1px solid #1e2a38', background: '#0f1820', color: '#7a8e9e', fontSize: '0.78rem' }}>
                      <Icon size={12} /> {text}
                    </span>
                  )
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  )
}
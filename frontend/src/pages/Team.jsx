import { useEffect, useState } from 'react'
import SkeletonCard from '../components/SkeletonCard'
import ScrollReveal from '../components/ScrollReveal'
import PageBackdrop from '../components/PageBackdrop'
import { getTeamMembers } from '../lib/api'

/* ─────────────────────────────────────────
   TeamCard — compact photo card
───────────────────────────────────────── */
function TeamCard({ name, role, photo_url, github, linkedin }) {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-[#111] border border-[#222] hover:border-[#00ff88]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00ff88]/10">
      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none z-10" />

      {/* Photo */}
      <div className="relative w-full aspect-square bg-[#0d0d0d] overflow-hidden">
        {photo_url ? (
          <img
            src={photo_url}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        {/* Fallback initials */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00ff88]/10 to-[#0066ff]/10 ${photo_url ? 'hidden' : ''}`}
        >
          <span className="font-mono text-[#00ff88] text-xl font-bold">
            {name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?'}
          </span>
        </div>

        {/* Social icons — bottom-left of photo */}
        {(linkedin || github) && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-20">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                aria-label="LinkedIn"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 26, height: 26, borderRadius: 6,
                  backgroundColor: '#0077b5', color: 'white', transition: 'transform 0.2s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                aria-label="GitHub"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 26, height: 26, borderRadius: 6,
                  backgroundColor: '#333', color: 'white', transition: 'transform 0.2s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Name + Role */}
      <div className="px-3 py-2.5 text-center">
        <h3 className="font-medium text-white text-sm leading-tight truncate">{name}</h3>
        <p className="text-[#666] text-xs truncate mt-0.5">{role}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Placeholder card (empty domain slot)
───────────────────────────────────────── */
function PlaceholderCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#0d0d0d] border border-[#1a1a1a] border-dashed">
      <div className="w-full aspect-square flex flex-col items-center justify-center gap-1">
        <span className="text-[#2a2a2a] text-2xl">+</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: '#2a2a2a',
            letterSpacing: '0.05em',
          }}
        >
          joining soon
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Section Title
───────────────────────────────────────── */
function SectionTitle({ children, colors = ['#00ff88', '#ffffff'] }) {
  const words = children.split(' ')
  return (
    <h2
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      className="text-2xl md:text-3xl font-bold text-center mb-10 tracking-wide"
    >
      {words.map((word, i) => (
        <span key={i} style={{ color: colors[i % colors.length] }}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h2>
  )
}

const domainConfig = [
  { key: 'web',        label: 'Web Development',   colors: ['#00ff88', '#ffffff'] },
  { key: 'infosec',   label: 'InfoSec & CTF',      colors: ['#ff6b6b', '#ffffff'] },
  { key: 'sysadmin',  label: 'System Admin',        colors: ['#ffd93d', '#ffffff'] },
  { key: 'opensource',label: 'Open Source & AI',   colors: ['#6bcfff', '#ffffff'] },
]

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function Team() {
  const [teamMembers, setTeamMembers] = useState({
    advisors: [],
    coordinators: [],
    core: [],
    byDomain: { web: [], infosec: [], sysadmin: [], opensource: [] },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Team — KP Dev Cell'

    let mounted = true

    const fetchTeam = async () => {
      try {
        const { data, error } = await getTeamMembers({ isActive: true })
        if (mounted && !error && data) {
          setTeamMembers({
            advisors: data.filter(m => m.category === 'advisor'),
            coordinators: data.filter(m => m.category === 'coordinator'),
            core: data.filter(m => m.category === 'core'),
            byDomain: {
              web:        data.filter(m => m.domain === 'web'),
              infosec:    data.filter(m => m.domain === 'infosec'),
              sysadmin:   data.filter(m => m.domain === 'sysadmin'),
              opensource: data.filter(m => m.domain === 'opensource'),
            },
          })
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchTeam()

    return () => {
      mounted = false
    }
  }, [])

  // Shared grid class — 3 cols mobile-sm, 4 tablet, 5 desktop, 6 wide
  const gridClass = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4'

  return (
    <div style={{ position: 'relative' }}>
      <PageBackdrop />

      {/* ── Scrollable content layer ── */}
      <div
        className="page-enter"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Spacer for fixed navbar */}
        <div style={{ height: 64 }} aria-hidden="true" />

        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px 80px' }}>

          {/* ── Faculty Advisors ── */}
          {(loading || teamMembers.advisors.length > 0) && (
            <section style={{ marginBottom: 72 }}>
              <ScrollReveal>
                <SectionTitle colors={['#00ff88', '#0066ff']}>Faculty Advisor</SectionTitle>
              </ScrollReveal>
              {loading ? (
                <div className="flex justify-center">
                  <div style={{ width: 140 }}><SkeletonCard type="team" /></div>
                </div>
              ) : (
                <div className="flex justify-center gap-4 flex-wrap">
                  {teamMembers.advisors.map((m, i) => (
                    // inline=true → display:contents so flex parent sees card directly
                    <ScrollReveal key={m.id} delay={0.1 * (i + 1)} inline>
                      <div style={{ width: 140 }}>
                        <TeamCard {...m} />
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Coordinators ── */}
          <section style={{ marginBottom: 72 }}>
            <ScrollReveal>
              <SectionTitle colors={['#ff6b6b', '#ffd93d']}>Coordinators</SectionTitle>
            </ScrollReveal>
            {loading ? (
              <div className={gridClass}>
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} type="team" />)}
              </div>
            ) : teamMembers.coordinators.length > 0 ? (
              <div className={gridClass}>
                {teamMembers.coordinators.map((m, i) => (
                  // inline=true makes ScrollReveal transparent to grid
                  <ScrollReveal key={m.id} delay={0.05 * (i + 1)} inline>
                    <TeamCard {...m} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#444] text-sm">No coordinators listed yet.</p>
            )}
          </section>

          {/* ── Domain Teams ── */}
          {domainConfig.map(({ key, label, colors }) => (
            <section key={key} style={{ marginBottom: 72 }}>
              <ScrollReveal>
                <SectionTitle colors={colors}>{label}</SectionTitle>
              </ScrollReveal>
              {loading ? (
                <div className={gridClass}>
                  {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} type="team" />)}
                </div>
              ) : teamMembers.byDomain[key].length > 0 ? (
                <div className={gridClass}>
                  {teamMembers.byDomain[key].map((m, i) => (
                    <ScrollReveal key={m.id} delay={0.04 * ((i % 7) + 1)} inline>
                      <TeamCard {...m} />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                // Empty domain — show 6 placeholder slots
                <div className={gridClass}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <ScrollReveal key={i} delay={0.06 * i} inline>
                      <PlaceholderCard />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* ── Legacy core members without domain ── */}
          {!loading && teamMembers.core.filter(m => !m.domain).length > 0 && (
            <section style={{ marginBottom: 72 }}>
              <ScrollReveal>
                <SectionTitle colors={['#6bcfff', '#00ff88']}>Core Members</SectionTitle>
              </ScrollReveal>
              <div className={gridClass}>
                {teamMembers.core.filter(m => !m.domain).map((m, i) => (
                  <ScrollReveal key={m.id} delay={0.04 * ((i % 7) + 1)} inline>
                    <TeamCard {...m} />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Images } from 'lucide-react'
import PageBackdrop from '../components/PageBackdrop'
import ScrollReveal from '../components/ScrollReveal'
import { getHighlights } from '../lib/api'

// ── Interactive expanding photo strip (smaller version) ────
function PhotoStrip({ photos }) {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState([])

  useEffect(() => {
    if (!photos.length) return
    setActive(0)
    setVisible([])
    const timers = photos.map((_, i) =>
      setTimeout(() => setVisible(prev => [...prev, i]), 100 * i) // faster stagger
    )
    return () => timers.forEach(clearTimeout)
  }, [photos])

  if (!photos.length) return null

  return (
    <div style={{
      display: 'flex', width: '100%', height: 'clamp(180px, 25vw, 280px)', // smaller height
      overflow: 'hidden', borderRadius: 14,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      {photos.map((photo, i) => {
        const isActive = i === active
        const isVis = visible.includes(i)
        return (
          <div
            key={photo.id || i}
            onClick={() => setActive(i)}
            style={{
              position: 'relative',
              flex: isActive ? '6 1 0%' : '1 1 0%',
              minWidth: 48,
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'flex 0.5s cubic-bezier(0.4,0,0.2,1)',
              opacity: isVis ? 1 : 0,
              transform: isVis ? 'translateX(0)' : 'translateX(-30px)',
              transitionDelay: isVis ? '0s' : `${0.1 * i}s`,
              borderLeft: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url('${photo.image_url}')`,
              backgroundSize: isActive ? 'cover' : 'auto 120%',
              backgroundPosition: 'center',
              transition: 'background-size 0.5s ease',
              filter: isActive ? 'none' : 'brightness(0.6)',
            }} />

            <div style={{
              position: 'absolute', inset: 0,
              background: isActive
                ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
            }} />

            <div style={{
              position: 'absolute', bottom: 12, left: 10, right: 10,
              display: 'flex', alignItems: 'flex-end', gap: 8, zIndex: 2,
            }}>
              {!isActive && (
                <p style={{
                  writingMode: 'vertical-rl', textOrientation: 'mixed',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)',
                  margin: 0, letterSpacing: '0.08em',
                  transform: 'rotate(180deg)',
                  maxHeight: 90, overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}>
                  {photo.title}
                </p>
              )}

              {isActive && (
                <div style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: 'opacity 0.3s 0.2s',
                }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {photo.title}
                  </p>
                  {photo.description && (
                    <p style={{ fontSize: '0.7rem', color: 'rgba(200,220,230,0.8)', margin: '2px 0 0', lineHeight: 1.3 }}>
                      {photo.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {isActive && (
              <div style={{
                position: 'absolute', inset: 0,
                boxShadow: 'inset 0 0 0 1.5px rgba(0,255,136,0.5)',
                pointerEvents: 'none',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Highlights() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Highlights — KP Dev Cell'
    let mounted = true

    getHighlights().then(({ data }) => {
      if (mounted) {
        setPhotos(data || [])
        setLoading(false)
      }
    })

    return () => { mounted = false }
  }, [])

  return (
    <div style={{ position: 'relative', background: '#080a0c' }}>
      <PageBackdrop />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ height: 50 }} /> {/* reduced spacer */}

        {/* Header - more compact */}
        <section style={{ padding: 'clamp(32px, 6vw, 60px) clamp(20px, 5vw, 72px) 24px', maxWidth: 1000, margin: '0 auto' }}>
          <ScrollReveal>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', marginBottom: 8 }}>
              Highlights
            </p>
            <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#e0eef8', margin: '0 0 8px' }}>
              What We've Done
            </h1>
            <p style={{ color: '#5a7280', fontSize: '0.85rem', maxWidth: 420, margin: 0 }}>
              Moments from the KP Dev Cell community.
            </p>
          </ScrollReveal>
        </section>

        {/* Gallery - smaller padding */}
        <section style={{ padding: '0 clamp(20px,5vw,72px) 56px', maxWidth: 1000, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Images size={14} style={{ color: '#67c7ff' }} />
              <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#e0eef8', fontWeight: 600, margin: 0 }}>
                Workshop & Event Gallery
              </h2>
            </div>
          </ScrollReveal>

          {loading ? (
            <div style={{ height: 200, background: '#0b1016', borderRadius: 14, border: '1px solid #1a2535', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#2a3a4a', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>Loading gallery…</span>
            </div>
          ) : photos.length > 0 ? (
            <PhotoStrip photos={photos} />
          ) : (
            <div style={{ padding: '32px 20px', textAlign: 'center', border: '1px dashed #1a2535', borderRadius: 14, background: 'rgba(8,11,16,0.5)' }}>
              <Images size={20} style={{ color: '#1e2e3e', marginBottom: 8 }} />
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#2a3a4a', margin: 0 }}>
                No photos uploaded yet. Admins can add event photos from the admin panel.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
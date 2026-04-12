import { Calendar, Clock3, ExternalLink, FileText, Info, MapPin, User, Download } from 'lucide-react'
import { useState } from 'react'

// Show date + time if time is not midnight
function formatDateTime(d) {
  if (!d) return ''
  const date = new Date(d)
  const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const hours   = date.getHours()
  const mins    = date.getMinutes()
  // Only show time if it's not midnight (00:00)
  if (hours === 0 && mins === 0) return dateStr
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${dateStr}, ${timeStr}`
}

function formatDateOnly(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function EventMeta({ icon: Icon, label, value, accent = '#8c9aad' }) {
  if (!value) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '8px 12px', borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(255,255,255,0.02)',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent, border: `1px solid ${accent}22`, background: `${accent}10`, marginTop: 1,
      }}>
        <Icon size={13} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#677588' }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: '0.83rem', lineHeight: 1.4, color: '#d4dce6', wordBreak: 'break-word' }}>{value}</p>
      </div>
    </div>
  )
}

// Compact PDF pill shown on the card
function PdfPill({ url, accent }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 12px', borderRadius: 100,
        border: `1px solid rgba(87,162,255,0.35)`,
        background: 'rgba(87,162,255,0.08)',
        color: '#57a2ff', fontSize: '0.75rem', fontWeight: 500,
        textDecoration: 'none',
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(87,162,255,0.16)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(87,162,255,0.08)' }}
    >
      <FileText size={12} /> View PDF
    </a>
  )
}

export default function EventCard({
  title, description, date, deadline, speaker,
  resources_link, banner_url, pdf_url,
  is_upcoming, location,
  className = '',
}) {
  const [showDetails, setShowDetails] = useState(false)
  const accent = is_upcoming ? '#00ff88' : '#67c7ff'
  const glow   = is_upcoming ? 'rgba(0,255,136,0.3)' : 'rgba(103,199,255,0.3)'

  return (
    <>
      {/* ── Card ── */}
      <div
        className={className}
        style={{
          position: 'relative', borderRadius: 20,
          boxShadow: `0 0 0 1px ${accent}44, 0 0 20px ${glow}, 0 8px 32px rgba(0,0,0,0.3)`,
          background: '#0d1218', overflow: 'hidden',
          transition: 'box-shadow 0.3s',
          height: '100%', display: 'flex', flexDirection: 'column',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}88, 0 0 32px ${glow}, 0 12px 40px rgba(0,0,0,0.4)` }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}44, 0 0 20px ${glow}, 0 8px 32px rgba(0,0,0,0.3)` }}
      >
        {/* Radial top glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: `radial-gradient(ellipse at top, ${is_upcoming ? 'rgba(0,255,136,0.06)' : 'rgba(103,199,255,0.08)'} 0%, transparent 60%)` }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Banner */}
          <div style={{ position: 'relative', height: 130, overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(135deg,#10212a,#0e151d,#0b1118)', flexShrink: 0 }}>
            {banner_url && (
              <img src={banner_url} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none' }} />
            )}
            {!banner_url && (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.5 }}>{title}</span>
              </div>
            )}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)' }} />
            {/* Status badge */}
            <div style={{ position: 'absolute', top: 10, left: 12 }}>
              <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, border: `1px solid ${accent}35`, background: `${accent}12` }}>
                {is_upcoming ? 'Upcoming' : 'Past Event'}
              </span>
            </div>
            {/* PDF badge on banner if pdf exists */}
            {pdf_url && (
              <div style={{ position: 'absolute', top: 10, right: 12 }}>
                <span style={{ padding: '3px 8px', borderRadius: 100, fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#57a2ff', border: '1px solid rgba(87,162,255,0.3)', background: 'rgba(87,162,255,0.12)' }}>
                  PDF
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '14px 16px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Title + desc */}
            <div style={{ marginBottom: 10 }}>
              <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.93rem', fontWeight: 600, color: '#fff', margin: '0 0 5px', lineHeight: 1.35 }}>
                {title}
              </h3>
              {description && (
                <p style={{ fontSize: '0.82rem', lineHeight: 1.55, color: '#8a9aac', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {description}
                </p>
              )}
            </div>

            {/* Meta rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
              <EventMeta icon={Calendar} label="Date"     value={formatDateTime(date)}     accent={accent}    />
              {deadline && <EventMeta icon={Clock3}   label="Deadline" value={formatDateTime(deadline)} accent="#67c7ff"   />}
              {speaker  && <EventMeta icon={User}     label="Speaker"  value={speaker}                  accent="#8fd0ff"   />}
              {location && <EventMeta icon={MapPin}   label="Location" value={location}                 accent="#8fd0ff"   />}
            </div>

            {/* Bottom actions */}
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              {/* PDF pill — always show if pdf exists */}
              <PdfPill url={pdf_url} accent={accent} />

              {/* View details / Resources button */}
              <div style={{ marginLeft: 'auto' }}>
                {is_upcoming ? (
                  <button
                    onClick={() => setShowDetails(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 100, cursor: 'pointer', border: `1px solid ${accent}55`, background: 'transparent', color: accent, fontSize: '0.82rem', fontWeight: 500, transition: 'background 0.15s, box-shadow 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.boxShadow = `0 0 14px ${accent}25` }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <Info size={13} /> Details
                  </button>
                ) : resources_link ? (
                  <a
                    href={resources_link} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 18px', borderRadius: 100, border: `1px solid ${accent}55`, background: 'transparent', color: accent, fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${accent}10` }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <FileText size={13} /> Resources
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail modal ── */}
      {showDetails && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)', padding: 16 }}
          onClick={() => setShowDetails(false)}
        >
          <div
            style={{ width: '100%', maxWidth: 640, maxHeight: '92vh', overflowY: 'auto', borderRadius: 22, border: `1px solid ${accent}33`, background: '#0d1218', boxShadow: `0 24px 90px rgba(0,0,0,0.45), 0 0 40px ${glow}`, scrollbarWidth: 'thin', scrollbarColor: '#1e2a38 transparent' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ position: 'sticky', top: 0, zIndex: 1, padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,18,24,0.97)', backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, border: `1px solid ${accent}35`, background: `${accent}12` }}>
                    {is_upcoming ? 'Upcoming' : 'Past Event'}
                  </span>
                  <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(1rem,2.5vw,1.25rem)', fontWeight: 600, color: '#fff', margin: '9px 0 0', lineHeight: 1.3 }}>{title}</h2>
                </div>
                <button onClick={() => setShowDetails(false)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8694', flexShrink: 0 }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l8 8M3 11L11 3" /></svg>
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div style={{ padding: '18px 22px 26px' }}>
              {banner_url && (
                <div style={{ marginBottom: 18, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <img src={banner_url} alt={title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              {/* Meta grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
                <EventMeta icon={Calendar} label="Date"     value={formatDateTime(date)}     accent={accent}  />
                {deadline && <EventMeta icon={Clock3}   label="Deadline" value={formatDateTime(deadline)} accent="#67c7ff" />}
                {speaker  && <EventMeta icon={User}     label="Speaker"  value={speaker}                  accent="#8fd0ff" />}
                {location && <EventMeta icon={MapPin}   label="Location" value={location}                 accent="#8fd0ff" />}
              </div>

              {/* Description */}
              {description && (
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', color: '#e0eef8', margin: '0 0 8px' }}>About this event</h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#a0b0c0', margin: 0, whiteSpace: 'pre-line' }}>{description}</p>
                </div>
              )}

              {/* Action buttons row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                {/* PDF — open + download */}
                {pdf_url && (
                  <>
                    <a
                      href={pdf_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100, background: 'rgba(87,162,255,0.1)', border: '1px solid rgba(87,162,255,0.3)', color: '#57a2ff', fontSize: '0.83rem', fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(87,162,255,0.18)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(87,162,255,0.1)' }}
                    >
                      <FileText size={14} /> Open PDF
                    </a>
                    <a
                      href={pdf_url} download
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100, background: 'transparent', border: '1px solid #1e2a38', color: '#7a8e9e', fontSize: '0.83rem', fontWeight: 500, textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e3e52'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2a38'; e.currentTarget.style.color = '#7a8e9e' }}
                    >
                      <Download size={14} /> Download
                    </a>
                  </>
                )}

                {/* External resources link */}
                {resources_link && (
                  <a
                    href={resources_link} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 100, background: accent, color: is_upcoming ? '#000' : '#091019', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    <ExternalLink size={14} /> View Resources
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, FileText, Calendar, User } from 'lucide-react'
import { getPostById } from '../lib/api'
import PageBackdrop from '../components/PageBackdrop'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ResourcePost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    getPostById(id).then(({ data, error: err }) => {
      if (!mounted) return
      if (err || !data) { setError('Post not found') }
      else { setPost(data); document.title = `${data.title} — KP Dev Cell` }
      setLoading(false)
    })

    return () => { mounted = false }
  }, [id])

  const tags = post?.tags
    ? (typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()) : post.tags)
    : []

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ position: 'relative' }}>
        <PageBackdrop />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: 96, paddingBottom: 80 }}>
          <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 2rem' }}>
            <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 6, marginBottom: 40 }} />
            <div className="skeleton" style={{ height: 40, width: '78%', borderRadius: 8, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 14, width: 180, borderRadius: 6, marginBottom: 32 }} />
            {[100, 95, 88, 100, 82, 90, 70].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, borderRadius: 4, marginBottom: 12 }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div style={{ position: 'relative' }}>
        <PageBackdrop />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem', color: '#ff6b6b', letterSpacing: '0.15em',
              textTransform: 'uppercase', marginBottom: '1rem',
            }}>404 not found</div>
            <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.4rem', color: '#fff', margin: '0 0 0.75rem' }}>
              Post not found
            </h1>
            <p style={{ color: '#5a7080', fontSize: '0.88rem', marginBottom: '2rem' }}>
              This resource doesn't exist or was removed.
            </p>
            <Link
              to="/resources"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#00ff88', textDecoration: 'none', fontSize: '0.88rem', fontFamily: "'JetBrains Mono', monospace" }}
            >
              <ArrowLeft size={16} /> Back to Resources
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Post ──
  return (
    <div style={{ position: 'relative' }}>
      <PageBackdrop />

      <div className="page-enter" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ height: 64 }} />

        {/* Top bar */}
        <div style={{ borderBottom: '1px solid #0f1a25', padding: '1.25rem 0' }}>
          <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 2rem' }}>
            <Link
              to="/resources"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: '#4a6070', textDecoration: 'none', fontSize: '0.82rem',
                fontFamily: "'JetBrains Mono', monospace',",
                transition: 'color 0.15s',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a6070'}
            >
              <ArrowLeft size={15} /> resources
            </Link>
          </div>
        </div>

        <article style={{ maxWidth: 740, margin: '0 auto', padding: '3rem 2rem 6rem' }}>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
              {tags.map((tag, i) => (
                <span key={i} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.68rem',
                  color: '#00ff88',
                  background: 'rgba(0,255,136,0.06)',
                  border: '1px solid rgba(0,255,136,0.2)',
                  borderRadius: 100,
                  padding: '3px 10px',
                  letterSpacing: '0.05em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: '#e8f2fb',
            lineHeight: 1.2,
            margin: '0 0 1.25rem',
            letterSpacing: '-0.02em',
          }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem', alignItems: 'center' }}>
            {post.author_name && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5a7080', fontSize: '0.82rem' }}>
                <User size={13} style={{ color: '#3a5060' }} />
                {post.author_name}
              </span>
            )}
            {post.published_at && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5a7080', fontSize: '0.82rem' }}>
                <Calendar size={13} style={{ color: '#3a5060' }} />
                {formatDate(post.published_at)}
              </span>
            )}
          </div>

          {/* PDF attachments */}
          {post.pdf_url && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
              padding: '1.25rem 1.5rem',
              background: '#080c12',
              border: '1px solid #1a2535',
              borderRadius: 12,
              marginBottom: '2.5rem',
            }}>
              <a
                href={post.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '7px 16px',
                  background: 'rgba(103,199,255,0.08)',
                  border: '1px solid rgba(103,199,255,0.3)',
                  borderRadius: 100,
                  color: '#67c7ff',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(103,199,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(103,199,255,0.08)'}
              >
                <FileText size={14} /> Open PDF
              </a>
              <a
                href={post.pdf_url}
                download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '7px 16px',
                  background: 'transparent',
                  border: '1px solid #1e2a38',
                  borderRadius: 100,
                  color: '#7a8a9a',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e3e52'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2a38'; e.currentTarget.style.color = '#7a8a9a' }}
              >
                <ExternalLink size={14} /> Download
              </a>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(to right, #1a2535, transparent)', marginBottom: '2.5rem' }} />

          {/* Body */}
          <div style={{
            color: '#c0cfd8',
            fontSize: '0.96rem',
            lineHeight: 1.85,
            whiteSpace: 'pre-wrap',
            fontFamily: "'Inter', sans-serif",
          }}>
            {post.content}
          </div>

          {/* Footer nav */}
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #0f1a25' }}>
            <Link
              to="/resources"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: '#4a6070', textDecoration: 'none', fontSize: '0.82rem',
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#00ff88'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a6070'}
            >
              <ArrowLeft size={14} /> All resources
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
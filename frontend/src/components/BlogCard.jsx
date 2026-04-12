import { ArrowUpRight, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function BlogCard({
  id,
  title,
  author_name,
  published_at,
  tags = [],
  content,
  pdf_url,
  className = '',
}) {
  const navigate = useNavigate()

  const excerpt = content
    ? content.slice(0, 180) + (content.length > 180 ? '...' : '')
    : ''

  const tagArray = typeof tags === 'string'
    ? tags.split(',').map((t) => t.trim()).filter(Boolean)
    : Array.isArray(tags) ? tags : []

  return (
    <div
      className={`group relative w-full min-w-0 cursor-pointer rounded-[22px] border border-[#1e3a2b] bg-[#0d1a14] p-5 card-hover ${className}`}
      style={{ boxShadow: '0 0 0 1px rgba(0,255,136,0.06), 0 4px 24px rgba(0,0,0,0.4)' }}
      onClick={() => navigate(`/resources/${id}`)}
    >
      {/* subtle green top glow line */}
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)', borderRadius: 1 }} />

      <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_top_left,rgba(0,255,136,0.07),transparent_38%),radial-gradient(circle_at_85%_20%,rgba(103,199,255,0.05),transparent_28%)]" />

      <div className="relative flex h-full flex-col">
        {(tagArray.length > 0 || pdf_url) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tagArray.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded-full border border-[#2b3a4c] bg-[#101721] px-2.5 py-1 font-mono text-[0.68rem] text-[#8fd9ff]"
              >
                {tag}
              </span>
            ))}
            {tagArray.length > 3 && (
              <span className="text-[0.7rem] text-[#5f6f82]">
                +{tagArray.length - 3}
              </span>
            )}
            {pdf_url && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#1e4a6a] bg-[#0d1e2e] px-2.5 py-1 text-[0.68rem] text-[#67c7ff]">
                <FileText size={12} />
                PDF
              </span>
            )}
          </div>
        )}

        <h3 className="mb-2 text-base font-semibold leading-7 text-[#d4f0e0] transition-colors group-hover:text-[#00ff88]">
          {title}
        </h3>

        {excerpt && (
          <p className="mb-5 line-clamp-3 text-[0.88rem] leading-7 text-[#7a9a8a]">
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#1a3025] pt-4 text-xs text-[#4a7a5a]">
          <div className="flex items-center gap-2">
            {author_name && (
              <>
                <span className="text-[#5a8a6a]">{author_name}</span>
                <span>·</span>
              </>
            )}
            <span>{formatDate(published_at)}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[#4a9a6a] transition-colors group-hover:text-[#00ff88]">
            Read
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </div>
  )
}
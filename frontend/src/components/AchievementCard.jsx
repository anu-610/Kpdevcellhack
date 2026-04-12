import { Trophy } from 'lucide-react'

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AchievementCard({
  title,
  description,
  date,
  image_url,
  className = '',
}) {
  return (
    <div className={`relative overflow-hidden rounded-[22px] border border-[#1e2a3b] bg-[#0d1218] flash-card ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.1),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(0,255,136,0.08),transparent_28%)]" />

      {image_url ? (
        <div className="relative h-40 overflow-hidden border-b border-white/6">
          <img src={image_url} alt={title} className="h-full w-full object-cover" />
          <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3a3220] bg-[#17120b]/92 backdrop-blur-sm">
            <Trophy size={20} className="text-[#fbbf24]" />
          </div>
        </div>
      ) : null}

      <div className="relative p-5">
        {!image_url && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3a3220] bg-[#17120b]">
            <Trophy size={22} className="text-[#fbbf24]" />
          </div>
        )}

        <h3 className="mb-2 text-base font-medium leading-7 text-white">
          {title}
        </h3>

        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#6f7d8f]">
          {formatDate(date)}
        </p>

        {description && (
          <p className="line-clamp-3 text-[0.88rem] leading-7 text-[#92a1b3]">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

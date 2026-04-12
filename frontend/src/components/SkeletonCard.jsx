export default function SkeletonCard({ type = 'team', className = '' }) {
  if (type === 'team') {
    return (
      <div className={`bg-[#111111] border border-[#1a1a1a] rounded-[10px] p-6 ${className}`}>
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full skeleton" />
        </div>
        {/* Name */}
        <div className="h-5 skeleton mx-auto mb-2" style={{ width: '60%' }} />
        {/* Role */}
        <div className="h-4 skeleton mx-auto mb-1" style={{ width: '40%' }} />
        {/* Batch */}
        <div className="h-3 skeleton mx-auto" style={{ width: '30%' }} />
        {/* Social links */}
        <div className="flex justify-center gap-3 mt-4">
          <div className="w-5 h-5 rounded skeleton" />
          <div className="w-5 h-5 rounded skeleton" />
        </div>
      </div>
    )
  }

  if (type === 'event') {
    return (
      <div className={`bg-[#111111] border border-[#1a1a1a] rounded-[10px] overflow-hidden ${className}`}>
        {/* Banner */}
        <div className="h-[200px] skeleton" />
        {/* Body */}
        <div className="p-5">
          {/* Title */}
          <div className="h-5 skeleton mb-3" style={{ width: '80%' }} />
          {/* Date */}
          <div className="h-4 skeleton mb-2" style={{ width: '50%' }} />
          {/* Speaker */}
          <div className="h-4 skeleton mb-3" style={{ width: '40%' }} />
          {/* Description */}
          <div className="h-4 skeleton mb-2" style={{ width: '100%' }} />
          <div className="h-4 skeleton mb-4" style={{ width: '70%' }} />
          {/* Button */}
          <div className="h-9 skeleton" style={{ width: '100px' }} />
        </div>
      </div>
    )
  }

  if (type === 'blog') {
    return (
      <div className={`bg-[#111111] border border-[#1a1a1a] rounded-lg p-5 ${className}`}>
        {/* Tags */}
        <div className="flex gap-2 mb-3">
          <div className="h-5 skeleton" style={{ width: '60px' }} />
          <div className="h-5 skeleton" style={{ width: '80px' }} />
        </div>
        {/* Title */}
        <div className="h-5 skeleton mb-2" style={{ width: '90%' }} />
        {/* Excerpt */}
        <div className="h-4 skeleton mb-1" style={{ width: '100%' }} />
        <div className="h-4 skeleton mb-4" style={{ width: '80%' }} />
        {/* Meta */}
        <div className="h-3 skeleton" style={{ width: '40%' }} />
      </div>
    )
  }

  if (type === 'achievement') {
    return (
      <div className={`bg-[#111111] border border-[#1a1a1a] rounded-lg p-5 ${className}`}>
        {/* Icon */}
        <div className="w-6 h-6 rounded skeleton mb-3" />
        {/* Title */}
        <div className="h-5 skeleton mb-1" style={{ width: '80%' }} />
        {/* Date */}
        <div className="h-3 skeleton mb-2" style={{ width: '40%' }} />
        {/* Description */}
        <div className="h-4 skeleton mb-1" style={{ width: '100%' }} />
        <div className="h-4 skeleton" style={{ width: '60%' }} />
      </div>
    )
  }

  if (type === 'project') {
    return (
      <div className={`bg-[#111111] border border-[#1a1a1a] rounded-[10px] overflow-hidden ${className}`}>
        {/* Image */}
        <div className="h-[180px] skeleton" />
        {/* Body */}
        <div className="p-5">
          {/* Title */}
          <div className="h-5 skeleton mb-2" style={{ width: '70%' }} />
          {/* Description */}
          <div className="h-4 skeleton mb-1" style={{ width: '100%' }} />
          <div className="h-4 skeleton mb-3" style={{ width: '80%' }} />
          {/* Tags */}
          <div className="flex gap-1.5 mb-4">
            <div className="h-5 skeleton" style={{ width: '50px' }} />
            <div className="h-5 skeleton" style={{ width: '60px' }} />
            <div className="h-5 skeleton" style={{ width: '40px' }} />
          </div>
          {/* Links */}
          <div className="flex gap-4">
            <div className="w-5 h-5 rounded skeleton" />
            <div className="w-5 h-5 rounded skeleton" />
          </div>
        </div>
      </div>
    )
  }

  // Default skeleton
  return (
    <div className={`bg-[#111111] border border-[#1a1a1a] rounded-lg p-5 ${className}`}>
      <div className="h-5 skeleton mb-3" style={{ width: '60%' }} />
      <div className="h-4 skeleton mb-2" style={{ width: '100%' }} />
      <div className="h-4 skeleton" style={{ width: '80%' }} />
    </div>
  )
}

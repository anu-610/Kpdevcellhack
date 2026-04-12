import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  threshold = 0.1,
  // When used inside CSS Grid, set inline=true to avoid wrapper div breaking grid columns
  inline = false,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  // Use 'contents' display so this wrapper is invisible to CSS Grid/Flexbox
  // The grid sees the children directly, not this wrapper
  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        // 'contents' makes this div transparent to layout —
        // grid/flex parents treat children as direct children
        display: inline ? 'contents' : 'block',
      }}
    >
      {children}
    </div>
  )
}
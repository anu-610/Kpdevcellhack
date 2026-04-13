import { useEffect, useRef, useState, useCallback } from 'react'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500&display=swap');

  .csb-root {
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: 36px;
    z-index: 9999;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    transition: opacity 0.5s ease;
  }

  .csb-root.hidden { opacity: 0; }

  .csb-track-wrap {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: 70vh;
  }

  .csb-rail {
    position: absolute;
    right: 14px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255,255,255,0.06);
    border-radius: 1px;
    pointer-events: all;
    cursor: pointer;
  }

  .csb-rail-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(255,255,255,0.22);
    border-radius: 1px;
    transition: height 0.08s linear;
  }

  .csb-thumb {
    position: absolute;
    right: -3px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    border: 1.5px solid rgba(255,255,255,0.35);
    cursor: grab;
    pointer-events: all;
    transform: translateY(-50%);
    transition:
      box-shadow 0.2s ease,
      width 0.2s ease,
      height 0.2s ease,
      right 0.2s ease;
  }

  .csb-thumb:hover,
  .csb-thumb.dragging {
    width: 10px;
    height: 10px;
    right: -4.5px;
    box-shadow: 0 0 0 4px rgba(255,255,255,0.08), 0 0 16px rgba(255,255,255,0.15);
    cursor: grabbing;
  }

  .csb-scanner {
    position: absolute;
    right: -1px;
    width: 3px;
    height: 20px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.25), transparent);
    border-radius: 2px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    transform: translateY(-50%);
  }

  .csb-rail:hover .csb-scanner { opacity: 1; }

  .csb-meta {
    font-family: 'Fira Code', monospace;
    font-size: 8px;
    font-weight: 300;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.18);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    user-select: none;
    flex-shrink: 0;
  }

  .csb-meta.top { margin-bottom: 14px; }
  .csb-meta.bot { margin-top: 14px; }

  .csb-meta span { color: rgba(255,255,255,0.45); }

  @keyframes csb-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
    50%       { box-shadow: 0 0 0 5px rgba(255,255,255,0.05); }
  }

  .csb-thumb:not(.dragging) {
    animation: csb-pulse 3s ease-in-out infinite;
  }
`

let styleInjected = false
function injectStyles() {
  if (styleInjected) return
  styleInjected = true
  const el = document.createElement('style')
  el.textContent = CSS
  document.head.appendChild(el)
}

export default function CustomScrollbar() {
  const railRef      = useRef(null)
  const thumbRef     = useRef(null)
  const fillRef      = useRef(null)
  const scannerRef   = useRef(null)
  const isDragging   = useRef(false)
  const dragStartY   = useRef(0)
  const dragStartPct = useRef(0)
  const hideTimer    = useRef(null)
  const rafRef       = useRef(null)
  const lastPctRef   = useRef(-1)

  const [visible, setVisible] = useState(false)
  const [pct, setPct]         = useState(0)

  const getMetrics = useCallback(() => {
    const scrolled = window.scrollY
    const total    = Math.max(1, document.body.scrollHeight - window.innerHeight)
    const p        = Math.min(1, Math.max(0, scrolled / total))
    return { total, p }
  }, [])

  const update = useCallback(() => {
    const { p } = getMetrics()
    const nextPct = Math.round(p * 100)

    if (thumbRef.current && railRef.current) {
      const railH = railRef.current.offsetHeight
      thumbRef.current.style.top = `${p * railH}px`
    }

    if (fillRef.current) {
      fillRef.current.style.height = `${p * 100}%`
    }

    if (nextPct !== lastPctRef.current) {
      lastPctRef.current = nextPct
      setPct(nextPct)
    }
  }, [getMetrics])

  const handleScroll = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        update()
        rafRef.current = null
      })
    }

    setVisible(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 2200)
  }, [update])

  const onThumbMouseDown = useCallback((e) => {
    e.preventDefault()
    isDragging.current   = true
    dragStartY.current   = e.clientY
    dragStartPct.current = getMetrics().p
    thumbRef.current?.classList.add('dragging')
    document.body.style.userSelect = 'none'
  }, [getMetrics])

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !railRef.current) return
    const railH  = railRef.current.offsetHeight
    const dy     = e.clientY - dragStartY.current
    const delta  = dy / railH
    const newPct = Math.min(1, Math.max(0, dragStartPct.current + delta))
    const total  = document.body.scrollHeight - window.innerHeight
    window.scrollTo({ top: newPct * total })
  }, [])

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    thumbRef.current?.classList.remove('dragging')
    document.body.style.userSelect = ''
  }, [])

  const onRailClick = useCallback((e) => {
    if (!railRef.current) return
    const rect  = railRef.current.getBoundingClientRect()
    const p     = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
    const total = document.body.scrollHeight - window.innerHeight
    window.scrollTo({ top: p * total, behavior: 'smooth' })
  }, [])

  const onRailMouseMove = useCallback((e) => {
    if (!railRef.current || !scannerRef.current) return
    const rect = railRef.current.getBoundingClientRect()
    scannerRef.current.style.top = `${e.clientY - rect.top}px`
  }, [])

  useEffect(() => {
    injectStyles()

    const nativeStyle = document.createElement('style')
    nativeStyle.textContent = `
      html { scrollbar-width: none; }
      *::-webkit-scrollbar { display: none !important; }
      * { -ms-overflow-style: none; }
    `
    document.head.appendChild(nativeStyle)

    update()

    window.addEventListener('scroll',    handleScroll, { passive: true })
    window.addEventListener('resize',    update)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)

    setVisible(true)
    hideTimer.current = setTimeout(() => setVisible(false), 2500)

    return () => {
      window.removeEventListener('scroll',    handleScroll)
      window.removeEventListener('resize',    update)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(hideTimer.current)
      document.head.removeChild(nativeStyle)
      document.body.style.userSelect = ''
    }
  }, [update, handleScroll, onMouseMove, onMouseUp])

  return (
    <div className={`csb-root${visible ? '' : ' hidden'}`}>
      <div className="csb-meta top">
        LN&nbsp;<span>{String(Math.round(pct * 4.2 + 1)).padStart(3, '0')}</span>
      </div>

      <div className="csb-track-wrap">
        <div
          className="csb-rail"
          ref={railRef}
          onClick={onRailClick}
          onMouseMove={onRailMouseMove}
        >
          <div className="csb-rail-fill" ref={fillRef} />
          <div className="csb-scanner" ref={scannerRef} />
          <div
            className="csb-thumb"
            ref={thumbRef}
            onMouseDown={onThumbMouseDown}
          />
        </div>
      </div>

      <div className="csb-meta bot">
        <span>{pct}%</span>&nbsp;SCR
      </div>
    </div>
  )
}
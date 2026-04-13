import { useEffect, useRef } from 'react'

const CHARS = '01{}[]<>/\\=+-*&%$#@!ABCDEFabcdef'
const COL_W = 18

// heroRef — ref to the <section> element of Hero
// This canvas sits INSIDE hero (position:absolute) so it scrolls
// with the page and never bleeds into other sections.
export default function MatrixRain({ heroRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = heroRef?.current
    if (!canvas || !hero) return

    const ctx = canvas.getContext('2d')

    const setup = () => {
      canvas.width = hero.offsetWidth
      canvas.height = hero.offsetHeight
    }
    setup()

    let cols = Math.floor(canvas.width / COL_W)
    let drops = Array(cols).fill(0).map(() => Math.random() * -60)
    let speeds = Array(cols).fill(0).map(() => 0.1 + Math.random() * 0.25)

    let animId
    let running = false

    const draw = () => {
      if (!running) return

      ctx.fillStyle = 'rgba(13,17,23,0.07)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = '13px monospace'

      drops.forEach((y, i) => {
        const px = y * 16

        // Fade out in the bottom 25% of the hero so it dissolves cleanly
        const fadeStart = canvas.height * 0.72
        const fadeEnd   = canvas.height
        const alpha = px < fadeStart ? 1
          : px > fadeEnd ? 0
          : 1 - (px - fadeStart) / (fadeEnd - fadeStart)

        if (alpha <= 0.01) {
          drops[i] += speeds[i]
          if (drops[i] * 16 > canvas.height + 40 && Math.random() > 0.97) {
            drops[i] = Math.random() * -40
          }
          return
        }

        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * COL_W

        // Occasional bright head, dim body
        if (Math.random() > 0.93) {
          ctx.fillStyle = `rgba(200,255,245,${0.85 * alpha})`
        } else {
          ctx.fillStyle = `rgba(20,184,166,${0.2 * alpha})`
        }

        ctx.fillText(char, x, px)

        drops[i] += speeds[i]
        if (drops[i] * 16 > canvas.height + 40 && Math.random() > 0.975) {
          drops[i] = Math.random() * -40
        }
      })

      animId = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running) return
      running = true
      animId = requestAnimationFrame(draw)
    }

    const stop = () => {
      running = false
      if (animId) cancelAnimationFrame(animId)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        setup()
        start()
      }
    }

    start()
    document.addEventListener('visibilitychange', handleVisibility)

    const handleResize = () => {
      setup()
      cols = Math.floor(canvas.width / COL_W)
      drops = Array(cols).fill(0).map(() => Math.random() * -60)
      speeds = Array(cols).fill(0).map(() => 0.1 + Math.random() * 0.25)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('resize', handleResize)
    }
  }, [heroRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  )
}
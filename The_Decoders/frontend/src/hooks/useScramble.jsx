import { useEffect, useRef, useState } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

const SCRAMBLE_CHARS = '01{}[]<>/\\=+-*&%$#@!'

/**
 * useScramble
 *
 * Returns a scrambled version of `text` driven by scroll progress.
 *
 * @param {string}  text        - The target text to resolve into
 * @param {object}  sectionRef  - ref to the containing section element
 * @param {number}  startOffset - scroll progress [0-1] when scramble begins  (default 0)
 * @param {number}  endOffset   - scroll progress [0-1] when all chars locked (default 0.5)
 *
 * Characters resolve left-to-right as scroll increases.
 * Unresolved characters flicker randomly (matrix-style).
 * Resolved characters are locked and shown in their real color.
 */
export function useScramble(text, sectionRef, startOffset = 0, endOffset = 0.45) {
  const [output, setOutput]       = useState(() => text.split('').map(() => ' '))
  const [resolved, setResolved]   = useState(0)   // how many chars are locked
  const resolvedRef               = useRef(0)
  const textRef                   = useRef(text)
  const lastFrameTimeRef          = useRef(0)
  const frameIntervalMs           = 1000 / 30

  // Re-sync if text prop changes
  useEffect(() => { textRef.current = text }, [text])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 90%', 'end 50%'],  // fire when section enters viewport
  })

  // Map scroll progress → how many chars should be resolved
  const resolvedCount = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [0, text.length]
  )

  useMotionValueEvent(resolvedCount, 'change', (latest) => {
    const n = Math.floor(Math.min(latest, text.length))
    if (n !== resolvedRef.current) {
      resolvedRef.current = n
      setResolved(n)
    }
  })

  // Flicker loop for unresolved characters
  useEffect(() => {
    let id
    const flicker = (ts) => {
      if (ts - lastFrameTimeRef.current < frameIntervalMs) {
        id = requestAnimationFrame(flicker)
        return
      }
      lastFrameTimeRef.current = ts

      const t = textRef.current
      const n = resolvedRef.current
      setOutput(
        t.split('').map((char, i) => {
          if (i < n) return char            // locked
          if (char === ' ') return ' '      // preserve spaces
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        })
      )
      id = requestAnimationFrame(flicker)
    }
    id = requestAnimationFrame(flicker)
    return () => cancelAnimationFrame(id)
  }, [])

  return { output, resolved }
}

/**
 * ScrambleText
 *
 * Renders a string where resolved characters appear in `resolvedColor`
 * and unresolved characters appear in `scrambleColor` (dim, flickering).
 * Each character is a <span> so spacing stays stable.
 */
export function ScrambleText({
  text,
  sectionRef,
  startOffset,
  endOffset,
  resolvedColor,
  scrambleColor = 'rgba(20,184,166,0.35)',
  style = {},
  charStyle = {},
}) {
  const { output, resolved } = useScramble(text, sectionRef, startOffset, endOffset)

  return (
    <span style={{ fontFamily: 'inherit', ...style }}>
      {output.map((char, i) => (
        <span
          key={i}
          style={{
            color: i < resolved ? resolvedColor : scrambleColor,
            transition: i < resolved ? 'color 0.15s ease' : 'none',
            display: 'inline',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            ...charStyle,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
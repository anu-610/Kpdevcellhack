import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const [typedPath, setTypedPath] = useState('')
  const [showError, setShowError] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  
  const requestedPath = window.location.pathname

  useEffect(() => {
    document.title = '404 — KP Dev Cell'

    // Type out the path
    let charIndex = 0
    const pathToType = `cd ${requestedPath}`
    
    const typeInterval = setInterval(() => {
      if (charIndex <= pathToType.length) {
        setTypedPath(pathToType.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        // Show error after typing completes
        setTimeout(() => setShowError(true), 300)
        setTimeout(() => setShowPrompt(true), 800)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [requestedPath])

  return (
    <div className="page-enter min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Terminal Window */}
        <div className="bg-[#0f0f0f] border border-[#222222] rounded-lg overflow-hidden shadow-2xl">
          {/* Title Bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161616] border-b border-[#222222]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-[#555555] text-xs ml-2 font-mono">bash — zsh</span>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm min-h-[200px]">
            {/* Command Line */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#00ff88]">$</span>
              <span className="text-white">{typedPath}</span>
              {!showError && <span className="cursor-blink">|</span>}
            </div>

            {/* Error Message */}
            {showError && (
              <div className="mb-4 fade-in-up">
                <p className="text-red-400 mb-1">
                  bash: {requestedPath}: No such file or directory
                </p>
                <p className="text-[#888888]">
                  exit code: 404
                </p>
              </div>
            )}

            {/* New Prompt */}
            {showPrompt && (
              <div className="flex items-center gap-2 fade-in-up">
                <span className="text-[#00ff88]">$</span>
                <span className="cursor-blink">|</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg text-[#00ff88] font-mono hover:bg-[#00ff88]/20 transition-colors"
          >
            <span className="text-[#555555]">$</span>
            cd ~
          </Link>
          <p className="text-[#555555] text-xs mt-4">
            Return to home directory
          </p>
        </div>
      </div>
    </div>
  )
}

"use client"
import { useEffect, useState } from 'react'

const LoadingClock = () => {
  // Initialize with empty strings to avoid hydration mismatch
  const [hours, setHours] = useState('--')
  const [minutes, setMinutes] = useState('--')
  const [seconds, setSeconds] = useState('--')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Update time immediately on mount
    const updateTime = () => {
      const now = new Date()
      setHours(now.getHours().toString().padStart(2, '0'))
      setMinutes(now.getMinutes().toString().padStart(2, '0'))
      setSeconds(now.getSeconds().toString().padStart(2, '0'))
    }

    // Initial update
    updateTime()

    // Set up interval
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover effect background */}
      <div className={`
        absolute inset-0 rounded-lg transition-all duration-300
        ${isHovered ? 'bg-gradient-to-r from-green-500/20 via-teal-500/20 to-emerald-500/20 blur-sm' : ''}
      `} />
      
      {/* Time display */}
      <div className="flex items-center gap-2 relative">
        <div className="flex items-center gap-1 bg-green-600/20 px-3 py-1 rounded-lg backdrop-blur-sm">
          <div className="text-sm font-medium text-green-400">{hours}:{minutes}</div>
          <div className="text-xs text-green-300">{seconds}s</div>
        </div>
        
        {/* Loading animation */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`
                w-1.5 h-1.5 rounded-full transition-colors duration-300
                ${isHovered ? 'bg-emerald-400' : 'bg-green-400'}
                animate-pulse
              `}
              style={{
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
        </div>

        {/* Hover effect dots */}
        {isHovered && (
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-green-500/20 via-teal-500/20 to-emerald-500/20 blur-sm animate-pulse" />
        )}
      </div>
    </div>
  )
}

export default LoadingClock 
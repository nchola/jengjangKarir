"use client"

import { useEffect, useState } from "react"

const LoadingClock = () => {
  const [time, setTime] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setTime(`${hours}:${minutes}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient animation */}
      <div className={`
        absolute inset-0 rounded-lg transition-all duration-300
        ${isHovered ? 'bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-teal-500/20 blur-sm' : ''}
      `} />
      
      {/* Time display */}
      <div className="relative flex items-center gap-2">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-800">
          <div className="text-base font-medium bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
            {time}
          </div>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`
                w-1 h-1 rounded-full transition-colors duration-300
                ${isHovered ? 'bg-indigo-400' : 'bg-teal-400'}
                animate-pulse
              `}
              style={{
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
        </div>

        {/* Hover effect glow */}
        {isHovered && (
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-teal-500/20 blur-sm animate-pulse" />
        )}
      </div>
    </div>
  )
}

export default LoadingClock 
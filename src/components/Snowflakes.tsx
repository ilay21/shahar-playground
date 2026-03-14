import { useMemo } from 'react'

export default function Snowflakes() {
  const flakes = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      size: 12 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {flakes.map(f => (
        <div
          key={f.id}
          className="absolute animate-snowfall"
          style={{
            left: `${f.left}%`,
            top: '-5%',
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            fontSize: `${f.size}px`,
            opacity: f.opacity,
          }}
        >
          ❄️
        </div>
      ))}
    </div>
  )
}

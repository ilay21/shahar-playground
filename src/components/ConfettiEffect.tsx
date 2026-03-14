import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiEffectProps {
  trigger: boolean
}

export default function ConfettiEffect({ trigger }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return

    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#f9a8d4', '#c084fc', '#67e8f9', '#fbbf24', '#5eead4'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f9a8d4', '#c084fc', '#67e8f9', '#fbbf24', '#5eead4'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [trigger])

  return null
}

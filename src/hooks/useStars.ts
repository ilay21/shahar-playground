import { useState, useCallback, useEffect } from 'react'

const STARS_KEY = 'shahar-stars'
const BADGES_KEY = 'shahar-badges'

export interface Badge {
  id: string
  title: string
  emoji: string
  earnedAt: number
}

export function useStars() {
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem(STARS_KEY)
    return saved ? parseInt(saved, 10) : 0
  })

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(BADGES_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(STARS_KEY, String(stars))
  }, [stars])

  useEffect(() => {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges))
  }, [badges])

  const addStars = useCallback((count: number) => {
    setStars(prev => prev + count)
  }, [])

  const addBadge = useCallback((badge: Omit<Badge, 'earnedAt'>) => {
    setBadges(prev => {
      if (prev.some(b => b.id === badge.id)) return prev
      return [...prev, { ...badge, earnedAt: Date.now() }]
    })
  }, [])

  return { stars, badges, addStars, addBadge }
}

import { useState, useCallback } from 'react'
import BackButton from '../../components/BackButton'
import ConfettiEffect from '../../components/ConfettiEffect'

interface ColorMixingProps {
  onComplete: (stars: number) => void
}

const colorOptions = [
  { name: 'אדום', color: '#ef4444', emoji: '🔴' },
  { name: 'כחול', color: '#3b82f6', emoji: '🔵' },
  { name: 'צהוב', color: '#eab308', emoji: '🟡' },
]

const mixRules: Record<string, { result: string; name: string; emoji: string }> = {
  'אדום+כחול': { result: '#8b5cf6', name: 'סגול! 💜', emoji: '🟣' },
  'כחול+אדום': { result: '#8b5cf6', name: 'סגול! 💜', emoji: '🟣' },
  'כחול+צהוב': { result: '#22c55e', name: 'ירוק! 💚', emoji: '🟢' },
  'צהוב+כחול': { result: '#22c55e', name: 'ירוק! 💚', emoji: '🟢' },
  'אדום+צהוב': { result: '#f97316', name: 'כתום! 🧡', emoji: '🟠' },
  'צהוב+אדום': { result: '#f97316', name: 'כתום! 🧡', emoji: '🟠' },
}

export default function ColorMixing({ onComplete }: ColorMixingProps) {
  const [selected, setSelected] = useState<typeof colorOptions[number][]>([])
  const [mixResult, setMixResult] = useState<{ result: string; name: string; emoji: string } | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const [mixCount, setMixCount] = useState(0)

  const handleColorPick = useCallback((color: typeof colorOptions[number]) => {
    if (mixResult) return // Wait for reset

    const next = [...selected, color]
    setSelected(next)

    if (next.length === 2) {
      const key = `${next[0].name}+${next[1].name}`
      const result = mixRules[key]
      if (result) {
        setMixResult(result)
        setCelebrate(true)
        setMixCount(prev => prev + 1)
        setTimeout(() => setCelebrate(false), 2000)
      } else {
        // Same color picked twice
        setTimeout(() => {
          setSelected([])
        }, 800)
      }
    }
  }, [selected, mixResult])

  const handleReset = () => {
    setSelected([])
    setMixResult(null)
  }

  const handleFinish = () => {
    const stars = mixCount >= 3 ? 3 : mixCount >= 2 ? 2 : 1
    onComplete(stars)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gabby-teal via-gabby-purple to-gabby-pink p-4 flex flex-col">
      <BackButton />
      <ConfettiEffect trigger={celebrate} />

      <div className="mt-20 flex-1 flex flex-col items-center justify-center gap-6 max-w-md mx-auto w-full">
        <h2 className="text-3xl font-heading text-white text-center">ערבוב צבעים עם גבי 🐱</h2>
        <p className="text-xl text-white/80 text-center">בחרי שני צבעים לערבב!</p>

        {/* Mixing bowl */}
        <div
          className="w-48 h-48 rounded-full border-8 border-white/40 flex items-center justify-center
            shadow-2xl transition-all duration-700"
          style={{
            background: mixResult
              ? mixResult.result
              : selected.length === 1
              ? selected[0].color
              : 'rgba(255,255,255,0.15)',
          }}
        >
          {mixResult ? (
            <div className="animate-bounce-in text-center">
              <span className="text-6xl block">{mixResult.emoji}</span>
              <span className="text-xl font-heading text-white">{mixResult.name}</span>
            </div>
          ) : selected.length === 1 ? (
            <span className="text-5xl">{selected[0].emoji}</span>
          ) : (
            <span className="text-4xl">🥣</span>
          )}
        </div>

        {/* Selected colors */}
        <div className="flex gap-3 min-h-[40px]">
          {selected.map((c, i) => (
            <span key={i} className="text-3xl animate-bounce-in">{c.emoji}</span>
          ))}
          {selected.length > 0 && selected.length < 2 && (
            <span className="text-3xl text-white/50">+ ?</span>
          )}
        </div>

        {/* Color buttons */}
        {!mixResult && (
          <div className="flex gap-4">
            {colorOptions.map(c => (
              <button
                key={c.name}
                onClick={() => handleColorPick(c)}
                className="w-20 h-20 rounded-full border-4 border-white/50 active:scale-90
                  transition-transform shadow-lg text-3xl"
                style={{ background: c.color }}
              >
                {c.emoji}
              </button>
            ))}
          </div>
        )}

        {mixResult && (
          <button
            onClick={handleReset}
            className="bg-white/30 text-white font-heading text-xl rounded-full px-8 py-4
              active:scale-95 transition-transform"
          >
            ננסה שוב! 🎨
          </button>
        )}

        <p className="text-white/60 text-lg">ערבובים: {mixCount}</p>

        {mixCount >= 1 && (
          <button
            onClick={handleFinish}
            className="bg-white/20 text-white font-heading text-lg rounded-full px-6 py-3
              active:scale-95 transition-transform"
          >
            סיימתי! 🏠
          </button>
        )}
      </div>
    </div>
  )
}

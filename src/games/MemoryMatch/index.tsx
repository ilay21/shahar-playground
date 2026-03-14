import { useState, useCallback, useEffect } from 'react'
import BackButton from '../../components/BackButton'
import ConfettiEffect from '../../components/ConfettiEffect'

interface MemoryMatchProps {
  onComplete: (stars: number) => void
}

const EMOJIS = ['❄️', '🏰', '👗', '⛄', '🌟', '🐱']

interface Card {
  id: number
  emoji: string
  matched: boolean
}

function createDeck(): Card[] {
  const pairs = EMOJIS.flatMap((emoji, i) => [
    { id: i * 2, emoji, matched: false },
    { id: i * 2 + 1, emoji, matched: false },
  ])
  // Shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return pairs
}

export default function MemoryMatch({ onComplete }: MemoryMatchProps) {
  const [cards, setCards] = useState(createDeck)
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [done, setDone] = useState(false)
  const [checking, setChecking] = useState(false)

  const handleFlip = useCallback((id: number) => {
    if (checking) return
    if (flipped.includes(id)) return
    const card = cards.find(c => c.id === id)
    if (!card || card.matched) return

    const next = [...flipped, id]
    setFlipped(next)

    if (next.length === 2) {
      setMoves(prev => prev + 1)
      setChecking(true)
      const [first, second] = next
      const c1 = cards.find(c => c.id === first)!
      const c2 = cards.find(c => c.id === second)!

      if (c1.emoji === c2.emoji) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          ))
          setFlipped([])
          setChecking(false)
        }, 600)
      } else {
        setTimeout(() => {
          setFlipped([])
          setChecking(false)
        }, 900)
      }
    }
  }, [flipped, cards, checking])

  const allMatched = cards.every(c => c.matched)

  useEffect(() => {
    if (allMatched && !done) {
      setDone(true)
    }
  }, [allMatched, done])

  const earnedStars = moves <= 8 ? 3 : moves <= 12 ? 2 : 1

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-anna-magenta to-frozen-cyan flex flex-col items-center justify-center p-6">
        <BackButton />
        <ConfettiEffect trigger={true} />
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md">
          <h2 className="text-4xl font-heading text-white mb-4">כל הזוגות נמצאו! 🎵</h2>
          <p className="text-2xl text-white mb-4">{moves} מהלכים</p>
          <div className="text-5xl mb-6">{'⭐'.repeat(earnedStars)}</div>
          <button
            onClick={() => onComplete(earnedStars)}
            className="bg-white/30 text-white font-heading text-2xl rounded-full px-8 py-4 active:scale-95 transition-transform"
          >
            חזרה הביתה 🏠
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-anna-magenta to-frozen-cyan p-4 flex flex-col">
      <BackButton />

      <div className="mt-20 flex-1 flex flex-col items-center gap-4">
        <h2 className="text-3xl font-heading text-white">מה הצליל? 🎵</h2>
        <p className="text-xl text-white/80">מהלכים: {moves}</p>

        <div className="grid grid-cols-4 gap-3 w-full max-w-sm mt-4">
          {cards.map(card => {
            const isFlipped = flipped.includes(card.id) || card.matched
            return (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                className={`aspect-square rounded-2xl text-4xl md:text-5xl flex items-center justify-center
                  transition-all duration-300 active:scale-95 border-3 shadow-lg min-h-[70px]
                  ${isFlipped
                    ? 'bg-white/30 border-white/50 rotate-0'
                    : 'bg-gradient-to-br from-frozen-blue to-gabby-purple border-white/20'
                  }
                  ${card.matched ? 'opacity-80 animate-pulse-glow' : ''}
                `}
              >
                {isFlipped ? card.emoji : '✨'}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

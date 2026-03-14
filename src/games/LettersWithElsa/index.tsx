import { useState, useCallback, useMemo } from 'react'
import BackButton from '../../components/BackButton'
import ConfettiEffect from '../../components/ConfettiEffect'

interface LettersProps {
  onComplete: (stars: number) => void
}

const letterData: { letter: string; name: string; items: { emoji: string; label: string }[] }[] = [
  { letter: 'א', name: 'אָלֶף', items: [
    { emoji: '🍉', label: 'אבטיח' }, { emoji: '🐶', label: 'כלב' }, { emoji: '🌸', label: 'פרח' }
  ]},
  { letter: 'ב', name: 'בֵּית', items: [
    { emoji: '🏠', label: 'בית' }, { emoji: '🐱', label: 'חתול' }, { emoji: '⭐', label: 'כוכב' }
  ]},
  { letter: 'ג', name: 'גִּימֶל', items: [
    { emoji: '🍦', label: 'גלידה' }, { emoji: '🍎', label: 'תפוח' }, { emoji: '🦋', label: 'פרפר' }
  ]},
  { letter: 'ד', name: 'דָּלֶת', items: [
    { emoji: '🐻', label: 'דוב' }, { emoji: '🌈', label: 'קשת' }, { emoji: '🐟', label: 'דג' }
  ]},
  { letter: 'ה', name: 'הֵא', items: [
    { emoji: '🏔️', label: 'הר' }, { emoji: '🌙', label: 'ירח' }, { emoji: '☀️', label: 'שמש' }
  ]},
  { letter: 'כ', name: 'כַּף', items: [
    { emoji: '⭐', label: 'כוכב' }, { emoji: '🏠', label: 'בית' }, { emoji: '🍦', label: 'גלידה' }
  ]},
  { letter: 'ל', name: 'לָמֶד', items: [
    { emoji: '❤️', label: 'לב' }, { emoji: '🐻', label: 'דוב' }, { emoji: '🍉', label: 'אבטיח' }
  ]},
  { letter: 'מ', name: 'מֵם', items: [
    { emoji: '💧', label: 'מים' }, { emoji: '🌸', label: 'פרח' }, { emoji: '🐶', label: 'כלב' }
  ]},
  { letter: 'פ', name: 'פֵּא', items: [
    { emoji: '🌸', label: 'פרח' }, { emoji: '🍦', label: 'גלידה' }, { emoji: '🏔️', label: 'הר' }
  ]},
  { letter: 'ש', name: 'שִׁין', items: [
    { emoji: '☀️', label: 'שמש' }, { emoji: '💧', label: 'מים' }, { emoji: '❤️', label: 'לב' }
  ]},
]

const TOTAL = 10

export default function LettersWithElsa({ onComplete }: LettersProps) {
  const questions = useMemo(() => {
    const shuffled = [...letterData].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, TOTAL)
  }, [])

  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [celebrate, setCelebrate] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [done, setDone] = useState(false)

  const current = questions[index]

  const handlePick = useCallback((label: string) => {
    // The correct answer is always the first item (index 0) in each letterData entry
    const correctLabel = current.items[0].label
    if (label === correctLabel) {
      setCelebrate(true)
      setCorrect(prev => prev + 1)
      setTimeout(() => {
        setCelebrate(false)
        if (index + 1 >= TOTAL) {
          setDone(true)
        } else {
          setIndex(prev => prev + 1)
        }
      }, 1200)
    } else {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }, [current, index])

  const earnedStars = correct >= 9 ? 3 : correct >= 7 ? 2 : 1

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-frozen-blue to-frozen-cyan flex flex-col items-center justify-center p-6">
        <BackButton />
        <ConfettiEffect trigger={true} />
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md">
          <h2 className="text-4xl font-heading text-white mb-4">מעולה! ❄️</h2>
          <p className="text-2xl text-white mb-4">{correct} מתוך {TOTAL} נכון!</p>
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

  const shuffledItems = useMemo(() => {
    return [...current.items].sort(() => Math.random() - 0.5)
  }, [current])

  return (
    <div className="min-h-screen bg-gradient-to-b from-frozen-blue to-frozen-cyan p-4 flex flex-col">
      <BackButton />
      <ConfettiEffect trigger={celebrate} />

      {/* Progress */}
      <div className="mt-20 mb-4 mx-auto w-full max-w-md">
        <div className="bg-white/20 rounded-full h-4 overflow-hidden">
          <div
            className="bg-frozen-sparkle h-full rounded-full transition-all duration-500"
            style={{ width: `${(index / TOTAL) * 100}%` }}
          />
        </div>
        <p className="text-white/80 text-center mt-1 text-lg">{index + 1} / {TOTAL}</p>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center gap-8 ${shaking ? 'animate-shake' : ''}`}>
        {/* Letter display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/30">
          <span className="text-8xl md:text-9xl font-heading text-white">{current.letter}</span>
        </div>
        <p className="text-2xl text-white/90 font-heading">{current.name}</p>

        {/* Picture cards */}
        <div className="flex gap-4 flex-wrap justify-center">
          {shuffledItems.map(item => (
            <button
              key={item.label}
              onClick={() => handlePick(item.label)}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center gap-2
                border-3 border-white/30 active:scale-95 transition-transform min-w-[100px]
                shadow-lg"
            >
              <span className="text-5xl">{item.emoji}</span>
              <span className="text-lg text-white font-bold">{item.label}</span>
            </button>
          ))}
        </div>

        {celebrate && (
          <div className="animate-bounce-in text-4xl font-heading text-frozen-sparkle">
            נכון! ❄️✨
          </div>
        )}
      </div>
    </div>
  )
}

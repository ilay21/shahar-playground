import type { Badge } from '../hooks/useStars'
import BackButton from './BackButton'

interface TrophyShelfProps {
  stars: number
  badges: Badge[]
}

const milestones = [
  { stars: 5, title: 'מתחילה ⭐', emoji: '🌱' },
  { stars: 15, title: 'חכמה 🧠', emoji: '🦉' },
  { stars: 30, title: 'כוכבת על ✨', emoji: '👑' },
  { stars: 50, title: 'גאונה! 🚀', emoji: '🏆' },
]

export default function TrophyShelf({ stars, badges }: TrophyShelfProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-frozen-blue via-gabby-purple to-gabby-pink p-4 md:p-8">
      <BackButton />

      <div className="max-w-3xl mx-auto pt-20">
        <h1 className="text-4xl font-heading text-white text-center mb-2">🏆 מדף הגביעים</h1>
        <p className="text-center text-white/80 text-xl mb-8">⭐ {stars} כוכבים</p>

        {/* Star milestones */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {milestones.map(m => {
            const earned = stars >= m.stars
            return (
              <div
                key={m.stars}
                className={`rounded-2xl p-5 text-center transition-all ${
                  earned
                    ? 'bg-white/30 backdrop-blur-sm shadow-lg animate-bounce-in'
                    : 'bg-white/10 opacity-50'
                }`}
              >
                <span className="text-5xl block mb-2">{m.emoji}</span>
                <p className="font-heading text-white text-xl">{m.title}</p>
                <p className="text-white/60 text-sm">{m.stars} כוכבים</p>
              </div>
            )
          })}
        </div>

        {/* Game badges */}
        {badges.length > 0 && (
          <>
            <h2 className="text-2xl font-heading text-white text-center mb-4">תגים שהרווחת</h2>
            <div className="grid grid-cols-3 gap-3">
              {badges.map(b => (
                <div key={b.id} className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
                  <span className="text-3xl">{b.emoji}</span>
                  <p className="text-white text-sm font-bold mt-1">{b.title}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

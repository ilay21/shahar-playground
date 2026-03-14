import { useNavigate } from 'react-router-dom'
import GameCard from './GameCard'
import StarCounter from './StarCounter'
import Snowflakes from './Snowflakes'

interface DashboardProps {
  stars: number
}

const games = [
  {
    path: '/magic-math',
    emoji: '🔢',
    title: 'חשבון קסום',
    description: 'Addition & subtraction 1–10',
    color: 'bg-gradient-to-br from-gabby-purple to-gabby-pink',
  },
  {
    path: '/letters',
    emoji: '🔤',
    title: 'אותיות עם אלזה',
    description: 'Learn Hebrew letters',
    color: 'bg-gradient-to-br from-frozen-blue to-frozen-cyan',
  },
  {
    path: '/colors',
    emoji: '🌈',
    title: 'ערבוב צבעים עם גבי',
    description: 'Mix colors together',
    color: 'bg-gradient-to-br from-gabby-teal to-gabby-purple',
  },
  {
    path: '/puzzle',
    emoji: '🧩',
    title: 'פאזל של אנה ואלזה',
    description: 'Sliding tile puzzle',
    color: 'bg-gradient-to-br from-frozen-blue to-anna-pink',
  },
  {
    path: '/memory',
    emoji: '🎵',
    title: 'מה הצליל?',
    description: 'Memory card matching',
    color: 'bg-gradient-to-br from-anna-magenta to-frozen-cyan',
  },
  {
    path: '/drawing',
    emoji: '🎨',
    title: 'ציור חופשי',
    description: "Gabby's Art Studio",
    color: 'bg-gradient-to-br from-gabby-pink to-gabby-teal',
  },
]

export default function Dashboard({ stars }: DashboardProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen paw-bg relative">
      <Snowflakes />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-wiggle inline-block">🐱</span>
          <h1 className="text-3xl md:text-4xl font-heading text-white drop-shadow-lg">
            שחר משחקת! 🌟
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/trophies')}
            className="text-3xl active:scale-95 transition-transform"
            aria-label="Trophy shelf"
          >
            🏆
          </button>
          <StarCounter stars={stars} />
        </div>
      </header>

      {/* Game grid */}
      <main className="relative z-10 px-4 md:px-8 pb-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {games.map(game => (
            <GameCard
              key={game.path}
              emoji={game.emoji}
              title={game.title}
              description={game.description}
              color={game.color}
              onClick={() => navigate(game.path)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

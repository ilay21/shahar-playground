interface GameCardProps {
  emoji: string
  title: string
  description: string
  color: string
  onClick: () => void
}

export default function GameCard({ emoji, title, description, color, onClick }: GameCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} rounded-3xl p-6 flex flex-col items-center gap-3 min-h-[200px] w-full
        shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95
        animate-card-glow cursor-pointer border-4 border-white/30`}
    >
      <span className="text-6xl animate-float">{emoji}</span>
      <h3 className="text-2xl md:text-3xl font-heading text-white text-center leading-tight">
        {title}
      </h3>
      <p className="text-sm text-white/70 text-center">{description}</p>
    </button>
  )
}

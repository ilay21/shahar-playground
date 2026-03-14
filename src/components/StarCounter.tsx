interface StarCounterProps {
  stars: number
}

export default function StarCounter({ stars }: StarCounterProps) {
  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
      <span className="text-2xl animate-pulse-glow rounded-full">⭐</span>
      <span className="text-2xl font-bold text-star-gold font-heading">{stars}</span>
    </div>
  )
}

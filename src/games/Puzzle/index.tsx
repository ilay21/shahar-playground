import { useState, useCallback } from 'react'
import BackButton from '../../components/BackButton'
import ConfettiEffect from '../../components/ConfettiEffect'

interface PuzzleProps {
  onComplete: (stars: number) => void
}

// Simple 3x3 sliding puzzle
// Each tile has a color/emoji representing parts of a cute scene
const TILES = [
  { id: 1, emoji: '❄️', bg: '#1e3a5f' },
  { id: 2, emoji: '👸', bg: '#3b82f6' },
  { id: 3, emoji: '❄️', bg: '#0ea5e9' },
  { id: 4, emoji: '🏰', bg: '#7c3aed' },
  { id: 5, emoji: '⛄', bg: '#8b5cf6' },
  { id: 6, emoji: '💎', bg: '#06b6d4' },
  { id: 7, emoji: '🌟', bg: '#ec4899' },
  { id: 8, emoji: '👗', bg: '#d946ef' },
]

function isSolvable(arr: number[]): boolean {
  let inversions = 0
  const nums = arr.filter(x => x !== 0)
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inversions++
    }
  }
  return inversions % 2 === 0
}

function shuffle(): number[] {
  let arr: number[]
  do {
    arr = [...Array.from({ length: 8 }, (_, i) => i + 1), 0]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  } while (!isSolvable(arr) || arr.every((v, i) => v === (i + 1) % 9))
  return arr
}

function isSolved(board: number[]): boolean {
  for (let i = 0; i < 8; i++) {
    if (board[i] !== i + 1) return false
  }
  return board[8] === 0
}

export default function Puzzle({ onComplete }: PuzzleProps) {
  const [board, setBoard] = useState(() => shuffle())
  const [moves, setMoves] = useState(0)
  const [done, setDone] = useState(false)

  const handleTap = useCallback((index: number) => {
    if (done) return
    const emptyIdx = board.indexOf(0)
    const row = Math.floor(index / 3)
    const col = index % 3
    const emptyRow = Math.floor(emptyIdx / 3)
    const emptyCol = emptyIdx % 3

    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)

    if (!isAdjacent) return

    const newBoard = [...board];
    [newBoard[index], newBoard[emptyIdx]] = [newBoard[emptyIdx], newBoard[index]]
    setBoard(newBoard)
    setMoves(prev => prev + 1)

    if (isSolved(newBoard)) {
      setDone(true)
    }
  }, [board, done])

  const earnedStars = moves <= 20 ? 3 : moves <= 40 ? 2 : 1

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-frozen-blue to-anna-pink flex flex-col items-center justify-center p-6">
        <BackButton />
        <ConfettiEffect trigger={true} />
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md">
          <h2 className="text-4xl font-heading text-white mb-4">פאזל נפתר! 🧩</h2>
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
    <div className="min-h-screen bg-gradient-to-b from-frozen-blue to-anna-pink p-4 flex flex-col">
      <BackButton />

      <div className="mt-20 flex-1 flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-heading text-white">פאזל של אנה ואלזה 🧩</h2>
        <p className="text-xl text-white/80">מהלכים: {moves}</p>

        {/* Board */}
        <div className="grid grid-cols-3 gap-2 w-[300px] h-[300px] md:w-[360px] md:h-[360px]">
          {board.map((tileId, index) => {
            if (tileId === 0) {
              return <div key={index} className="rounded-xl bg-white/10" />
            }
            const tile = TILES[tileId - 1]
            return (
              <button
                key={index}
                onClick={() => handleTap(index)}
                className="rounded-xl flex flex-col items-center justify-center
                  active:scale-95 transition-all duration-200 border-3 border-white/30
                  shadow-lg text-white font-heading"
                style={{ background: tile.bg }}
              >
                <span className="text-4xl md:text-5xl">{tile.emoji}</span>
                <span className="text-sm opacity-60">{tileId}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => { setBoard(shuffle()); setMoves(0) }}
          className="bg-white/20 text-white font-heading text-lg rounded-full px-6 py-3
            active:scale-95 transition-transform mt-4"
        >
          ערבוב מחדש 🔄
        </button>
      </div>
    </div>
  )
}

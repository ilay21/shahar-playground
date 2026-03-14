import { Routes, Route, useNavigate } from 'react-router-dom'
import { useStars } from './hooks/useStars'
import Dashboard from './components/Dashboard'
import TrophyShelf from './components/TrophyShelf'
import MagicMath from './games/MagicMath'
import LettersWithElsa from './games/LettersWithElsa'
import ColorMixing from './games/ColorMixing'
import Puzzle from './games/Puzzle'
import MemoryMatch from './games/MemoryMatch'
import DrawingCanvas from './games/DrawingCanvas'

function App() {
  const { stars, badges, addStars, addBadge } = useStars()
  const navigate = useNavigate()

  const handleGameComplete = (earnedStars: number, badgeId?: string, badgeTitle?: string, badgeEmoji?: string) => {
    addStars(earnedStars)
    if (badgeId && badgeTitle && badgeEmoji) {
      addBadge({ id: badgeId, title: badgeTitle, emoji: badgeEmoji })
    }
    navigate('/')
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard stars={stars} />} />
      <Route path="/trophies" element={<TrophyShelf stars={stars} badges={badges} />} />
      <Route
        path="/magic-math"
        element={
          <MagicMath
            onComplete={(s) => handleGameComplete(s, 'math', 'מתמטיקאית ⭐', '🔢')}
          />
        }
      />
      <Route
        path="/letters"
        element={
          <LettersWithElsa
            onComplete={(s) => handleGameComplete(s, 'letters', 'קוראת ❄️', '🔤')}
          />
        }
      />
      <Route
        path="/colors"
        element={
          <ColorMixing
            onComplete={(s) => handleGameComplete(s, 'colors', 'צייר 🎨', '🌈')}
          />
        }
      />
      <Route
        path="/puzzle"
        element={
          <Puzzle
            onComplete={(s) => handleGameComplete(s, 'puzzle', 'פאזלר 🧩', '🧩')}
          />
        }
      />
      <Route
        path="/memory"
        element={
          <MemoryMatch
            onComplete={(s) => handleGameComplete(s, 'memory', 'זיכרון חד 🧠', '🎵')}
          />
        }
      />
      <Route
        path="/drawing"
        element={
          <DrawingCanvas
            onComplete={(s) => handleGameComplete(s, 'drawing', 'אמנית 🎨', '🖌️')}
          />
        }
      />
    </Routes>
  )
}

export default App

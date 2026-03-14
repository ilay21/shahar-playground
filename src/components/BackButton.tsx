import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/')}
      className="fixed top-4 start-4 z-50 bg-white/30 backdrop-blur-sm rounded-full w-16 h-16
        flex items-center justify-center text-3xl shadow-lg active:scale-95 transition-transform
        border-2 border-white/50"
    >
      🏠
    </button>
  )
}

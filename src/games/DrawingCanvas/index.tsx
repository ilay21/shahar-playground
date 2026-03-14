import { useRef, useState, useCallback, useEffect } from 'react'
import BackButton from '../../components/BackButton'

interface DrawingCanvasProps {
  onComplete: (stars: number) => void
}

const COLORS = [
  { name: 'Gabby Pink', color: '#f9a8d4' },
  { name: 'Elsa Blue', color: '#67e8f9' },
  { name: 'Purple', color: '#c084fc' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Yellow', color: '#eab308' },
  { name: 'Orange', color: '#f97316' },
  { name: 'White', color: '#ffffff' },
  { name: 'Black', color: '#1e1e1e' },
]

export default function DrawingCanvas({ onComplete }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentColor, setCurrentColor] = useState(COLORS[0].color)
  const [brushSize, setBrushSize] = useState(8)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = rect.width
      const h = rect.height

      // Save current drawing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(dpr, dpr)

      // Fill white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)

      // Restore if sizes match
      if (imageData.width > 0) {
        ctx.putImageData(imageData, 0, 0)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0]
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }, [])

  const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getPos(e)
    lastPosRef.current = pos

    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = currentColor
    ctx.fill()
  }, [getPos, currentColor, brushSize])

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const pos = getPos(e)
    const last = lastPosRef.current
    if (!last) return

    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = currentColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    lastPosRef.current = pos
  }, [isDrawing, getPos, currentColor, brushSize])

  const stopDraw = useCallback(() => {
    setIsDrawing(false)
    lastPosRef.current = null
  }, [])

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    setShowClearDialog(false)
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'shahar-drawing.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="h-screen bg-gabby-light flex flex-col overflow-hidden" dir="ltr">
      <div className="flex items-center justify-between p-2 bg-white/80 shadow-sm">
        <BackButton />
        <h2 className="font-heading text-gabby-purple text-xl mr-16">🎨 ציור חופשי</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-gabby-teal text-white rounded-full px-4 py-2 text-lg font-bold active:scale-95"
          >
            💾
          </button>
          <button
            onClick={() => setShowClearDialog(true)}
            className="bg-anna-pink text-white rounded-full px-4 py-2 text-lg font-bold active:scale-95"
          >
            🗑️
          </button>
          <button
            onClick={() => onComplete(1)}
            className="bg-gabby-purple text-white rounded-full px-4 py-2 text-lg font-bold active:scale-95"
          >
            ✅
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white/90 backdrop-blur-sm p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        {/* Colors */}
        <div className="flex gap-2 justify-center mb-3 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c.color}
              onClick={() => setCurrentColor(c.color)}
              className={`w-12 h-12 rounded-full border-4 active:scale-90 transition-transform
                ${currentColor === c.color ? 'border-gray-800 scale-110' : 'border-gray-300'}`}
              style={{ background: c.color }}
            />
          ))}
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-3 justify-center">
          <span className="text-lg">🖌️</span>
          <input
            type="range"
            min={2}
            max={30}
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            className="w-48 h-8 accent-gabby-purple"
          />
          <div
            className="rounded-full bg-gray-800"
            style={{ width: brushSize, height: brushSize }}
          />
        </div>
      </div>

      {/* Clear dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 m-4 text-center max-w-sm">
            <p className="text-2xl font-heading text-gabby-purple mb-6">למחוק את הציור? 🎨</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleClear}
                className="bg-anna-pink text-white font-bold text-xl rounded-full px-8 py-3 active:scale-95"
              >
                כן 🗑️
              </button>
              <button
                onClick={() => setShowClearDialog(false)}
                className="bg-gabby-teal text-white font-bold text-xl rounded-full px-8 py-3 active:scale-95"
              >
                לא ❌
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

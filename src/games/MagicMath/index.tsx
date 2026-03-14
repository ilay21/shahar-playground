import { useState, useCallback, useMemo } from 'react'
import BackButton from '../../components/BackButton'
import ConfettiEffect from '../../components/ConfettiEffect'

interface MagicMathProps {
  onComplete: (stars: number) => void
}

const TOTAL_QUESTIONS = 10
const objects = ['🍎', '🌸', '⭐', '🦋', '🐱', '❄️', '🌈', '🍰']

function generateQuestion() {
  const isAdd = Math.random() > 0.3
  let a: number, b: number, answer: number
  if (isAdd) {
    a = Math.floor(Math.random() * 9) + 1
    b = Math.floor(Math.random() * (10 - a)) + 1
    answer = a + b
  } else {
    answer = Math.floor(Math.random() * 8) + 1
    b = Math.floor(Math.random() * answer) + 1
    a = answer + b
    // a - b = answer
  }
  const op = isAdd ? '+' : '-'
  const obj = objects[Math.floor(Math.random() * objects.length)]

  // Generate 4 choices including correct answer
  const choices = new Set<number>([answer])
  while (choices.size < 4) {
    const wrong = Math.max(0, answer + Math.floor(Math.random() * 5) - 2)
    if (wrong !== answer) choices.add(wrong)
  }
  const shuffled = [...choices].sort(() => Math.random() - 0.5)

  return { a, b, op, answer, obj, choices: shuffled }
}

export default function MagicMath({ onComplete }: MagicMathProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [question, setQuestion] = useState(generateQuestion)
  const [, setDone] = useState(false)

  const handleAnswer = useCallback((choice: number) => {
    if (choice === question.answer) {
      setCelebrate(true)
      setCorrect(prev => prev + 1)
      setTimeout(() => {
        setCelebrate(false)
        if (questionIndex + 1 >= TOTAL_QUESTIONS) {
          setDone(true)
          setShowResult(true)
        } else {
          setQuestionIndex(prev => prev + 1)
          setQuestion(generateQuestion())
        }
      }, 1200)
    } else {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }, [question.answer, questionIndex])

  const earnedStars = useMemo(() => {
    if (correct >= 9) return 3
    if (correct >= 7) return 2
    return 1
  }, [correct])

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gabby-purple to-gabby-pink flex flex-col items-center justify-center p-6">
        <BackButton />
        <ConfettiEffect trigger={true} />
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md">
          <h2 className="text-4xl font-heading text-white mb-4">כל הכבוד! 🎉</h2>
          <p dir="ltr" className="text-2xl text-white mb-4">{correct} מתוך {TOTAL_QUESTIONS} נכון!</p>
          <div className="text-5xl mb-6">
            {Array.from({ length: earnedStars }, () => '⭐').join('')}
          </div>
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
    <div className="min-h-screen bg-gradient-to-b from-gabby-purple to-gabby-pink p-4 flex flex-col">
      <BackButton />
      <ConfettiEffect trigger={celebrate} />

      {/* Progress bar */}
      <div className="mt-20 mb-6 mx-auto w-full max-w-md">
        <div className="bg-white/20 rounded-full h-4 overflow-hidden">
          <div
            className="bg-star-gold h-full rounded-full transition-all duration-500"
            style={{ width: `${((questionIndex) / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
        <p dir="ltr" className="text-white/80 text-center mt-1 text-lg">{questionIndex + 1} / {TOTAL_QUESTIONS}</p>
      </div>

      {/* Question */}
      <div className={`flex-1 flex flex-col items-center justify-center gap-6 ${shaking ? 'animate-shake' : ''}`}>
        {/* Visual objects */}
        <div className="flex gap-2 flex-wrap justify-center max-w-sm">
          {Array.from({ length: question.a }, (_, i) => (
            <span key={`a-${i}`} className="text-4xl">{question.obj}</span>
          ))}
        </div>

        <div dir="ltr" className="text-5xl md:text-7xl font-heading text-white text-center">
          {question.a} {question.op} {question.b} = ?
        </div>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
          {question.choices.map(choice => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              className="bg-white/25 backdrop-blur-sm text-white font-heading text-4xl
                rounded-2xl py-6 active:scale-95 transition-transform
                border-3 border-white/40 shadow-lg min-h-[80px]"
            >
              {choice}
            </button>
          ))}
        </div>

        {celebrate && (
          <div className="animate-bounce-in text-4xl font-heading text-star-gold">
            כל הכבוד! 🎉
          </div>
        )}
      </div>
    </div>
  )
}

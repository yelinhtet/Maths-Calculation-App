"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Eye, RotateCcw, Volume2, Monitor, Layers } from "lucide-react"

type Mode = "audio" | "display" | "both"
type Speed = "ultra_fast" | "fast" | "normal" | "slow" | "ultra_slow"

interface GameSettings {
  digits: number
  count: number
  speed: Speed
  mode: Mode
}

const SPEED_MS: Record<Speed, number> = {
  ultra_fast: 500,
  fast: 1000,
  normal: 2000,
  slow: 3000,
  ultra_slow: 4500,
}

function generateNumber(digits: number, canBeNegative: boolean): number {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return canBeNegative && Math.random() < 0.4 ? -num : num
}

function buildSequence(digits: number, count: number): number[] {
  const seq: number[] = []
  // First number must be positive
  seq.push(generateNumber(digits, false))
  let running = seq[0]

  for (let i = 1; i < count; i++) {
    let attempts = 0
    let num: number
    do {
      num = generateNumber(digits, true)
      attempts++
    } while (running + num < 0 && attempts < 100)
    if (running + num < 0) num = Math.abs(num)
    seq.push(num)
    running += num
  }
  return seq
}

const MODE_ICONS: Record<Mode, React.ReactNode> = {
  audio: <Volume2 className="w-4 h-4" />,
  display: <Monitor className="w-4 h-4" />,
  both: <Layers className="w-4 h-4" />,
}

const MODE_LABELS: Record<Mode, string> = {
  audio: "Audio Only",
  display: "Display Only",
  both: "Audio + Display",
}

interface Props {
  settings: GameSettings
}

export default function PlayScreen({ settings }: Props) {
  const [phase, setPhase] = useState<"idle" | "playing" | "answer">("idle")
  const [sequence, setSequence] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showNumber, setShowNumber] = useState(false)
  const [answer, setAnswer] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const startGame = useCallback(() => {
    clearTimers()
    const seq = buildSequence(settings.digits, settings.count)
    const ans = seq.reduce((a, b) => a + b, 0)
    setSequence(seq)
    setAnswer(ans)
    setCurrentIndex(0)
    setShowNumber(false)
    setPhase("playing")
  }, [settings])

  useEffect(() => {
    if (phase !== "playing") return
    const delay = SPEED_MS[settings.speed]
    let idx = 0

    const show = () => {
      setCurrentIndex(idx)
      setShowNumber(true)
      timerRef.current = setTimeout(() => {
        setShowNumber(false)
        idx++
        if (idx < sequence.length) {
          timerRef.current = setTimeout(show, 400)
        } else {
          setPhase("answer")
        }
      }, delay)
    }

    timerRef.current = setTimeout(show, 500)
    return () => clearTimers()
  }, [phase, sequence, settings.speed])

  const reset = () => {
    clearTimers()
    setPhase("idle")
    setShowNumber(false)
    setCurrentIndex(0)
  }

  const currentNum = sequence[currentIndex]
  const isNegative = typeof currentNum === "number" && currentNum < 0

  return (
    <div className="flex flex-col h-full bg-[#0F1117] text-[#F0F2FF]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flash Anzan</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Mental Arithmetic Training</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1A1D2E] border border-[#2E3150] rounded-full px-3 py-1.5 text-xs text-[#9CA3AF]">
          {MODE_ICONS[settings.mode]}
          <span>{MODE_LABELS[settings.mode]}</span>
        </div>
      </div>

      {/* Settings summary pill row */}
      <div className="px-5 flex gap-2 flex-wrap">
        {[
          { label: "Digits", value: settings.digits },
          { label: "Count", value: settings.count },
          { label: "Speed", value: settings.speed.replace("_", " ") },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#1A1D2E] border border-[#2E3150] rounded-lg px-3 py-1.5 text-xs"
          >
            <span className="text-[#9CA3AF]">{s.label}: </span>
            <span className="text-[#F0F2FF] font-semibold capitalize">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Main flash card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="w-full max-w-sm">
          {/* Flash card */}
          <div
            className="relative w-full aspect-[4/3] rounded-2xl border border-[#2E3150] bg-[#1A1D2E] flex flex-col items-center justify-center overflow-hidden"
            style={{ boxShadow: "0 0 60px rgba(59,130,246,0.08)" }}
          >
            {/* Glow behind number */}
            {showNumber && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isNegative
                    ? "radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)",
                }}
              />
            )}

            {phase === "idle" && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
                  <Play className="w-7 h-7 text-[#3B82F6] ml-1" />
                </div>
                <p className="text-[#9CA3AF] text-sm">Press Start to begin</p>
              </div>
            )}

            {phase === "playing" && !showNumber && (
              <div className="w-12 h-1 rounded-full bg-[#2E3150] animate-pulse" />
            )}

            {phase === "playing" && showNumber && (
              <div className="flex flex-col items-center gap-2">
                <span
                  className="font-mono font-black leading-none tracking-tight"
                  style={{
                    fontSize: settings.digits >= 3 ? "5rem" : "7rem",
                    color: isNegative ? "#EF4444" : "#F0F2FF",
                  }}
                >
                  {currentNum}
                </span>
                {/* progress dots */}
                <div className="flex gap-1.5 mt-4">
                  {sequence.map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor:
                          i < currentIndex
                            ? "#3B82F6"
                            : i === currentIndex
                            ? "#F0F2FF"
                            : "#2E3150",
                        transform: i === currentIndex ? "scale(1.4)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {phase === "answer" && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[#9CA3AF] text-sm uppercase tracking-widest font-medium">
                  = ?
                </span>
                <div className="text-[#F59E0B] font-mono font-black leading-none"
                  style={{ fontSize: "2rem" }}>
                  ?
                </div>
              </div>
            )}
          </div>

          {/* Sequence counter */}
          {phase === "playing" && (
            <p className="text-center text-[#9CA3AF] text-xs mt-3">
              {currentIndex + 1} / {sequence.length}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {phase === "idle" && (
            <button
              onClick={startGame}
              className="w-full py-4 rounded-2xl bg-[#3B82F6] text-white font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Play className="w-5 h-5 fill-white" />
              Start
            </button>
          )}

          {phase === "answer" && (
            <>
              <ShowAnswerButton answer={answer} sequence={sequence} />
              <button
                onClick={startGame}
                className="w-full py-3.5 rounded-2xl bg-[#1A1D2E] border border-[#2E3150] text-[#F0F2FF] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </>
          )}

          {phase === "playing" && (
            <button
              onClick={reset}
              className="w-full py-3.5 rounded-2xl bg-[#1A1D2E] border border-[#2E3150] text-[#9CA3AF] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ShowAnswerButton({ answer, sequence }: { answer: number; sequence: number[] }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="w-full">
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-4 rounded-2xl bg-[#F59E0B] text-[#0F1117] font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Eye className="w-5 h-5" />
          Show Answer
        </button>
      ) : (
        <div className="w-full rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 p-5 flex flex-col items-center gap-1">
          <p className="text-[#10B981] text-xs font-semibold uppercase tracking-widest">Answer</p>
          <p className="text-[#F0F2FF] font-mono font-black text-5xl">{answer}</p>
          <p className="text-[#9CA3AF] text-xs mt-1">
            {sequence.map((n, i) => (
              <span key={i}>
                {i > 0 && n >= 0 ? "+" : ""}
                {n}
                {i < sequence.length - 1 ? " " : ""}
              </span>
            ))}
            {" "}= {answer}
          </p>
        </div>
      )}
    </div>
  )
}

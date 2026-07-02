"use client"

import { useState } from "react"
import { Volume2, Monitor, Layers, Download, ChevronDown, ChevronUp, X } from "lucide-react"

interface HistoryRecord {
  id: string
  datetime: string
  digits: number
  count: number
  speed: string
  mode: "audio" | "display" | "both"
  sequence: number[]
  answer: number
  username: string
}

const SAMPLE: HistoryRecord[] = [
  {
    id: "1",
    datetime: "2026-07-02 09:14",
    digits: 2,
    count: 5,
    speed: "Normal",
    mode: "both",
    sequence: [34, -12, 56, -9, 21],
    answer: 90,
    username: "Alex",
  },
  {
    id: "2",
    datetime: "2026-07-02 08:55",
    digits: 1,
    count: 7,
    speed: "Fast",
    mode: "display",
    sequence: [7, 3, -2, 8, 1, -4, 6],
    answer: 19,
    username: "Alex",
  },
  {
    id: "3",
    datetime: "2026-07-01 21:30",
    digits: 3,
    count: 4,
    speed: "Ultra Slow",
    mode: "audio",
    sequence: [423, -111, 305, -88],
    answer: 529,
    username: "Alex",
  },
  {
    id: "4",
    datetime: "2026-07-01 19:05",
    digits: 2,
    count: 6,
    speed: "Slow",
    mode: "display",
    sequence: [45, 32, -11, 67, -20, 13],
    answer: 126,
    username: "Alex",
  },
  {
    id: "5",
    datetime: "2026-07-01 14:22",
    digits: 1,
    count: 3,
    speed: "Ultra Fast",
    mode: "both",
    sequence: [9, 5, -3],
    answer: 11,
    username: "Alex",
  },
]

const MODE_ICON = {
  audio: <Volume2 className="w-4 h-4" />,
  display: <Monitor className="w-4 h-4" />,
  both: <Layers className="w-4 h-4" />,
}

const MODE_COLOR = {
  audio: "#3B82F6",
  display: "#10B981",
  both: "#F59E0B",
}

export default function HistoryScreen() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [exportMsg, setExportMsg] = useState(false)

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id))

  const handleExport = () => {
    setExportMsg(true)
    setTimeout(() => setExportMsg(false), 2000)
  }

  return (
    <div className="flex flex-col h-full bg-[#0F1117] text-[#F0F2FF]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">History</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">{SAMPLE.length} sessions recorded</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 bg-[#1A1D2E] border border-[#2E3150] rounded-xl px-3 py-2 text-sm text-[#9CA3AF] active:scale-95 transition-transform"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {exportMsg && (
        <div className="mx-5 mb-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Download className="w-4 h-4 text-[#10B981]" />
          <p className="text-[#10B981] text-sm font-medium">Export ready — {SAMPLE.length} records for Alex</p>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-3">
        {SAMPLE.map((rec) => (
          <div
            key={rec.id}
            className="bg-[#1A1D2E] border border-[#2E3150] rounded-2xl overflow-hidden"
          >
            {/* Row */}
            <button
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-[#252840] transition-colors"
              onClick={() => toggle(rec.id)}
            >
              {/* Mode badge */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${MODE_COLOR[rec.mode]}18`,
                  color: MODE_COLOR[rec.mode],
                  border: `1px solid ${MODE_COLOR[rec.mode]}30`,
                }}
              >
                {MODE_ICON[rec.mode]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#F0F2FF] truncate">
                    {rec.digits}d × {rec.count} nums
                  </p>
                  <span className="text-xs text-[#9CA3AF] bg-[#252840] rounded-md px-1.5 py-0.5">
                    {rec.speed}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{rec.datetime}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono font-bold text-[#F0F2FF]">= {rec.answer}</span>
                {expanded === rec.id ? (
                  <ChevronUp className="w-4 h-4 text-[#9CA3AF]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
                )}
              </div>
            </button>

            {/* Expanded detail */}
            {expanded === rec.id && (
              <div className="border-t border-[#2E3150] px-4 py-4 bg-[#252840]/40">
                {rec.mode === "audio" ? (
                  <div className="flex items-center gap-3 bg-[#1A1D2E] border border-[#2E3150] rounded-xl px-4 py-3">
                    <Volume2 className="w-5 h-5 text-[#3B82F6]" />
                    <div>
                      <p className="text-sm font-semibold text-[#F0F2FF]">Audio Session</p>
                      <p className="text-xs text-[#9CA3AF]">{rec.sequence.length} numbers played via TTS</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-2 uppercase tracking-widest font-medium">Flash Sequence</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.sequence.map((n, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-0.5"
                        >
                          <div
                            className="w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-sm"
                            style={{
                              backgroundColor: n < 0 ? "rgba(239,68,68,0.08)" : "rgba(59,130,246,0.08)",
                              borderColor: n < 0 ? "rgba(239,68,68,0.25)" : "rgba(59,130,246,0.25)",
                              color: n < 0 ? "#EF4444" : "#F0F2FF",
                            }}
                          >
                            {n}
                          </div>
                          <span className="text-[10px] text-[#9CA3AF]">#{i + 1}</span>
                        </div>
                      ))}
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-12 h-12 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 flex items-center justify-center font-mono font-bold text-sm text-[#10B981]">
                          {rec.answer}
                        </div>
                        <span className="text-[10px] text-[#10B981]">Ans</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex gap-2 flex-wrap text-xs">
                  <span className="bg-[#1A1D2E] border border-[#2E3150] rounded-lg px-2.5 py-1 text-[#9CA3AF]">
                    User: <span className="text-[#F0F2FF]">{rec.username}</span>
                  </span>
                  <span className="bg-[#1A1D2E] border border-[#2E3150] rounded-lg px-2.5 py-1 text-[#9CA3AF]">
                    {rec.datetime}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

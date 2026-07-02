"use client"

import { useState } from "react"
import { Check, Volume2, Monitor, Layers, Minus, Plus } from "lucide-react"

type Mode = "audio" | "display" | "both"
type Speed = "ultra_fast" | "fast" | "normal" | "slow" | "ultra_slow"

interface GameSettings {
  digits: number
  count: number
  speed: Speed
  mode: Mode
}

const SPEEDS: { value: Speed; label: string; ms: string }[] = [
  { value: "ultra_fast", label: "Ultra Fast", ms: "0.5s" },
  { value: "fast", label: "Fast", ms: "1s" },
  { value: "normal", label: "Normal", ms: "2s" },
  { value: "slow", label: "Slow", ms: "3s" },
  { value: "ultra_slow", label: "Ultra Slow", ms: "4.5s" },
]

const MODES: { value: Mode; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "audio", label: "Audio Only", icon: <Volume2 className="w-5 h-5" />, desc: "TTS voice reads numbers" },
  { value: "display", label: "Display Only", icon: <Monitor className="w-5 h-5" />, desc: "Flash cards on screen" },
  { value: "both", label: "Audio + Display", icon: <Layers className="w-5 h-5" />, desc: "Both voice and cards" },
]

interface Props {
  settings: GameSettings
  onChange: (s: GameSettings) => void
}

export default function SettingsScreen({ settings, onChange }: Props) {
  const [saved, setSaved] = useState(false)

  const update = <K extends keyof GameSettings>(key: K, val: GameSettings[K]) => {
    onChange({ ...settings, [key]: val })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="flex flex-col h-full bg-[#0F1117] text-[#F0F2FF] overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Game Settings</h1>
        <p className="text-[#9CA3AF] text-sm mt-0.5">Customize your training session</p>
      </div>

      <div className="px-5 flex flex-col gap-5 pb-8">
        {/* Digits */}
        <Section title="Digits" desc="Number of digits per value">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => update("digits", d)}
                className="flex-1 py-3 rounded-xl font-bold text-lg transition-all active:scale-95"
                style={{
                  background: settings.digits === d ? "#3B82F6" : "#1A1D2E",
                  color: settings.digits === d ? "#fff" : "#9CA3AF",
                  border: `1px solid ${settings.digits === d ? "#3B82F6" : "#2E3150"}`,
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </Section>

        {/* Count */}
        <Section title="Display Count" desc="How many numbers to show (min 2, max 20)">
          <div className="flex items-center gap-4">
            <button
              onClick={() => update("count", Math.max(2, settings.count - 1))}
              className="w-11 h-11 rounded-xl bg-[#1A1D2E] border border-[#2E3150] flex items-center justify-center active:scale-90 transition-transform text-[#F0F2FF]"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-4xl font-black font-mono text-[#F0F2FF]">{settings.count}</span>
              {settings.count === 20 && (
                <p className="text-[#F59E0B] text-xs mt-0.5">Maximum</p>
              )}
            </div>
            <button
              onClick={() => update("count", Math.min(20, settings.count + 1))}
              className="w-11 h-11 rounded-xl bg-[#1A1D2E] border border-[#2E3150] flex items-center justify-center active:scale-90 transition-transform text-[#F0F2FF]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {/* slider */}
          <input
            type="range"
            min={2}
            max={20}
            value={settings.count}
            onChange={(e) => update("count", Number(e.target.value))}
            className="w-full accent-[#3B82F6] mt-2"
          />
          <div className="flex justify-between text-xs text-[#9CA3AF]">
            <span>2</span>
            <span>20 (max)</span>
          </div>
        </Section>

        {/* Speed */}
        <Section title="Display Speed" desc="Duration each number is shown">
          <div className="flex flex-col gap-2">
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                onClick={() => update("speed", s.value)}
                className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all active:scale-95"
                style={{
                  background: settings.speed === s.value ? "#3B82F6/10" : "#1A1D2E",
                  backgroundColor: settings.speed === s.value ? "rgba(59,130,246,0.12)" : "#1A1D2E",
                  borderColor: settings.speed === s.value ? "#3B82F6" : "#2E3150",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: settings.speed === s.value ? "#3B82F6" : "#2E3150" }}
                  />
                  <span
                    className="font-semibold text-sm"
                    style={{ color: settings.speed === s.value ? "#F0F2FF" : "#9CA3AF" }}
                  >
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9CA3AF] font-mono">{s.ms}</span>
                  {settings.speed === s.value && (
                    <Check className="w-4 h-4 text-[#3B82F6]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* Mode */}
        <Section title="Mode" desc="How numbers are presented to you">
          <div className="flex flex-col gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => update("mode", m.value)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all active:scale-95"
                style={{
                  backgroundColor: settings.mode === m.value ? "rgba(245,158,11,0.1)" : "#1A1D2E",
                  borderColor: settings.mode === m.value ? "#F59E0B" : "#2E3150",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: settings.mode === m.value ? "rgba(245,158,11,0.2)" : "#252840",
                    color: settings.mode === m.value ? "#F59E0B" : "#9CA3AF",
                  }}
                >
                  {m.icon}
                </div>
                <div className="flex-1 text-left">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: settings.mode === m.value ? "#F0F2FF" : "#9CA3AF" }}
                  >
                    {m.label}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{m.desc}</p>
                </div>
                {settings.mode === m.value && (
                  <Check className="w-4 h-4 text-[#F59E0B] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all mt-1"
          style={{
            background: saved ? "#10B981" : "#3B82F6",
            color: "#fff",
          }}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              Saved!
            </>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </div>
  )
}

function Section({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#1A1D2E] border border-[#2E3150] rounded-2xl p-4 flex flex-col gap-3">
      <div>
        <p className="font-bold text-[#F0F2FF]">{title}</p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  )
}

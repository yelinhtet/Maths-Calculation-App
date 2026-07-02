"use client"

import { useState } from "react"
import { Play, Settings2, History, User } from "lucide-react"
import PlayScreen from "./PlayScreen"
import SettingsScreen from "./SettingsScreen"
import HistoryScreen from "./HistoryScreen"
import ProfileScreen from "./ProfileScreen"

type Tab = "play" | "settings" | "history" | "profile"
type Mode = "audio" | "display" | "both"
type Speed = "ultra_fast" | "fast" | "normal" | "slow" | "ultra_slow"

interface GameSettings {
  digits: number
  count: number
  speed: Speed
  mode: Mode
}

const DEFAULT_SETTINGS: GameSettings = {
  digits: 2,
  count: 5,
  speed: "normal",
  mode: "display",
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "play", label: "Play", icon: <Play className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings2 className="w-5 h-5" /> },
  { id: "history", label: "History", icon: <History className="w-5 h-5" /> },
  { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
]

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("play")
  const [gameSettings, setGameSettings] = useState<GameSettings>(DEFAULT_SETTINGS)

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#070A10]">
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "min(100vw, 390px)",
          height: "min(100vh, 844px)",
          background: "#0F1117",
          borderRadius: "clamp(0px, 2vw, 48px)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 shrink-0">
          <span className="text-[#F0F2FF] text-xs font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal */}
            <div className="flex gap-0.5 items-end h-3">
              {[3, 5, 7, 9].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-sm"
                  style={{ height: h, backgroundColor: i < 3 ? "#F0F2FF" : "#2E3150" }}
                />
              ))}
            </div>
            {/* WiFi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="#F0F2FF"/>
              <path d="M4.5 6.5c.8-.9 1.9-1.5 3-1.5s2.2.6 3 1.5" stroke="#F0F2FF" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M1.5 3.5A9 9 0 0 1 7.5 1a9 9 0 0 1 6 2.5" stroke="#F0F2FF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5"/>
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-px">
              <div className="w-5 h-2.5 rounded-sm border border-[#F0F2FF]/60 relative p-px">
                <div className="h-full w-4/5 rounded-[1px] bg-[#F0F2FF]" />
              </div>
              <div className="w-0.5 h-1.5 rounded-r-sm bg-[#F0F2FF]/50" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{ opacity: activeTab === "play" ? 1 : 0, pointerEvents: activeTab === "play" ? "auto" : "none" }}
          >
            <PlayScreen settings={gameSettings} />
          </div>
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{ opacity: activeTab === "settings" ? 1 : 0, pointerEvents: activeTab === "settings" ? "auto" : "none" }}
          >
            <SettingsScreen settings={gameSettings} onChange={setGameSettings} />
          </div>
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{ opacity: activeTab === "history" ? 1 : 0, pointerEvents: activeTab === "history" ? "auto" : "none" }}
          >
            <HistoryScreen />
          </div>
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{ opacity: activeTab === "profile" ? 1 : 0, pointerEvents: activeTab === "profile" ? "auto" : "none" }}
          >
            <ProfileScreen />
          </div>
        </div>

        {/* Bottom nav */}
        <nav
          className="shrink-0 flex items-center px-2 pb-6 pt-2 border-t border-[#2E3150]"
          style={{ background: "#0F1117" }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-1 rounded-xl transition-all active:scale-90"
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
              >
                <div
                  className="flex items-center justify-center w-12 h-7 rounded-full transition-all"
                  style={{
                    background: active ? "rgba(59,130,246,0.18)" : "transparent",
                    color: active ? "#3B82F6" : "#9CA3AF",
                  }}
                >
                  {tab.icon}
                </div>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: active ? "#3B82F6" : "#9CA3AF" }}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

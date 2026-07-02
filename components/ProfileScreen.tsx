"use client"

import { useState } from "react"
import { Lock, Unlock, Calendar, Clock, User, Edit3, Check, X } from "lucide-react"

const AVATARS = ["🧑‍💻", "👦", "👧", "🧒", "👨", "👩", "🧔", "👴", "👵"]

interface Profile {
  username: string
  age: number
  avatarIndex: number
  locked: boolean
  enrolledDate: string
  installedDate: string
}

const DEFAULT_PROFILE: Profile = {
  username: "Alex",
  age: 12,
  avatarIndex: 0,
  locked: false,
  enrolledDate: "2026-01-15",
  installedDate: "2026-01-10",
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Profile>(DEFAULT_PROFILE)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  const startEdit = () => {
    if (profile.locked) return
    setDraft({ ...profile })
    setEditing(true)
  }

  const saveEdit = () => {
    setProfile(draft)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft({ ...profile })
    setEditing(false)
    setShowAvatarPicker(false)
  }

  const toggleLock = () => {
    if (editing) return
    setProfile((p) => ({ ...p, locked: !p.locked }))
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="flex flex-col h-full bg-[#0F1117] text-[#F0F2FF] overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Your account details</p>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button
                onClick={toggleLock}
                className="w-10 h-10 rounded-xl bg-[#1A1D2E] border border-[#2E3150] flex items-center justify-center active:scale-90 transition-transform"
                aria-label={profile.locked ? "Unlock profile" : "Lock profile"}
              >
                {profile.locked ? (
                  <Lock className="w-4 h-4 text-[#F59E0B]" />
                ) : (
                  <Unlock className="w-4 h-4 text-[#9CA3AF]" />
                )}
              </button>
              <button
                onClick={startEdit}
                disabled={profile.locked}
                className="w-10 h-10 rounded-xl bg-[#1A1D2E] border border-[#2E3150] flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
                aria-label="Edit profile"
              >
                <Edit3 className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={cancelEdit}
                className="w-10 h-10 rounded-xl bg-[#1A1D2E] border border-[#2E3150] flex items-center justify-center active:scale-90 transition-transform"
              >
                <X className="w-4 h-4 text-[#9CA3AF]" />
              </button>
              <button
                onClick={saveEdit}
                className="w-10 h-10 rounded-xl bg-[#3B82F6] flex items-center justify-center active:scale-90 transition-transform"
              >
                <Check className="w-4 h-4 text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-5 pb-8 flex flex-col gap-5">
        {/* Avatar card */}
        <div className="bg-[#1A1D2E] border border-[#2E3150] rounded-2xl p-6 flex flex-col items-center gap-3">
          <button
            onClick={() => editing && setShowAvatarPicker((v) => !v)}
            className="relative"
            aria-label="Choose avatar"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl select-none"
              style={{
                background: "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
                boxShadow: "0 8px 32px rgba(59,130,246,0.25)",
              }}
            >
              {AVATARS[editing ? draft.avatarIndex : profile.avatarIndex]}
            </div>
            {editing && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#3B82F6] border-2 border-[#0F1117] flex items-center justify-center">
                <Edit3 className="w-3 h-3 text-white" />
              </div>
            )}
          </button>

          {showAvatarPicker && editing && (
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              {AVATARS.map((a, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDraft((d) => ({ ...d, avatarIndex: i }))
                    setShowAvatarPicker(false)
                  }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl transition-all"
                  style={{
                    background: draft.avatarIndex === i ? "rgba(59,130,246,0.2)" : "#252840",
                    border: `1px solid ${draft.avatarIndex === i ? "#3B82F6" : "#2E3150"}`,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          )}

          <div className="text-center">
            {editing ? (
              <input
                value={draft.username}
                onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
                className="bg-[#252840] border border-[#3B82F6] rounded-xl px-3 py-1.5 text-lg font-bold text-center text-[#F0F2FF] outline-none w-40"
              />
            ) : (
              <h2 className="text-xl font-bold">{profile.username}</h2>
            )}
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {profile.locked ? (
                <Lock className="w-3 h-3 text-[#F59E0B]" />
              ) : (
                <Unlock className="w-3 h-3 text-[#9CA3AF]" />
              )}
              <span
                className="text-xs font-medium"
                style={{ color: profile.locked ? "#F59E0B" : "#9CA3AF" }}
              >
                {profile.locked ? "Profile locked" : "Profile unlocked"}
              </span>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="bg-[#1A1D2E] border border-[#2E3150] rounded-2xl overflow-hidden">
          <InfoRow
            icon={<User className="w-4 h-4" />}
            label="Username"
            value={
              editing ? (
                <input
                  value={draft.username}
                  onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
                  className="bg-[#252840] border border-[#2E3150] rounded-lg px-2 py-0.5 text-sm text-right text-[#F0F2FF] outline-none w-28"
                />
              ) : (
                profile.username
              )
            }
          />
          <div className="h-px bg-[#2E3150]" />
          <InfoRow
            icon={<span className="text-sm">🎂</span>}
            label="Age"
            value={
              editing ? (
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={draft.age}
                  onChange={(e) => setDraft((d) => ({ ...d, age: Number(e.target.value) }))}
                  className="bg-[#252840] border border-[#2E3150] rounded-lg px-2 py-0.5 text-sm text-right text-[#F0F2FF] outline-none w-20"
                />
              ) : (
                `${profile.age} years old`
              )
            }
          />
          <div className="h-px bg-[#2E3150]" />
          <InfoRow
            icon={<Calendar className="w-4 h-4" />}
            label="Enrolled"
            value={fmt(profile.enrolledDate)}
          />
          <div className="h-px bg-[#2E3150]" />
          <InfoRow
            icon={<Clock className="w-4 h-4" />}
            label="Installed"
            value={fmt(profile.installedDate)}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Sessions", value: "5" },
            { label: "Best Streak", value: "3" },
            { label: "Avg Speed", value: "Normal" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#1A1D2E] border border-[#2E3150] rounded-2xl p-4 flex flex-col items-center gap-1"
            >
              <p className="text-lg font-black text-[#F0F2FF]">{s.value}</p>
              <p className="text-[10px] text-[#9CA3AF] text-center leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex items-center gap-3 text-[#9CA3AF]">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[#F0F2FF]">{value}</span>
    </div>
  )
}

'use client'
import LogoutButton from '@/components/LogoutButton'
import { getMyFarm } from '@/lib/api/farmReg'
import { MyFarm } from '@/types/farmregistration'
import React, { useEffect, useState } from 'react'

const IRRIGATION_ICON: Record<string, string> = {
  DRIP: '💧', SPRINKLER: '🌧️', FLOOD: '🌊', RAIN_FED: '🌦️',
}
const SOIL_ICON: Record<string, string> = {
  CLAY: '🟤', SANDY: '🟡', LOAM: '🌱', SILT: '⚫',
}

const Farm = () => {
  const [checking, setChecking] = useState(true)
  const [myFarm, setMyFarm] = useState<any>(null)

  useEffect(() => {
    const checkFarm = async () => {
      const farm = await getMyFarm()
      setMyFarm(farm)
      setChecking(false)
    }
    checkFarm()
  }, [])

  if (checking) return (
    <div className="flex items-center justify-center min-h-screen bg-stone-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-lime-500/30 border-t-lime-500 animate-spin" />
        <p className="text-stone-400 text-sm font-light tracking-widest uppercase">
          Loading…
        </p>
      </div>
    </div>
  )

  if (!myFarm) return (
    <div className="flex items-center justify-center min-h-screen bg-stone-950">
      <p className="text-stone-500 text-sm">No farm data found.</p>
    </div>
  )

  const initials = `${myFarm.owner.firstName.charAt(0)}${myFarm.owner.lastName.charAt(0)}`
  const statusActive = myFarm.status === 'ACTIVE'
  const registeredDate = new Date(myFarm.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      {/* Full page shell */}
      <div className="min-h-screen pt-20 bg-stone-950 text-stone-100 px-6 py-8 md:px-10 xl:px-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Top bar */}

        <div className="max-w-5xl mx-auto space-y-5">

          {/* ── Hero card ── */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-lime-950 border border-stone-800 p-7 sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-lime-500/5 blur-3xl" />
            <div className="pointer-events-none absolute right-6 top-4 text-[6rem] opacity-[0.05] select-none leading-none">🌾</div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase
                  ${statusActive
                    ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
                    : 'bg-stone-700/40 text-stone-400 border border-stone-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusActive ? 'bg-lime-400' : 'bg-stone-500'}`} />
                  {myFarm.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase
                  ${myFarm.isVerified
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {myFarm.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold text-stone-50 mb-1.5 leading-tight"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {myFarm.name}
              </h1>
              <p className="text-stone-400 text-sm font-light tracking-wide">
                📍 {myFarm.city}, {myFarm.state}
              </p>
              {myFarm.registrationNo && (
                <p className="text-stone-500 text-xs mt-1">Reg # {myFarm.registrationNo}</p>
              )}
              <p className="text-stone-600 text-xs mt-1">Registered on {registeredDate}</p>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Hectares', value: String(myFarm.areaHectares), icon: '📐', big: true },
              { label: 'Crop Cycles', value: String(myFarm._count?.cropCycles ?? 0), icon: '🌽', big: true },
              { label: 'Soil Reports', value: String(myFarm._count?.soilReports ?? 0), icon: '🧪', big: true },
              { label: 'Irrigation', value: myFarm.irrigationType ?? '—', icon: IRRIGATION_ICON[myFarm.irrigationType ?? ''] ?? '🚿', big: false },
            ].map(({ label, value, icon, big }) => (
              <div
                key={label}
                className="rounded-xl bg-stone-900 border border-stone-800 hover:border-lime-900 transition-colors duration-200 p-5 flex flex-col gap-2"
              >
                <span className="text-xl leading-none">{icon}</span>
                <span
                  className={`font-bold text-stone-100 leading-none ${big ? 'text-2xl' : 'text-sm'}`}
                  style={big ? { fontFamily: "'Lora', serif" } : {}}
                >
                  {value}
                </span>
                <span className="text-[11px] text-stone-500 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Farm details + Owner ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Farm details */}
            <div className="rounded-xl bg-stone-900 border border-stone-800 p-6">
              <p className="text-[11px] text-lime-600/80 uppercase tracking-[0.15em] font-medium mb-4">
                Farm Details
              </p>
              {[
                { label: 'Soil Type', value: `${SOIL_ICON[myFarm.soilType ?? ''] ?? '🌍'} ${myFarm.soilType ?? '—'}` },
                { label: 'Irrigation', value: `${IRRIGATION_ICON[myFarm.irrigationType ?? ''] ?? '🚿'} ${myFarm.irrigationType ?? '—'}` },
                { label: 'Total Area', value: `${myFarm.areaHectares} hectares` },
                { label: 'Location', value: `${myFarm.city}, ${myFarm.state}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-stone-800/80 last:border-0">
                  <span className="text-stone-500 text-xs">{label}</span>
                  <span className="text-stone-200 text-sm font-medium text-right max-w-[55%]">{value}</span>
                </div>
              ))}
            </div>

            {/* Owner */}
            <div className="rounded-xl bg-stone-900 border border-stone-800 p-6 flex flex-col justify-between">
              <p className="text-[11px] text-lime-600/80 uppercase tracking-[0.15em] font-medium mb-5">
                Farm Owner
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-800 to-emerald-900 border border-lime-700/30 flex items-center justify-center text-lime-200 font-bold text-base flex-shrink-0"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-stone-100 font-medium text-sm">
                    {myFarm.owner.firstName} {myFarm.owner.lastName}
                  </p>
                  <p className="text-stone-500 text-xs mt-0.5 break-all">{myFarm.owner.email}</p>
                </div>
              </div>

              {/* divider + registered date */}
              <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-stone-600 text-xs uppercase tracking-wider">Member since</span>
                <span className="text-stone-400 text-xs">{registeredDate}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Farm
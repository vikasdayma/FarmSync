

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { TaskCard} from "@/components/farmer/TaskCard";
import { StatCard } from "./orders/StatCard";
import { getMyFarm } from "@/lib/api/farmReg";
import RadialGauge from "@/components/farmer/RadialGauge";
import MapPin from "@/components/farmer/MapPin";
import MapChip from "@/components/farmer/MapChip";
import { FarmProfileCard } from "@/components/farmer/FarmProfileCard";
import NoFarm from "@/components/farmer/NoFarm";
import FarmMapPreview from "@/components/farmer/FarmMapPreview";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const IRRIGATION_ICON: Record<string, string> = {
  DRIP: "💧",
  SPRINKLER: "🌧️",
  FLOOD: "🌊",
  RAIN_FED: "🌦️",
};







export default function Dashboard() {
  const [checking, setChecking] = useState(true);
  const [myFarm, setMyFarm] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkFarm = async () => {
      const farm = await getMyFarm();
        console.log(farm)
      setMyFarm(farm);
      setChecking(false);
    
    };
    checkFarm();
  }, []);


  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e3f3e3]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#142B1D]/15 border-t-[#3F7A3E]" />
          <p className="text-sm font-light uppercase tracking-widest text-[#142B1D]/40">
            Loading…
          </p>
        </div>
      </div>
    );
  }

 
  if (!myFarm) {
    return (
      
    <NoFarm/>
    );
  }

  const initials = `${myFarm.owner.firstName.charAt(
    0
  )}${myFarm.owner.lastName.charAt(0)}`;
  const statusActive = myFarm.status === "ACTIVE";

  return (
    <div
      className={`${poppins.variable} grid grid-cols-1 
        bg-[#a8afb7] font-[family-name:var(--font-display)] lg:grid-cols-[1fr_460px]`}
    
    >
    
      <div className=" p-5 sm:p-7  bg-[#a8afb7]">
    
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 text-black shadow-sm shadow-black/10 border border-black/[0.04]">
  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#12331F] text-base font-bold text-white">
    {initials}
  </div>

  <div className="min-w-0 flex-1">
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="truncate text-lg font-semibold text-[#12331F]">
        {myFarm.name}
      </h2>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
          statusActive
            ? "border border-[#6FA35A]/30 bg-[#6FA35A]/10 text-[#3F7A3E]"
            : "border border-black/10 bg-black/[0.03] text-black/50"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            statusActive ? "bg-[#3F7A3E]" : "bg-black/30"
          }`}
        />
        {myFarm.status}
      </span>
      {myFarm.isVerified && (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#6FA35A]/30 bg-[#6FA35A]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#3F7A3E]">
          ✓ Verified
        </span>
      )}
    </div>
    <p className="mt-0.5 truncate text-[13px] text-black/50">
      {myFarm.owner.firstName} {myFarm.owner.lastName} · 📍{" "}
      {myFarm.city}, {myFarm.state}
    </p>
  </div>
</div>

        {/* stat row: farm data (2x2) + weather */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid grid-cols-2 grid-cols-2 gap-4">
            {[
              { label: 'Hectares', value: String(myFarm.areaHectares), icon: '📐', big: true },
              { label: 'Crop Cycles', value: String(myFarm._count?.cropCycles ?? 0), icon: '🌽', big: true },
              { label: 'Soil Reports', value: String(myFarm._count?.soilReports ?? 0), icon: '🧪', big: true },
              { label: 'Irrigation', value: myFarm.irrigationType ?? '—', icon: IRRIGATION_ICON[myFarm.irrigationType ?? ''] ?? '🚿', big: false },
            ].map(({ label, value, icon, big }) => (
              <div
                key={label}
                className="rounded-xl bg-white border border-[#e8e4df] hover:border-[#6FA35A]/50 shadow-md transition-all duration-200 p-5 flex flex-col gap-2"
              >
                <span className="text-xl leading-none">{icon}</span>
                <span
                  className={`font-bold text-[#12331f] leading-none ${big ? 'text-2xl' : 'text-sm'}`}
                  style={big ? { fontFamily: "'Lora', serif" } : {}}
                >
                  {value}
                </span>
                <span className="text-[11px] text-[#12331f]/40 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-black/[0.04]
          
          bg-white p-5   shadow-md ">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#142B1D]/55
            
              ">
                Weather
              </span>
            </div>

            <div className="mt-3 space-y-2 text-[13px] text-[#142B1D]/65">
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-[#142B1D]/40"
                >
                  <path d="M6 16a4 4 0 010-8 5 5 0 019.6-1.5A4.5 4.5 0 0119 16H6z" />
                </svg>
                Cloudy
              </div>
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4 text-[#142B1D]/40"
                >
                  <path d="M3 8h11a3 3 0 100-3M3 16h14a3 3 0 110 3M3 12h9" />
                </svg>
                Wind
              </div>
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-[#142B1D]/40"
                >
                  <path d="M12 2s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z" />
                </svg>
                62%
              </div>
            </div>

            <div className="mt-5 text-center text-5xl font-bold text-[#142B1D]">
              30°
            </div>

            <div className="mt-5">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EDF3E8]">
                <div className="flex h-full w-full">
                  <div className="h-full w-1/2 bg-gradient-to-r from-[#B7DD8F] to-[#D8DE6F]" />
                  <div className="h-full w-1/2 bg-gradient-to-r from-[#E8C267] to-[#E08A4E]" />
                </div>
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-[#142B1D]/45">
                <span>27°</span>
                <span>28°</span>
                <span>30°</span>
                <span>31°</span>
              </div>
            </div>
          </div>
        </div>

       
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
             <FarmProfileCard
  soilType={myFarm.soilType}
  irrigationType={myFarm.irrigationType}
  status={myFarm.status}
  isVerified={myFarm.isVerified}
  registrationNo={myFarm.registrationNo}
  createdAt={myFarm.createdAt}
  soilReportsCount={myFarm._count?.soilReports ?? 0}
  onViewSoilReports={() => router.push(`/dashboard/farm/${myFarm.id}/soil-reports`)}
/>

          <div className="rounded-2xl border border-black/[0.04] bg-white p-5 shadow-sm shadow-black/12">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#142B1D]/55">
                Farm Performance
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-[#142B1D]/40"
              >
                <circle cx="5" cy="12" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="19" cy="12" r="1.6" />
              </svg>
            </div>

            <RadialGauge />

            <div className="mt-4 flex items-center justify-center gap-5 text-[11px] text-[#142B1D]/60">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#CFE8B0]" />{" "}
                Utilization
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#8FBF6B]" /> Health
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2F5D3A]" /> On
                Track
              </span>
            </div>
          </div>
        </div>

       
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
         
        </div>
      </div>
      
    <FarmMapPreview/>
     
    </div>
  );
}
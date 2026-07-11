
// "use client";

// import { Poppins } from "next/font/google";
// import { TaskCard } from "@/components/dashboard/TaskCard";
// import { StatCard } from "./orders/StatCard";
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   variable: "--font-display",
// });



// function RadialGauge() {

//   const rings = [
//     { r: 42, pct: 61, color: "#CFE8B0", track: "#EEF4E5" },
//     { r: 32, pct: 36, color: "#8FBF6B", track: "#E7F0DC" },
//     { r: 22, pct: 79, color: "#2F5D3A", track: "#DCE9D0" },
//   ];
//   const c = (r: number) => 2 * Math.PI * r;

//   return (
//     <div className="relative mx-auto h-[190px] w-[190px]">
//       <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
//         {rings.map((ring) => (
//           <g key={ring.r}>
//             <circle
//               cx="50"
//               cy="50"
//               r={ring.r}
//               fill="none"
//               stroke={ring.track}
//               strokeWidth={7}
//             />
//             <circle
//               cx="50"
//               cy="50"
//               r={ring.r}
//               fill="none"
//               stroke={ring.color}
//               strokeWidth={7}
//               strokeLinecap="round"
//               strokeDasharray={`${(ring.pct / 100) * c(ring.r)} ${c(
//                 ring.r
//               )}`}
//             />
//           </g>
//         ))}
//       </svg>

//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-[11px] text-[#142B1D]/50">Overall Score</span>
//         <span className="text-2xl font-bold text-[#142B1D]">72%</span>
//       </div>

//       <span className="absolute -left-3 top-3 rounded-md bg-[#F4F8F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#142B1D]/70 shadow-sm">
//         61%
//       </span>
//       <span className="absolute -right-3 top-3 rounded-md bg-[#F4F8F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#142B1D]/70 shadow-sm">
//         36%
//       </span>
//       <span className="absolute -right-2 bottom-6 rounded-md bg-[#F4F8F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#142B1D]/70 shadow-sm">
//         79%
//       </span>
//     </div>
//   );
// }


// function MapPin({
//   color,
//   className,
// }: {
//   color: string;
//   className: string;
// }) {
//   return (
//     <span
//       className={`absolute h-3.5 w-3.5 rounded-full ring-4 ${className}`}
//       style={{ backgroundColor: color, boxShadow: `0 0 0 4px ${color}33` }}
//     />
//   );
// }

// function MapChip({ children, className }: { children: React.ReactNode; className: string }) {
//   return (
//     <span
//       className={`absolute rounded-xl bg-black/40 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md ${className}`}
//     >
//       {children}
//     </span>
//   );
// }


// export default function Dashboard() {
//   return (

//     <div
//       className={`${poppins.variable}  grid h-screen grid-cols-1 bg-[#e3f3e3] font-[family-name:var(--font-display)] lg:grid-cols-[1fr_460px]`}
//     >
//       {/* ================= LEFT: DASHBOARD CONTENT ================= */}
//       <div className="overflow-y-auto p-5 sm:p-7">
//         {/* top bar */}
//         <div className="mb-6 flex flex-wrap items-center gap-3">
//           <div className="flex items-center gap-2 rounded-full bg-[#0F3D2E] py-2.5 pl-4 pr-5 text-[13px] font-medium text-white">
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
//               <path d="M5 12l4 4L19 6" />
//             </svg>
//             Task Completed
//             <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">10</span>
//           </div>

//           <div
//             className="flex items-center gap-2 rounded-full border border-[#142B1D]/15 py-2.5 pl-4 pr-5 text-[13px] font-medium text-[#142B1D]/70"
//             style={{
//               backgroundImage:
//                 "repeating-linear-gradient(135deg, rgba(20,43,29,0.04) 0 3px, transparent 3px 8px)",
//             }}
//           >
//             Task Pending
//             <span className="ml-1 rounded-full bg-[#142B1D]/10 px-2 py-0.5 text-[11px]">12</span>
//           </div>

//           <button className="ml-auto flex items-center gap-2 rounded-full bg-[#142B1D] py-2.5 pl-3.5 pr-5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5">
//             <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
//                 <path d="M12 5v14M5 12h14" />
//               </svg>
//             </span>
//             Add New Task
//           </button>
//         </div>

//         {/* stat row: 2x2 grid + weather */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.5fr_1fr]">
//           <div className="grid grid-cols-2 gap-4">
//             <StatCard label="Total Plots" value="12" unit="Plots" color="red" />
//             <StatCard label="Total Crop" value="6" unit="Types" color="yellow" />
//             <StatCard label="Total Area" value="2.3" unit="Hectares" color="yellow" />
//             <StatCard label="Total Plants" value="4k" unit="Plants"  color="yellow"/>
//           </div>

//           <div className="rounded-2xl border border-black/[0.04]
//            bg-white p-5  shadow-sm shadow-black/12">
//             <div className="flex items-center justify-between">
//               <span className="text-[13px] font-medium text-[#142B1D]/55">Weather</span>
//             </div>

//             <div className="mt-3 space-y-2 text-[13px] text-[#142B1D]/65">
//               <div className="flex items-center gap-2">
//                 <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#142B1D]/40">
//                   <path d="M6 16a4 4 0 010-8 5 5 0 019.6-1.5A4.5 4.5 0 0119 16H6z" />
//                 </svg>
//                 Cloudy
//               </div>
//               <div className="flex items-center gap-2">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-[#142B1D]/40">
//                   <path d="M3 8h11a3 3 0 100-3M3 16h14a3 3 0 110 3M3 12h9" />
//                 </svg>
//                 Wind
//               </div>
//               <div className="flex items-center gap-2">
//                 <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#142B1D]/40">
//                   <path d="M12 2s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z" />
//                 </svg>
//                 62%
//               </div>
//             </div>

//             <div className="mt-5 text-center text-5xl font-bold text-[#142B1D]">30°</div>

//             <div className="mt-5">
//               <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EDF3E8]">
//                 <div className="flex h-full w-full">
//                   <div className="h-full w-1/2 bg-gradient-to-r from-[#B7DD8F] to-[#D8DE6F]" />
//                   <div className="h-full w-1/2 bg-gradient-to-r from-[#E8C267] to-[#E08A4E]" />
//                 </div>
//               </div>
//               <div className="mt-2 flex justify-between text-[11px] text-[#142B1D]/45">
//                 <span>27°</span>
//                 <span>28°</span>
//                 <span>30°</span>
//                 <span>31°</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* soil health + farm performance */}
//         <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div className="rounded-2xl border border-black/[0.04] bg-gradient-to-b from-[#6FA35A] to-[#3F7A3E] p-5 text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
//             <div className="flex items-center justify-between">
//               <span className="text-[13px] font-medium text-white/80">Soil Health</span>
//               <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white/60">
//                 <circle cx="5" cy="12" r="1.6" />
//                 <circle cx="12" cy="12" r="1.6" />
//                 <circle cx="19" cy="12" r="1.6" />
//               </svg>
//             </div>

//             <div className="mt-6 space-y-6">
//               {[
//                 { label: "N Level", value: "23 ppm", percent: 78 },
//                 { label: "P Level", value: "9 ppm", percent: 22 },
//                 { label: "K Level", value: "19 ppm", percent: 58 },
//               ].map((row) => (
//                 <div key={row.label}>
//                   <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
//                     <div
//                       className="h-full rounded-full bg-white"
//                       style={{ width: `${row.percent}%` }}
//                     />
//                   </div>
//                   <div className="mt-2 flex items-center justify-between text-[13px]">
//                     <span className="text-white/75">{row.label}</span>
//                     <span className="font-semibold">{row.value}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-2xl border border-black/[0.04] bg-white p-5 
//           shadow-sm shadow-black/12">
//             <div className="flex items-center justify-between">
//               <span className="text-[13px] font-medium text-[#142B1D]/55">Farm Performance</span>
//               <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#142B1D]/40">
//                 <circle cx="5" cy="12" r="1.6" />
//                 <circle cx="12" cy="12" r="1.6" />
//                 <circle cx="19" cy="12" r="1.6" />
//               </svg>
//             </div>

//             <RadialGauge />

//             <div className="mt-4 flex items-center justify-center gap-5 text-[11px] text-[#142B1D]/60">
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2 w-2 rounded-full bg-[#CFE8B0]" /> Utilization
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2 w-2 rounded-full bg-[#8FBF6B]" /> Health
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2 w-2 rounded-full bg-[#2F5D3A]" /> On Track
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* task thumbnails */}
//         <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <TaskCard status="Complete" title="Irrigation System Maintenance" imgHint="sprinkler photo" />
//           <TaskCard status="Progress" title="Soil Nutrient Testing" imgHint="soil photo" />
//           <TaskCard status="Waiting" title="Harvesting Tomatoes" imgHint="harvest photo" />
//         </div>
//       </div>

     
//       <div className="relative hidden lg:block">

         
//          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6z7fqbRAmVOo0WFJP73Eiekx3fFS-ik7C2UuU3UprLA&s=10" className="absolute inset-0 h-full w-full object-cover" /> 
         
      

//         <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-2 text-[12px] font-medium text-white backdrop-blur-md">
//           Map
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
//             <path d="M6 9l6 6 6-6" />
//           </svg>
//         </div>

//         <button
//           aria-label="Fullscreen"
//           className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/55"
//         >
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
//             <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
//           </svg>
//         </button>

//         <MapPin color="#E5583B" className="right-[22%] top-[16%]" />
//         <MapChip className="right-[8%] top-[20%]">2 plots need attention</MapChip>

//         <MapPin color="#F2C94C" className="left-[16%] top-[42%]" />
//         <MapChip className="left-[6%] top-[47%]">Moisture: 68%</MapChip>

//         <MapPin color="#7BC96F" className="left-[24%] bottom-[16%]" />
//         <MapChip className="left-[24%] bottom-[10%]">Healthy: 92%</MapChip>

//         {/* zoom controls */}
//         <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2">
//           <button
//             aria-label="Recenter"
//             className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/55"
//           >
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
//               <circle cx="12" cy="12" r="3" />
//               <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
//             </svg>
//           </button>
//           <div className="flex flex-col overflow-hidden rounded-full bg-black/40 backdrop-blur-md">
//             <button
//               aria-label="Zoom in"
//               className="flex h-9 w-9 items-center justify-center text-white hover:bg-white/10"
//             >
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
//                 <path d="M12 5v14M5 12h14" />
//               </svg>
//             </button>
//             <div className="h-px w-5 self-center bg-white/25" />
//             <button
//               aria-label="Zoom out"
//               className="flex h-9 w-9 items-center justify-center text-white hover:bg-white/10"
//             >
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
//                 <path d="M5 12h14" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* mini-map thumbnail */}
//         <div className="absolute bottom-4 left-4 h-20 w-20 overflow-hidden rounded-xl border-2 border-white/70 shadow-lg">
//           <div className="flex h-full w-full items-center justify-center bg-[#4C7A3D] text-[9px] text-white/70">
//             mini map
//           </div>
//           <button
//             aria-label="Refresh map"
//             className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
//           >
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
//               <path d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-5M20 15a8 8 0 01-14 5" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { TaskCard } from "@/components/farmer/TaskCard";
import { StatCard } from "./orders/StatCard";
import { getMyFarm } from "@/lib/api/farmReg";
import RadialGauge from "@/components/farmer/RadialGauge";
import MapPin from "@/components/farmer/MapPin";
import MapChip from "@/components/farmer/MapChip";
import { FarmProfileCard } from "@/components/farmer/FarmProfileCard";
import NoFarm from "@/components/farmer/NoFarm";


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
      className={`${poppins.variable} grid h-screen grid-cols-1 
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
      
      <div className=" relative  hidden lg:block">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6z7fqbRAmVOo0WFJP73Eiekx3fFS-ik7C2UuU3UprLA&s=10"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-2 text-[12px] font-medium text-white backdrop-blur-md">
          Map
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3 w-3"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        <button
          aria-label="Fullscreen"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/55"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
          </svg>
        </button>

        <MapPin color="#E5583B" className="right-[22%] top-[16%]" />
        <MapChip className="right-[8%] top-[20%]">
          2 plots need attention
        </MapChip>

        <MapPin color="#F2C94C" className="left-[16%] top-[42%]" />
        <MapChip className="left-[6%] top-[47%]">Moisture: 68%</MapChip>

        <MapPin color="#7BC96F" className="left-[24%] bottom-[16%]" />
        <MapChip className="left-[24%] bottom-[10%]">Healthy: 92%</MapChip>

        {/* zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col items-center gap-2">
          <button
            aria-label="Recenter"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/55"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </button>
          <div className="flex flex-col overflow-hidden rounded-full bg-black/40 backdrop-blur-md">
            <button
              aria-label="Zoom in"
              className="flex h-9 w-9 items-center justify-center text-white hover:bg-white/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <div className="h-px w-5 self-center bg-white/25" />
            <button
              aria-label="Zoom out"
              className="flex h-9 w-9 items-center justify-center text-white hover:bg-white/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>
        </div>

        
        <div className="absolute bottom-4 left-4 h-20 w-20 overflow-hidden rounded-xl border-2 border-white/70 shadow-lg">
          <div className="flex h-full w-full items-center justify-center bg-[#4C7A3D] text-[9px] text-white/70">
            mini map
          </div>
          <button
            aria-label="Refresh map"
            className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-3 w-3"
            >
              <path d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-5M20 15a8 8 0 01-14 5" />
            </svg>
          </button>
        </div>
        </div>
     
    </div>
  );
}
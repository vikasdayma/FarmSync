// "use client";

// import { Poppins } from "next/font/google";
// import { useRouter } from "next/navigation";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   variable: "--font-display",
// });

// export default function HeroSection() {
//   return (
//     <section
//       className={`${poppins.variable} relative w-full overflow-hidden font[family-name:var(--font-display)]`}
      
//     >
    
//       <img src="/hero5.png"  alt=""  className=" h-screen w-full "  />

//       {/* ================= TOP NAV ================= */}
//       <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
//         {/* logo mark */}
//         <svg viewBox="0 0 32 32" className="h-7 w-7 text-[#0F3D2E]" fill="currentColor">
//           <path d="M16 2 A14 14 0 0 1 16 30 Z" />
//           <circle cx="16" cy="16" r="1.6" fill="#EAF3E4" />
//         </svg>

//         {/* hamburger */}
//         <button aria-label="Open menu" className="flex flex-col gap-[5px]">
//           <span className="block h-[3px] w-7 rounded-full bg-[#0F3D2E]" />
//           <span className="block h-[3px] w-7 rounded-full bg-[#0F3D2E]" />
//         </button>
//       </div>
// <div className="absolute top-1/5 left-10  h-1/2 w-1/2 
// bg-white/[0.2]  blur-2xl " />
//       {/* ================= HEADLINE + COPY ================= */}
//       <div className="absolute  top-1/5 left-10 ">
//         <h1 className=" font-extrabold leading-[1.05] tracking-tight text-[#0F3D2E] text-9xl">
//           Intelligent
//           <br />
//           Farming
//         </h1>
//         <p className="mt-5 max-w-[360px] text-2xl leading-relaxed text-[#0F3D2E]/85 ">
//           Our solutions empowers agricultural operators, reduces operation
//           costs, improves crop quality, and increases yield rate.
//         </p>
//       </div>

//       {/* ================= BOTTOM-LEFT BADGE CARD ================= */}
//       <div className="absolute bottom-3 w-40 left-6 z-10 verflow-hidden rounded-2xl border border-white/[0.02] bg-white/1 backdrop-blur-sm ">
//         <div className="flex items-center justify-center
//          h-[130px]">
//           {/* drone / product icon placeholder — swap for your own icon or image */}
//           <svg viewBox="0 0 64 64" className="h-20 w-20 text-[#EAF3E4]/90" fill="none" stroke="currentColor" strokeWidth={2}>
//             <circle cx="16" cy="16" r="7" />
//             <circle cx="48" cy="16" r="7" />
//             <circle cx="16" cy="48" r="7" />
//             <circle cx="48" cy="48" r="7" />
//             <rect x="26" y="26" width="12" height="12" rx="2" />
//             <path d="M22 22l-3-3M42 22l3-3M22 42l-3 3M42 42l3 3" />
//           </svg>
//         </div>
//         <div className="border-t border-white/15 px-4 py-2.5">
//           <span className="text-[13px] font-semibold tracking-wide text-[#C9E86B]">
//             GLP09
//           </span>
//         </div>
      
//       </div>
//     </section>
//  
//  );
// }
"use client";

import Navbar from "@/components/Navbar";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      className={`${poppins.variable} relative h-screen w-full overflow-hidden font-(family-name:--font-display)`}
    >

      <Navbar/>
      <Image
        src="/hero5.png"
        alt="Aerial view of farmland at golden hour"
        fill
        priority
        className="object-cover"
      />
     
      
      <div className="absolute inset-0 bg-linear-to-t from-[#0F3D2E]/20 via-[#0F3D2E]/30 to-[#092d21]" />

     
      {/* <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className="h-7 w-7 text-[#EAF3E4]" fill="currentColor">
            <path d="M16 2 A14 14 0 0 1 16 30 Z" />
            <circle cx="16" cy="16" r="1.6" fill="#0F3D2E" />
          </svg>
          <span className="text-sm font-semibold tracking-wide text-[#EAF3E4]">
            GLP09
          </span>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-[5px] rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <span
            className={`block h-[2px] w-5 rounded-full bg-[#EAF3E4] transition-transform ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-[#EAF3E4] transition-transform ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div> */}

      
      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6 sm:px-10 lg:px-20">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full border border-[#EAF3E4]/30 bg-[#EAF3E4]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#EAF3E4] backdrop-blur-sm">
            Smart Agriculture Platform
          </span>

          <h1 className="mt-6 text-6xl font-extrabold leading-[1.02] tracking-tight text-[#EAF3E4] sm:text-7xl lg:text-8xl">
            Intelligent
            <br />
            Farming
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#ffffff] sm:text-xl">
            Our solutions empower agricultural operators, reduce operating
            costs, improve crop quality, and increase yield rate.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-[#EAF3E4] px-7 py-3.5 text-sm font-semibold text-[#0F3D2E] transition-transform hover:-translate-y-0.5 hover:shadow-lg">
              Get started
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#EAF3E4]/40 px-7 py-3.5 text-sm font-semibold text-[#EAF3E4] backdrop-blur-sm transition-colors hover:bg-white/10">
              Watch demo
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM STATS BAR ================= */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-6 px-6 pb-8 sm:px-10 lg:px-20">
        <div className="flex gap-8">
          <div>
            <p className="text-3xl font-bold text-[#EAF3E4]">2.4k+</p>
            <p className="text-xs uppercase tracking-wide text-[#EAF3E4]/60">
              Fields monitored
            </p>
          </div>
          <div className="hidden sm:block">
            <p className="text-3xl font-bold text-[#EAF3E4]">98%</p>
            <p className="text-xs uppercase tracking-wide text-[#EAF3E4]/60">
              Yield accuracy
            </p>
          </div>
        </div>

        {/* drone / product badge card */}
        {/* <div className="w-40 overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
          <div className="flex h-[110px] items-center justify-center">
            <svg viewBox="0 0 64 64" className="h-16 w-16 text-[#C9E86B]" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="16" cy="16" r="7" />
              <circle cx="48" cy="16" r="7" />
              <circle cx="16" cy="48" r="7" />
              <circle cx="48" cy="48" r="7" />
              <rect x="26" y="26" width="12" height="12" rx="2" />
              <path d="M22 22l-3-3M42 22l3-3M22 42l-3 3M42 42l3 3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="border-t border-white/15 px-4 py-2.5">
            <span className="text-[13px] font-semibold tracking-wide text-[#C9E86B]">
              Live drone feed
            </span>
          </div>
        </div> */}
      </div>
    </section>
  );
}
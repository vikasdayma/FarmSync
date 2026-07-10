
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

     
      
      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6 sm:px-10 lg:px-20">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full border border-[#EAF3E4]/30 bg-[#EAF3E4]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#EAF3E4] backdrop-blur-sm">
            Smart Agriculture Platform
          </span>

          <h1 className="mt-6 text-[54px] font-extrabold leading-[1.02] tracking-tight text-[#EAF3E4] sm:text-7xl lg:text-8xl">
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

    
      </div>
    </section>
  );
}
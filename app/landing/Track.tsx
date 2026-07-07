"use client";

import Image from "next/image";
import { poppins } from "./HeroSection";

const Track = () => {
  return (
    <section
      className={`${poppins.variable} relative overflow-hidden bg-[#0c3d2d] px-6 py-24 font-[family-name:var(--font-display)] sm:px-10 lg:px-20`}
    >
      {/* decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#C9E86B]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* ================= HEADER ================= */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-[#C9E86B]/30 bg-[#C9E86B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#C9E86B]">
            Real-time visibility
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-[#EAF3E4] sm:text-6xl lg:text-7xl">
            Track Your Farm
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#EAF3E4]/70">
            Every plot, sensor, and crop cycle in a single live map — see
            exactly what&apos;s happening across your land, right now.
          </p>
        </div>

        {/* ================= IMAGE ================= */}
        <div className="relative mt-16 flex justify-center w-full  ">
          <div className="pointer-events-none absolute inset-0 scale-95 rounded-[2.5rem] bg-[#C9E86B]/20 blur-3xl" />
          <div className="relative w-full
          max-w-5xl   overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm sm:p-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
              <Image
                src="/trackfarm.png"
                alt="Live farm tracking dashboard showing field data"
                width={800}
                height={400}
                className=" w-full  object-contain"
                priority
              />
            </div>
          </div>

          {/* floating stat chips */}
          <div className="absolute -left-4 top-10 hidden rounded-2xl border border-white/10 bg-[#12452F]/90 px-5 py-3 shadow-xl backdrop-blur-md sm:block lg:-left-10">
            <p className="text-2xl font-bold text-[#EAF3E4]">24/7</p>
            <p className="text-xs uppercase tracking-wide text-[#EAF3E4]/60">
              Live monitoring
            </p>
          </div>

          <div className="absolute -right-4 bottom-10 hidden rounded-2xl border border-white/10 bg-[#12452F]/90 px-5 py-3 shadow-xl backdrop-blur-md sm:block lg:-right-10">
            <p className="text-2xl font-bold text-[#EAF3E4]">2.4k+</p>
            <p className="text-xs uppercase tracking-wide text-[#EAF3E4]/60">
              Plots tracked
            </p>
          </div>
        </div>

        {/* ================= SUPPORTING FEATURES ================= */}
        {/* <div className="mt-20 grid grid-cols-1 gap-6 border-t border-white/10 pt-12 sm:grid-cols-3">
          {[
            {
              title: "Live field map",
              copy: "Every sensor and plot boundary rendered on one interactive map.",
            },
            {
              title: "Instant alerts",
              copy: "Get notified the moment moisture, temperature, or pests cross a threshold.",
            },
            {
              title: "Historical playback",
              copy: "Scrub back through past seasons to compare trends year over year.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-base font-semibold text-[#EAF3E4]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#EAF3E4]/60">
                {item.copy}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default Track;
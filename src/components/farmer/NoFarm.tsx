"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sprout, CloudSun, Landmark } from "lucide-react";

const BENEFITS = [
  {
    icon: Sprout,
    title: "Track every crop",
    description: "Log stages, yields, and field notes as they happen.",
  },
  {
    icon: CloudSun,
    title: "Get soil & weather reports",
    description: "Localized readings so you know what to plant, and when.",
  },
  {
    icon: Landmark,
    title: "Unlock loans & agronomists",
    description: "Apply for credit and reach experts once your farm is verified.",
  },
];

export default function NoFarmState() {
  const router = useRouter();

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 sm:px-16 xl:px-4 py-12"
      style={{
        backgroundImage: "url(/no-farm.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/20 bg-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:flex-row">
        {/* inner top highlight, sells the "glass edge" */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px] bg-linear-to-r from-transparent via-white/50 to-transparent" />

        {/* LEFT — pitch, benefits, CTA */}
        <div className="flex flex-1 flex-col items-start px-8 py-12 sm:px-10">
          <span className="mb-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D4F26A]/90">
            One step left
          </span>

          <h1
            className="mb-4 text-[28px] font-semibold leading-tight text-white sm:text-[32px]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Register your farm to get started
          </h1>

          <p className="mb-8 max-w-[360px] text-[15px] leading-relaxed text-white/70">
            Takes about 3 minutes, no documents needed yet. Here&apos;s what unlocks the moment you do.
          </p>

          <div className="mb-10 flex w-full max-w-[360px] flex-col gap-5">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/20">
                  <Icon size={18} className="text-[#D4F26A]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-white">{title}</h3>
                  <p className="text-[13px] leading-relaxed text-white/55">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/dashboard/farm-registration")}
            className="group relative w-full max-w-xs overflow-hidden rounded-xl bg-[#D4F26A] px-6 py-3.5 font-medium text-[#12331F] shadow-[0_4px_24px_rgba(212,242,106,0.35)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(212,242,106,0.5)] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Register Your Farm
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>

       
        <div className="flex flex-1 flex-col items-center justify-evenly border-t border-white/10 bg-black/10 px-8 py-12 text-center lg:border-l lg:border-t-0 gap-1">
          <div className="relative mb-7 flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
            <span className="absolute inset-0 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-[#D4F26A]/25 blur-xl" />
            <Image
              src="/avatars/farmer1.png"
              alt="Farm illustration"
              height={320}
              width={320}
              className="relative z-10 drop-shadow-[0_8px_24px_rgba(212,242,106,0.25)]"
            />
          </div>

          <span className="mb-2 text-16 font-semibold uppercase tracking-[0.2em] text-[#D4F26A]/90 mt-6">
            Your land is waiting
          </span>
          <p className="max-w-[260px] text-[14px]  leading-relaxed text-white/60">
            Every field, report, and record starts here.
          </p>
        </div>
      </div>
    </div>
  );
}
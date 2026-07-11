"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NoFarmState() {
  const router = useRouter();

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url(https://plus.unsplash.com/premium_photo-1661962956105-99c296f1259f)",
      }}
    >
      {/* Darkening + brand-tinted overlay so the glass card stays legible */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-[#0F2318]/10 via-[#12331F]/20 to-[#0A1D13]/15" />

     */}

<Image className="absolute left-0" height={400} width={400} src="/avatars/farmer1.png" alt="" />



      <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-[28px] border border-white/20 bg-white/10 px-8 py-12 text-center shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        {/* inner top highlight, sells the "glass edge" */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px] bg-linear-to-r from-transparent via-white/50 to-transparent" />

        {/* Icon with breathing glow */}
        <div className="relative mb-7 flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-[#D4F26A]/25 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black shadow-[0_4px_24px_rgba(212,242,106,0.15)] backdrop-blur-md">
         <p className="text-4xl">🌾</p> 
          </div>
        </div>

        <span className="mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#D4F26A]/90">
          One step left
        </span>

        <h1
          className="mb-3 text-[28px] font-semibold leading-tight text-white"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Your land is waiting
        </h1>

        <p className="mb-8 max-w-[280px] text-[16px] leading-relaxed text-white/80">
          Register your farm to unlock crop tracking, soil reports, and
          everything else built for it.
        </p>

        <button
          onClick={() => router.push("/dashboard/farm-registration")}
          className="group relative w-full overflow-hidden rounded-xl bg-[#D4F26A] px-6 py-3.5 font-medium text-[#12331F] shadow-[0_4px_24px_rgba(212,242,106,0.35)] transition-all duration-200 hover:shadow-[0_6px_28px_rgba(212,242,106,0.5)] active:scale-[0.98]"
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

        <p className="mt-5 text-[14px] text-white/40">
          Takes about 3 minutes · No documents needed yet
        </p>
      </div>
       <DroneIllustration className='absolute  right-0
        top-0 max-w-md'/>
    </div>
  );
}



interface Props{
    className:string
 
}
export  function DroneIllustration(props:Props) {
  return (
    <div className={` ${props.className} flex min-h-[200px] w-full items-center justify-center  p-10`}>
      <div className="animate-[float_4s_ease-in-out_infinite]">
        <svg
          width="180"
          height="180"
          viewBox="0 0 280 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft ground shadow */}
          <ellipse
            cx="140"
            cy="235"
            rx="70"
            ry="10"
            fill="black"
            opacity="0.25"
          />

          {/* Arms — connect body to each propeller */}
          <g stroke="#3F7A3E" strokeWidth="6" strokeLinecap="round">
            <line x1="140" y1="140" x2="55" y2="55" />
            <line x1="140" y1="140" x2="225" y2="55" />
            <line x1="140" y1="140" x2="55" y2="225" />
            <line x1="140" y1="140" x2="225" y2="225" />
          </g>

          {/* Arm joints */}
          <circle cx="140" cy="140" r="6" fill="#2A5A32" />

          {/* Propeller motor mounts */}
          {[
            [55, 55],
            [225, 55],
            [55, 225],
            [225, 225],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="10"
              fill="#12331F"
              stroke="#3F7A3E"
              strokeWidth="3"
            />
          ))}

          {/* Spinning propellers */}
          {[
            [55, 55],
            [225, 55],
            [55, 225],
            [225, 225],
          ].map(([cx, cy], i) => (
            <g
              key={i}
              className="origin-center animate-[spin_0.6s_linear_infinite]"
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              <ellipse
                cx={cx}
                cy={cy}
                rx="30"
                ry="6"
                fill="#D4F26A"
                opacity="0.55"
              />
              <ellipse
                cx={cx}
                cy={cy}
                rx="6"
                ry="30"
                fill="#D4F26A"
                opacity="0.55"
              />
            </g>
          ))}

          {/* Body — main chassis */}
          <rect
            x="105"
            y="105"
            width="70"
            height="70"
            rx="18"
            fill="#12331F"
            stroke="#3F7A3E"
            strokeWidth="3"
          />

          {/* Body panel highlight */}
          <rect
            x="115"
            y="115"
            width="50"
            height="50"
            rx="12"
            fill="url(#bodyGradient)"
          />

          {/* Camera / sensor gimbal underneath */}
          <circle
            cx="140"
            cy="140"
            r="12"
            fill="#0A1D13"
            stroke="#D4F26A"
            strokeWidth="2"
          />
          <circle cx="140" cy="140" r="5" fill="#D4F26A" opacity="0.9" />

          {/* Status LEDs — front (lime, blinking) */}
          <circle
            cx="122"
            cy="120"
            r="3.5"
            fill="#D4F26A"
            className="animate-[pulse_1.4s_ease-in-out_infinite]"
          />
          <circle
            cx="158"
            cy="120"
            r="3.5"
            fill="#D4F26A"
            className="animate-[pulse_1.4s_ease-in-out_infinite]"
          />

          {/* Rear LED — steady red for orientation */}
          <circle cx="140" cy="160" r="3" fill="#E08A4E" />

          <defs>
            <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1C4A2A" />
              <stop offset="100%" stopColor="#0F2318" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-14px);
          }
        }
      `}</style>
    </div>
  );
}
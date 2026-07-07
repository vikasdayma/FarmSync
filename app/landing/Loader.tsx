"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import corn from '../../public/leaves.json'
export default function Loader({ className }: { className?: string }) {
  // const [animationData, setAnimationData] = useState(null);

  // useEffect(() => {
  //   fetch("../public/a.json")
  //     .then((res) => res.json())
  //     .then(setAnimationData);
  // }, []);

  // if (!animationData) return null;
  type LottieRefCurrentProps={
    speed:number
  }
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    // 0.5 = Half speed
    // 1 = Normal speed
    // 2 = Double speed
    // 3 = Triple speed
    lottieRef.current?.setSpeed(12);
    }, []);
  return (
    <div className={`fixed  inset-0 flex ${className} h-full w-full`} >
    
      <Lottie animationData={corn} loop style={{ width: 450, height: 450 }} />
    </div>

  );
}

// "use client";

// import Lottie, { LottieRefCurrentProps } from "lottie-react";
// import a from "../../public/a.json";
// import { useEffect, useRef } from "react";

// export default function Runner() {
//   const lottieRef = useRef<LottieRefCurrentProps>(null);

//   useEffect(() => {
   
     
//     lottieRef.current?.setSpeed(4);
//   }, []);

//   return (
//     <Lottie
//       lottieRef={lottieRef}
//       animationData={a}
//       loop
//       autoplay
//     height={20}
    
//     />
//   );
// }


// "use client";

// import Lottie, { LottieRefCurrentProps } from "lottie-react";
// import a from "../../public/a.json";
// import { useEffect, useRef } from "react";
// import { poppins } from "./HeroSection";

// export default function Runner() {
//   const lottieRef = useRef<LottieRefCurrentProps>(null);

//   useEffect(() => {
//     lottieRef.current?.setSpeed(4);
//   }, []);

//   return (
//     <section
//       className={`${poppins.variable} relative overflow-hidden  px-10 py-24 font-[family-name:var(--font-display)] `}
//     >
//       <div className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#C9E86B]/20 blur-[110px]" />

//       <div className="relative mx-auto grid max-w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
//         {/* ================= LEFT: TEXT ================= */}
//         <div>
//           <span className="inline-block rounded-full border border-[#0F3D2E]/20 bg-[#0F3D2E]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0F3D2E]">
//             Built for growers
//           </span>

//           <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0F3D2E] sm:text-5xl">
//             Farming, guided by
//             <br />
//             real-time intelligence.
//           </h2>

//           <p className="mt-5 max-w-md text-lg leading-relaxed text-[#0F3D2E]/70">
//             From soil to sale, our platform connects every layer of your
//             operation — sensors in the field, forecasts in the sky, and
//             buyers in the marketplace — so every decision is backed by
//             live data, not guesswork.
//           </p>

//           <ul className="mt-8 space-y-3">
//             {[
//               "Instant alerts before problems spread",
//               "One dashboard for every plot you manage",
//               "Sell directly, without losing margin to middlemen",
//             ].map((point) => (
//               <li key={point} className="flex items-start gap-3">
//                 <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F3D2E]">
//                   <svg viewBox="0 0 24 24" className="h-3 w-3 text-[#EAF3E4]" fill="none" stroke="currentColor" strokeWidth={3}>
//                     <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                 </span>
//                 <span className="text-sm text-[#0F3D2E]/80">{point}</span>
//               </li>
//             ))}
//           </ul>

//           <button className="mt-9 rounded-full bg-[#0F3D2E] px-7 py-3.5 text-sm font-semibold text-[#EAF3E4] transition-transform hover:-translate-y-0.5 hover:shadow-lg">
//             Explore the platform
//           </button>
//         </div>

//         {/* ================= RIGHT: LOTTIE ================= */}
//         <div className="flex items-center justify-center">
//           <div className="w-full max-w-2xl">
//             <Lottie
//               lottieRef={lottieRef}
//               animationData={a}
//               loop
//               autoplay
//               style={{ width: "100%", }}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
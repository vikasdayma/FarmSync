"use client";

import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const features = [
  {
    title: "Soil monitoring",
    copy: "Live moisture, pH, and nutrient readings from sensors placed across every plot you manage.",
    image:"https://images.unsplash.com/photo-1559660499-41de8b38a6b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNvaWwlMjB0ZXN0b25tZ3xlbnwwfHwwfHx8MA%3D%3D",
    alt: "Farmer kneeling in a field, checking soil with a handheld sensor",
  },
  {
    title: "Weather intelligence",
    copy: "7-day forecasts layered onto your field map, with frost and heat-stress alerts before they hit.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
    alt: "Farmer standing in a field looking up at a cloudy sky",
  },
  {
    title: "Drone mapping",
    copy: "Automated flyovers turn into NDVI plot maps, flagging stressed crop zones within hours.",
    image:
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
    alt: "Person piloting an agricultural drone over crop rows",
  },
  {
    title: "Yield prediction",
    copy: "Historical harvest data plus this season's readings, forecasting output before you cut.",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1470&auto=format&fit=crop",
    alt: "Farmer examining and harvesting crops by hand at sunset",
  },
];

export function FeaturesSection() {
  return (
    <section
    id="features"
      className={`${poppins.variable} bg-no-repeat bg-cover  px-6 py-24 font-[family-name:var(--font-display)] 
        bg-white/30 sm:px-10 lg:px-20`

      }
    
    >
      <div className="absolute inset-0  "></div>
      <div className="mx-auto max-w-full">
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B8511A]">
            Platform
          </span>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-[#12331F] sm:text-5xl">
            Everything your fields need, in one view.
          </h2>
        </div>

        <div className="mt-14 flex flex-wrap flex-row justify-evenly items-center ">
          {features.map((f) => (
            <div
              key={f.title}
              className="animate-fade-up mt-4   group overflow-hidden rounded-3xl border border-[#12331F]/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg w-80 h-full"
            >
              <div className="relative h-60   overflow-hidden">
                <Image
                  src={f.image}
                  alt={f.alt}
                  fill
                  
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12331F]/50 via-transparent to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#12331F]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#12331F]/70">
                  {f.copy}
                </p>
              </div>

              <div className="h-1 w-0 bg-[#B8511A] transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .animate-fade-up {
            animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturesSection;
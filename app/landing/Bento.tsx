"use client";

import Image from "next/image";
import { Poppins, Caveat } from "next/font/google";
import {motion, useTransform} from 'framer-motion'
import { useScroll } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-script",
});

function LeafIcon({
  className = "h-3.5 w-3.5",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill="currentColor"
    >
      <path d="M12 3c-4 3-6 6-6 9a6 6 0 0012 0c0-3-2-6-6-9z" />
    </svg>
  );
}

interface Product {
  name: string;
  seller: string;
  price: string;
  tag: string;
  image: string;
}

const leftProducts: Product[] = [
  {
    name: "Organic Tomatoes",
    seller: "Rane Family Farm",
    price: "₹42/kg",
    tag: "Fresh today",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Sweet Corn",
    seller: "Deshmukh Fields",
    price: "₹28/kg",
    tag: "Harvested Mon",
    image:
      "https://images.unsplash.com/photo-1676993842552-c0bb1c2ab2cc?w=600&auto=format&fit=crop",
  },
  {
    name: "Fresh Onions",
    seller: "Nair Agro Farms",
    price: "₹22/kg",
    tag: "Bulk available",
    image:
      "https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=200&auto=format&fit=crop",
  },
];

const rightProducts: Product[] = [
  {
    name: "Basmati Rice",
    seller: "Patel Agro Co.",
    price: "₹78/kg",
    tag: "Bulk available",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Alphonso Mangoes",
    seller: "Konkan Orchards",
    price: "₹120/dz",
    tag: "Limited season",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Wheat Grain",
    seller: "Sharma Bros.",
    price: "₹32/kg",
    tag: "Top rated",
    image:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=200&auto=format&fit=crop",
  },
];

function ProductPill({
  product,
  animation,
  tilt,
  accent,
}: {
  product: Product;
  animation: "animate-float" | "animate-float-slow";
  tilt: string;
  accent: string;
}) {
  return (
    <div className={`${animation} ${tilt} group relative w-56`}>
      <div className="relative flex items-center gap-3 rounded-full border border-black/5 bg-white py-2 pl-2 pr-4 shadow-xl shadow-black/15 transition-transform duration-300 group-hover:-translate-y-1">
        {/* circular thumbnail */}
        <div
          className="relative h-14 w-14 shrink-0 overflow-hidde rounded-full border-2"
          style={{ borderColor: accent }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-full"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <LeafIcon className="h-3 w-3 shrink-0" style={{ color: accent }} />
            <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-[#0F3D2E]/50">
              {product.tag}
            </span>
          </div>
          <p className="truncate text-sm font-bold text-[#0F3D2E]">
            {product.name}
          </p>
          <p className="truncate text-[11px] text-[#0F3D2E]/50">
            {product.seller}
          </p>
        </div>

        {/* price badge, notched onto the right edge */}
        <div
          className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border-2 border-white px-3 py-1.5 shadow-md"
          style={{ backgroundColor: accent }}
        >
          <p className="whitespace-nowrap text-xs font-black text-[#12331F]">
            {product.price}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FarmHeroPoster() {
    const targetRef = useRef(null);

 const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "start start"], 
    // "start end"  -> progress = 0 when TOP of target hits BOTTOM of viewport (element just entering)
    // "start start"-> progress = 1 when TOP of target hits TOP of viewport (element fully scrolled past its entry)
  });
  const filter = useTransform(scrollYProgress, [0, 0.6], ["-600px", "0px"])
  const router=useRouter();
  return (
    <section
      className={`${poppins.variable} ${caveat.variable} relative overflow-hidde bg-[#0F3D2E] px-6 py-12 font-[family-name:var(--font-display)] sm:px-10 `}
    ref={targetRef}
    >
      <div className="absolute inset-0">
        <Image src="/a2.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#0F3D2E]/20" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[240px_1fr_240px]">
        <div className="order-2 flex flex-row flex-wrap justify-center gap-6 lg:order-1 lg:flex-col lg:items-end">
          <ProductPill
            product={leftProducts[0]}
            animation="animate-float-slow"
            tilt="-rotate-2"
            accent="#C9E86B"
          />
          <ProductPill
            product={leftProducts[1]}
            animation="animate-float"
            tilt="rotate-1"
            accent="#E8A24B"
          />
          <ProductPill
            product={leftProducts[2]}
            animation="animate-float-slow"
            tilt="-rotate-1"
            accent="#7FB3D5"
          />
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-xl overflow-hidde rounded-[2.5rem] shadow-2xl">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=900&auto=format&fit=crop"
                alt=""
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#12331F]/95 via-[#12331F]/85 to-[#12331F]/95" />
            </div>
            <div className="h-full bg-[#12331F] blur-[32px]" />
            <div className="absolute left-1/2 top-[30%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,232,107,0.35)_0%,transparent_65%)]" />

            <LeafIcon className="absolute left-[12%] top-[46%] h-4 w-4 rotate-[-20deg] text-[#C9E86B]/70" />
            <LeafIcon className="absolute left-[16%] top-[58%] h-3 w-3 rotate-[15deg] text-[#C9E86B]/50" />
            <LeafIcon className="absolute right-[10%] top-[10%] h-4 w-4 rotate-[25deg] text-[#C9E86B]/60" />

            <div className="relative  flex flex-col items-center px-6 pb-8 pt-8">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#EAF3E4]/80">
                <LeafIcon className="h-3 w-3 text-[#C9E86B]" />
                Straight from the farm
              </div>

              <h1 className="mt-2 text-center text-6xl font-black leading-[0.95] tracking-tight text-[#EAF3E4] sm:text-7xl">
                GROWN
              </h1>

              <p
                className="-mt-2 text-5xl text-[#8FCB4F] sm:text-6xl"
                style={{ fontFamily: "var(--font-script)" }}
              >
                with care.
              </p>

              <div className="relative inset-0  -mt-6 flex justify-center">
                <motion.img
                  src="/aaa.png"
                  alt="Farmer holding a basket of fresh vegetables"
                  width={340}
                  height={420}
                  style={{y:filter}}
         
                  transition={{duration:1,repeat:0}}
                  className="h-[70vh]   w-auto object-contain z-30 drop-shadow-2xl"
                ></motion.img>

                <div className="absolute -right-2 top-[35%] flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-[#EAF3E4] bg-[#C9E86B] text-center shadow-lg sm:h-24 sm:w-24">
                  <span className="text-[13px] font-black leading-none text-[#12331F] sm:text-sm">
                    100%
                  </span>
                  <span className="text-[9px] font-bold uppercase leading-tight text-[#12331F] sm:text-[10px]">
                    Natural
                  </span>
                </div>
              </div>
              <button   onClick={()=>router.push('/login')} className="text-xl bg-amber-300 px-6 py-2 rounded-lg text-white">
                Explore Now
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PRODUCT PILLS ================= */}
        <div className="order-3 flex flex-row flex-wrap justify-center gap-6 lg:flex-col lg:items-start">
          <ProductPill
            product={rightProducts[0]}
            animation="animate-float"
            tilt="rotate-2"
            accent="#E8A24B"
          />
          <ProductPill
            product={rightProducts[1]}
            animation="animate-float-slow"
            tilt="-rotate-1"
            accent="#E8574A"
          />
          <ProductPill
            product={rightProducts[2]}
            animation="animate-float"
            tilt="rotate-1"
            accent="#C9E86B"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: floatSlow 5.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

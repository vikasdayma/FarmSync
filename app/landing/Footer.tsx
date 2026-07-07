"use client";

import Image from "next/image";
import { poppins } from "./HeroSection";

const footerLinks = {
  Platform: ["Soil monitoring", "Weather intelligence", "Drone mapping", "Yield prediction"],
  Marketplace: ["Browse produce", "List your harvest", "Buyer verification", "Pricing"],
  Company: ["About us", "Careers", "Blog", "Contact"],
  Resources: ["Help center", "API docs", "Community", "Partner with us"],
};

const socials = [
  {
    name: "Twitter",
    href: "#",
    icon: (
      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.9a4.1 4.1 0 001.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 01-1.9.1c.5 1.6 2.1 2.8 3.9 2.9A8.2 8.2 0 012 18.6a11.6 11.6 0 006.3 1.9c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" fill="none" />
        <circle cx="17.5" cy="6.5" r="1" />
      </>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="7.5" cy="7.5" r="1.2" fill="#0F3D2E" />
        <path d="M6.5 10.5v7M11 10.5v7M11 13.5c0-1.8 1.2-3 3-3s2.5 1.2 2.5 3v4" stroke="#0F3D2E" strokeWidth={1.4} fill="none" />
      </>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <>
        <rect x="2" y="5.5" width="20" height="13" rx="4" />
        <path d="M10 9.5l6 2.5-6 2.5z" fill="#0F3D2E" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      className={`${poppins.variable} relative overflow-hidden bg-[#0F3D2E] px-6 pt-20 font-[family-name:var(--font-display)] sm:px-10 lg:px-20`}
    >
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-[#C9E86B]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* ================= NEWSLETTER CTA ================= */}
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-[#EAF3E4] sm:text-3xl">
              Stay ahead of the season.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#EAF3E4]/60">
              Get product updates, farming tips, and marketplace drops in
              your inbox — no spam, unsubscribe anytime.
            </p>
          </div>

          <form className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-[#EAF3E4] placeholder:text-[#EAF3E4]/40 outline-none focus:border-[#C9E86B]/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#C9E86B] px-6 py-3 text-sm font-semibold text-[#0F3D2E] transition-transform hover:-translate-y-0.5"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* ================= LINK GRID ================= */}
        <div className="mt-16 grid grid-cols-2 gap-10 border-t border-white/10 pt-14 sm:grid-cols-4 lg:grid-cols-5">
          {/* brand column */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-7 w-7 text-[#EAF3E4]" fill="currentColor">
                <path d="M16 2 A14 14 0 0 1 16 30 Z" />
                <circle cx="16" cy="16" r="1.6" fill="#0F3D2E" />
              </svg>
              <span className="text-sm font-semibold tracking-wide text-[#EAF3E4]">
                GLP09
              </span>
            </div>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-[#EAF3E4]/50">
              Intelligent farming, from soil to sale — built for the growers
              feeding the next generation.
            </p>
          </div>

          {/* {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-[#EAF3E4]">{heading}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    
                      href="#"
                      className="text-sm text-[#EAF3E4]/50 transition-colors hover:text-[#C9E86B]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}
          {/* ))} */}
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 sm:flex-row">
          <p className="text-xs text-[#EAF3E4]/40">
            © {new Date().getFullYear()} GLP09. All rights reserved.
          </p>
{/* 
          <div className="flex gap-3">
            {socials.map((s) => (
              
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors hover:bg-[#C9E86B] hover:text-[#0F3D2E]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#EAF3E4] hover:fill-[#0F3D2E]" stroke="#EAF3E4" strokeWidth={0}>
                  {s.icon}
                </svg>
              </a>
            ))}
          </div> */}

          <div className="flex gap-6 text-xs text-[#EAF3E4]/40">
            <a href="#" className="hover:text-[#EAF3E4]">Privacy</a>
            <a href="#" className="hover:text-[#EAF3E4]">Terms</a>
            <a href="#" className="hover:text-[#EAF3E4]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
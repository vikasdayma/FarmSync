"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavbarDash";
import { LayoutDashboard } from "lucide-react";
import LogoutButton from "../LogoutButton";

const MOBILE_NAV_LINKS: NavLink[] = [
  { id: 0, label: "Dashboard", href: "/dashboard" },
  { id: 1, label: "My Store", href: "/dashboard/mystore" },
  { id: 1, label: "Farm", href: "/dashboard/my-farm" },
  { id: 3, label: "Orders", href: "/dashboard/orders" },
  { id: 4, label: "Alerts", href: "/dashboard/notification" },
  { id: 5, label: "Marketplace", href: "/marketplace" },
];

interface Props {
  menuOpen: boolean;
  setMenuOpen: (t: boolean) => void;
}

export default function MobileDashNav({ menuOpen, setMenuOpen }: Props) {
  const pathname = usePathname();

  if (!menuOpen) return null;

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Slide-in panel */}
      <nav className="fixed top-0 right-0 h-dvh w-[75%] max-w-[300px] bg-white z-50 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-900">Menu</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-gray-500 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col px-3 py-4 gap-1">
          {MOBILE_NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                  active
                    ? "bg-[#193819] text-white"
                    : "text-gray-700 hover:bg-gray-100 border"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-lg text-[15px] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Profile
          </Link>

                   <LogoutButton className="border-none flex justify-start"/>
        </div>
      </nav>
    </div>
  );
}

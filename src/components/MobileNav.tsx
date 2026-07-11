"use client";

import Link from "next/link";
import { FaCanadianMapleLeaf } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import LogoutButton from "./LogoutButton";

interface NavLink {
  id: number;
  label: string;
  href: string;
}

const MOBILE_NAV_LINKS: NavLink[] = [
  { id: 0, label: "Home", href: "/" },
  { id: 1, label: "Features", href: "/#features" },
  { id: 2, label: "Contact", href: "/#contact" },
  { id: 3, label: "Marketplace", href: "/marketplace" },
];

interface Props {
  menuOpen: boolean;
  setMenuOpen: (t: boolean) => void;
}

// Same role → label/href logic as desktop Navbar
const getDashboardLink = (role?: string) => {
  switch (role) {
    case "FARMER":
      return { label: "My Farm", href: "/dashboard" };
    case "SUPER_ADMIN":
      return { label: "MASTER DASHBOARD", href: "/dashboard" };
    case "SUPPLIER":
      return { label: "Dashboard", href: "/dashboard" };
    case "AGRONOMIST":
      return { label: " Dashboard", href: "/agronomist/dashboard" };
    default:
      return null;
  }
};

export default function MobileNav({ menuOpen, setMenuOpen }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  if (!menuOpen) return null;

  const dashboardLink = isLoggedIn ? getDashboardLink(user?.role) : null;

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
                key={link.id}
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

          {/* Role-based dashboard link — only when logged in */}
          {dashboardLink && (
            <Link
              href={dashboardLink.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-[15px] font-medium transition-colors flex items-center gap-2 ${
                pathname === dashboardLink.href
                  ? "bg-[#193819] text-white"
                  : "bg-yellow-200 text-gray-800 hover:bg-yellow-300"
              }`}
            >
              {dashboardLink.label}
              <FaCanadianMapleLeaf className="text-xl text-green-600" />
            </Link>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-[15px] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Profile
              </Link>
              <LogoutButton className="border-none flex justify-start" />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/login");
                }}
                className="px-4 py-3 rounded-lg text-[15px] font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors text-left"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/signup");
                }}
                className="px-4 py-3 rounded-lg text-[15px] font-medium bg-[#193819] text-white hover:bg-[#12331f] transition-colors text-left"
              >
                Register →
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
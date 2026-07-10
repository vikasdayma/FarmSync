"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import "./NavbarDash.css";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Features", href: "/features" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Contact", href: "/contact" },
];

export default function NavbarDash() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();
  const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || "";

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");

  const go = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-black/[0.06] bg-[#FBFBF8]/90 px-6 backdrop-blur-md">
        {/* Left: logo — also the mobile "back to dashboard home" escape hatch */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => go("/dashboard")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12331F] text-sm">
            🌾
          </div>
          <span className="hidden text-sm font-bold text-[#12331F] sm:block">
            FarmSync
          </span>
        </div>

        {/* Center: nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-[#12331F] text-white shadow-sm"
                  : "text-[#12331F]/60 hover:bg-[#12331F]/6 hover:text-[#12331F]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: avatar (desktop + mobile) + hamburger (mobile only) */}
        <div className="flex items-center gap-2">
          <div className="fs-right" style={{ position: "relative" }}>
            <div
              className="fs-avatar-wrap"
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="fs-avatar-img" />
              ) : (
                <div className="fs-avatar-letter">{firstLetter}</div>
              )}
              <span className="hidden sm:inline text-black">{user?.firstName}</span>
              <div className="fs-dot" />
            </div>

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  background: "#fff",
                  border: "1px solid #e8e4df",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  minWidth: "160px",
                  zIndex: 50,
                }}
              >
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/profile");
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#1a1a1a",
                  }}
                >
                  Profile
                </button>
                <div style={{ height: "1px", background: "#f0ece8" }} />
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    // apna logout logic yahan call karo
                    // handleLogout()
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.75rem 1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#dc2626",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className={`fsd-burger flex md:hidden ${menuOpen ? "fsd-burger-open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={` fsd-mobile-menu ${menuOpen ? "fsd-mobile-menu-open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.href}
            onClick={() => go(link.href)}
            className={isActive(link.href) ? "fsd-link-active" : ""}
          >
            {link.label}
          </button>
        ))}

        <div className="fsd-mobile-menu-divider" />

        <button onClick={() => go("/profile")}>Profile</button>
        <button
          className="fsd-logout"
          onClick={() => {
            setMenuOpen(false);
            // handleLogout()
          }}
        >
          Logout
        </button>
      </div>

      {menuOpen && (
        <div className="fsd-mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthProvider";
import '../Navbar.css'
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
  const {user,isLoading,isLoggedIn}=useAuth();
  const router =useRouter();
   const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || ""
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-black/[0.06] bg-[#FBFBF8]/90 px-6 backdrop-blur-md">
      {/* Left: logo mark (optional, remove if sidebar already has one) */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12331F] text-sm">
          🌾
        </div>
        <span className="hidden text-sm font-bold text-[#12331F] sm:block">
          FarmSync
        </span>
      </div>

      {/* Center: nav links */}
      <nav className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#12331F] text-white shadow-sm"
                  : "text-[#12331F]/60 hover:bg-[#12331F]/6 hover:text-[#12331F]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: profile */}
      {/* <div className="fs-right">
            
        

             
                <div className="fs-avatar-wrap"
                             onClick={() => router.push('/profile')}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="fs-avatar-img" />
                  ) : (
                    <div className="fs-avatar-letter">{firstLetter}</div>
                  )}
                  <span className=" text-black">{user?.firstName}</span>
                  <div className="fs-dot" />
                </div>
            
           
          </div> */}
<div className="fs-right" style={{ position: 'relative' }}>

  <div
    className="fs-avatar-wrap"
    onClick={() => setProfileOpen(prev => !prev)}
  >
    {user?.avatarUrl ? (
      <img src={user.avatarUrl} alt="avatar" className="fs-avatar-img" />
    ) : (
      <div className="fs-avatar-letter">{firstLetter}</div>
    )}
    <span className="text-black">{user?.firstName}</span>
    <div className="fs-dot" />
  </div>

  {profileOpen && (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '8px',
        background: '#fff',
        border: '1px solid #e8e4df',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        minWidth: '160px',
        zIndex: 50,
      }}
    >
      <button
        onClick={() => {
          setProfileOpen(false)
          router.push('/profile')
        }}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '0.75rem 1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          color: '#1a1a1a',
        }}
      >
        Profile
      </button>
      <div style={{ height: '1px', background: '#f0ece8' }} />
      <button
        onClick={() => {
          setProfileOpen(false)
          // apna logout logic yahan call karo
        //   handleLogout()
        }}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '0.75rem 1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          color: '#dc2626',
        }}
      >
        Logout
      </button>
    </div>
  )}

</div>
      {/* Mobile nav links (below md breakpoint) */}
      <nav className="absolute left-0 right-0 top-16 flex items-center justify-around border-b border-black/[0.06] bg-[#FBFBF8] py-2 md:hidden">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-medium text-[#12331F]/60"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
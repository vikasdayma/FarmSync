"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import "./Navbar.css";
import LogoutButton from "./LogoutButton";

import { GiHamburgerMenu } from "react-icons/gi";
import MobileNav from "./MobileNav";
const Navbar = () => {
  const { user, isLoading, isAuthChecked, isLoggedIn } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || "";
  const [mobileOpen,setMobileOpen]=useState<boolean>(false);
  const go = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  if (isAuthChecked) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-[5%] h-16 bg-[rgba(15,25,20,0.85)] backdrop-blur-lg border-b border-[rgba(82,183,136,0.12)] font-['DM_Sans',sans-serif] max-[768px]:flex-wrap max-[768px]:py-3 max-[768px]:px-4 max-[768px]:w-full max-[768px]:box-border max-[768px]:overflow-x-hidden">
          <div
            className="font-['Playfair_Display',serif] text-2xl font-black tracking-[-0.5px] text-[#f0ede6] cursor-pointer shrink-0 max-[768px]:text-[1.1rem]"
            onClick={() => go("/")}
          >
            Farm<span className="text-[#52b788]">Sync</span>
          </div>

          {/* Desktop links — hidden on mobile */}
          <ul className="flex items-center gap-1 list-none m-0 p-0 max-[768px]:hidden">
            <li>
              <button
                className="bg-transparent border-none text-[rgba(240,237,230,0.65)] text-[0.88rem] font-medium py-[0.4rem] px-[0.9rem] rounded-lg cursor-pointer transition-colors duration-200 block hover:text-[#f0ede6] hover:bg-[rgba(82,183,136,0.08)]"
                onClick={() => router.push("/")}
              >
                Home
              </button>
            </li>
            <li>
              <a
                href="/#features"
                className="bg-transparent border-none text-[rgba(240,237,230,0.65)] text-[0.88rem] font-medium py-[0.4rem] px-[0.9rem] rounded-lg no-underline transition-colors duration-200 block hover:text-[#f0ede6] hover:bg-[rgba(82,183,136,0.08)]"
              >
                Features
              </a>
            </li>
            <li>
              <button
                className="bg-transparent border-none text-[rgba(240,237,230,0.65)] text-[0.88rem] font-medium py-[0.4rem] px-[0.9rem] rounded-lg cursor-pointer transition-colors duration-200 block hover:text-[#f0ede6] hover:bg-[rgba(82,183,136,0.08)]"
                onClick={() => router.push("/marketplace")}
              >
                Marketplace
              </button>
            </li>
            <li>
              <a
                href="/#contact"
                className="bg-transparent border-none text-[rgba(240,237,230,0.65)] text-[0.88rem] font-medium py-[0.4rem] px-[0.9rem] rounded-lg no-underline transition-colors duration-200 block hover:text-[#f0ede6] hover:bg-[rgba(82,183,136,0.08)]"
              >
                Contact
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-[0.6rem] shrink-0 max-[768px]:flex-wrap max-[768px]:gap-2">
            {isLoading ? (
              <div className="w-8.5 h-8.5 rounded-full bg-white/8 animate-[fs-shimmer_1.4s_ease-in-out_infinite]" />
            ) : isLoggedIn ? (
              <>
                {user?.role === "FARMER" && (
                  <button
                    className="flex items-center gap-[0.4rem] bg-[rgba(82,183,136,0.1)] text-[#52b788] border border-[rgba(82,183,136,0.25)] py-[0.4rem] px-4 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.5)] hover:text-[#d8f3dc] hover:-translate-y-px before:content-['🌾'] before:text-[0.85rem] max-[768px]:hidden"
                    onClick={() => router.push("/dashboard")}
                  >
                    My Farm
                  </button>
                )}
                {user?.role === "SUPER_ADMIN" && (
                  <button
                    className="flex items-center gap-[0.4rem] bg-[rgba(82,183,136,0.1)] text-[#52b788] border border-[rgba(82,183,136,0.25)] py-[0.4rem] px-4 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.5)] hover:text-[#d8f3dc] hover:-translate-y-px before:content-['🌾'] before:text-[0.85rem] max-[768px]:hidden"
                    onClick={() => router.push("/dashboard")}
                  >
                    MASTER DASHBOARD
                  </button>
                )}
                {user?.role === "SUPPLIER" && (
                  <button
                    className="flex items-center gap-[0.4rem] bg-[rgba(82,183,136,0.1)] text-[#52b788] border border-[rgba(82,183,136,0.25)] py-[0.4rem] px-4 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.5)] hover:text-[#d8f3dc] hover:-translate-y-px before:content-['🌾'] before:text-[0.85rem] max-[768px]:hidden"
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </button>
                )}
                {user?.role === "AGRONOMIST" && (
                  <button
                    className="flex items-center gap-[0.4rem] bg-[rgba(82,183,136,0.1)] text-[#52b788] border border-[rgba(82,183,136,0.25)] py-[0.4rem] px-4 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.5)] hover:text-[#d8f3dc] hover:-translate-y-px before:content-['🌾'] before:text-[0.85rem] max-[768px]:hidden"
                    onClick={() => router.push("/agronomist/dashboard")}
                  >
                     Dashboard
                  </button>
                )}

                <div className="hidden md:flex items-center gap-2">
                  <div className="relative">
                    <div
                      className="flex items-center gap-[0.6rem] pt-[0.3rem] pr-[0.7rem] pb-[0.3rem] pl-[0.3rem] rounded-full border border-[rgba(82,183,136,0.2)] bg-[rgba(82,183,136,0.06)] cursor-pointer transition-colors duration-200 hover:border-[rgba(82,183,136,0.45)] hover:bg-[rgba(82,183,136,0.12)]"
                      onClick={() => setProfileOpen((prev) => !prev)}
                    >
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="avatar"
                          className="w-[30px] h-[30px] rounded-full object-cover border-[1.5px] border-[rgba(82,183,136,0.4)]"
                        />
                      ) : (
                        <div className="w-[30px] h-[30px] rounded-full bg-[#2d6a4f] flex items-center justify-center text-[#d8f3dc] font-bold text-[0.85rem] border-[1.5px] border-[rgba(82,183,136,0.4)] shrink-0">
                          {firstLetter}
                        </div>
                      )}

                      <span className="hidden sm:inline text-[0.82rem] font-medium max-w-[90px] overflow-hidden text-ellipsis whitespace-nowrap text-white">
                        {user?.firstName}
                      </span>

                      {/* animation stays in CSS — see note below */}
                      <div className="fs-dot" />
                    </div>

                    {profileOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-white border border-[#e8e4df] rounded-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] overflow-hidden min-w-[160px] z-50">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            router.push("/profile");
                          }}
                          className="block w-full text-left px-4 py-3 bg-transparent border-none cursor-pointer text-[0.9rem] text-[#1a1a1a] hover:bg-gray-50"
                        >
                          Profile
                        </button>
                        <div className="h-px bg-[#f0ece8]" />
                        <LogoutButton className="" />
                      </div>
                    )}
                  </div>

                  {/* Hamburger — mobile only */}
                </div>
              </>
            ) : (
              <>
                <button
                  className="bg-transparent text-[rgba(240,237,230,0.75)] border border-[rgba(240,237,230,0.18)] py-[0.45rem] px-[1.1rem] rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:border-[rgba(240,237,230,0.45)] hover:text-[#f0ede6] hover:bg-white/4 max-[768px]:hidden"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
                <button
                  className="bg-[#2d6a4f] text-[#d8f3dc] border-none py-[0.45rem] px-[1.2rem] rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[#52b788] hover:text-white hover:-translate-y-px max-[768px]:hidden"
                  onClick={() => router.push("/signup")}
                >
                  Register →
                </button>
              </>
            )}
             <button
              className=" md:hidden text-2xl text-amber-50"
                onClick={()=>{setMobileOpen(true)}}       
           >
           <GiHamburgerMenu/>
          </button>
          </div>
            
          
        </nav>
          {mobileOpen && <MobileNav menuOpen={mobileOpen}
               setMenuOpen={setMobileOpen} />}
      </>
    );
  }
};

export default Navbar;

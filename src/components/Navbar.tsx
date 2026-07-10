// 'use client'

// import { useState } from 'react'
// import { useAuth } from '@/context/AuthProvider'
// import { useRouter } from 'next/navigation'
// import './Navbar.css'

// const Navbar = () => {
//   const { user, isLoading, isAuthChecked, isLoggedIn } = useAuth()
//   const router = useRouter()
//   const [menuOpen, setMenuOpen] = useState(false)

//   const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || ""

  
//   const go = (path: string) => {
//     setMenuOpen(false)
//     router.push(path)
//   }

//   if (isAuthChecked) {
//     return (
//       <>
//         <nav className="fs-nav">
//           <div className="fs-logo" onClick={() => go('/')}>
//             Farm<span>Sync</span>
//           </div>

//           {/* Desktop links — unchanged */}
//           <ul className="fs-links">
//             <li><button onClick={() => router.push('/')}>Home</button></li>
//             <li><a href="/#features">Features</a></li>
//             <li><button onClick={() => { router.push('/marketplace') }}>Marketplace</button></li>
//             <li><a href="/#contact">Contact</a></li>
//           </ul>

//           <div className="fs-right">
//             {isLoading ? (
//               <div className="fs-skeleton" />
//             ) : isLoggedIn ? (
//               <>
//                 {user?.role === 'FARMER' && (
//                   <button className="fs-myfarm-btn" onClick={() => router.push('/dashboard')}>
//                     My Farm
//                   </button>
//                 )}
//                 {user?.role === 'SUPER_ADMIN' && (
//                   <button className="fs-myfarm-btn" onClick={() => router.push('/dashboard')}>
//                     MASTER DASHBOARD
//                   </button>
//                 )}
//                 {user?.role === 'SUPPLIER' && (
//                   <button className="fs-myfarm-btn" onClick={() => router.push('/dashboard')}>
//                     Dashboard
//                   </button>
//                 )}
//                 {user?.role === 'AGRONOMIST' && (
//                   <button className="fs-myfarm-btn" onClick={() => router.push('/agronomist/dashboard')}>
//                     Agronomist Dashboard
//                   </button>
//                 )}

//                 <div className="fs-avatar-wrap-landing" onClick={() => router.push('/profile')}>
//                   {user?.avatarUrl ? (
//                     <img src={user.avatarUrl} alt="avatar" className="fs-avatar-img" />
//                   ) : (
//                     <div className="fs-avatar-letter">{firstLetter}</div>
//                   )}
//                   <span className="fs-avatar-name">{user?.firstName}</span>
//                   <div className="fs-dot" />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <button className="fs-btn-login" onClick={() => router.push('/login')}>
//                   Login
//                 </button>
//                 <button className="fs-btn-signup" onClick={() => router.push('/signup')}>
//                   Register →
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Hamburger — only visible on mobile via CSS */}
//           <button
//             className={`fs-burger ${menuOpen ? 'fs-burger-open' : ''}`}
//             aria-label="Toggle menu"
//             aria-expanded={menuOpen}
//             onClick={() => setMenuOpen((v) => !v)}
//           >
//             <span />
//             <span />
//             <span />
//           </button>
//         </nav>

//         {/* Mobile drawer — same links + auth actions, just stacked for small screens */}
//         <div className={` sm:hidden fs-mobile-menu ${menuOpen ? 'fs-mobile-menu-open' : ''}`}>
//           <button onClick={() => go('/')}>Home</button>
//           <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
//           <button onClick={() => go('/marketplace')}>Marketplace</button>
//           <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>

//           <div className="fs-mobile-menu-divider" />

//           {isLoading ? (
//             <div className="fs-skeleton" />
//           ) : isLoggedIn ? (
//             <>
//               {user?.role === 'FARMER' && (
//                 <button onClick={() => go('/dashboard')}>My Farm</button>
//               )}
//               {user?.role === 'SUPER_ADMIN' && (
//                 <button onClick={() => go('/dashboard')}>MASTER DASHBOARD</button>
//               )}
//               {user?.role === 'SUPPLIER' && (
//                 <button onClick={() => go('/dashboard')}>Dashboard</button>
//               )}
//               {user?.role === 'AGRONOMIST' && (
//                 <button onClick={() => go('/agronomist/dashboard')}>Agronomist Dashboard</button>
//               )}
//               <button onClick={() => go('/profile')}>
//                 {user?.firstName ? `Profile — ${user.firstName}` : 'Profile'}
//               </button>
//             </>
//           ) : (
//             <>
//               <button onClick={() => go('/login')}>Login</button>
//               <button onClick={() => go('/signup')}>Register →</button>
//             </>
//           )}
//         </div>

//         {/* Backdrop so tapping outside the drawer closes it */}
//         {menuOpen && (
//           <div className="fs-mobile-backdrop" onClick={() => setMenuOpen(false)} />
//         )}
//       </>
//     )
//   }
// }

// export default Navbar

'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import './Navbar.css' 

const Navbar = () => {
  const { user, isLoading, isAuthChecked, isLoggedIn } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || ""

  const go = (path: string) => {
    setMenuOpen(false)
    router.push(path)
  }

  if (isAuthChecked) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5%] h-16 bg-[rgba(15,25,20,0.85)] backdrop-blur-lg border-b border-[rgba(82,183,136,0.12)] font-['DM_Sans',sans-serif] max-[768px]:flex-wrap max-[768px]:py-3 max-[768px]:px-4 max-[768px]:w-full max-[768px]:box-border max-[768px]:overflow-x-hidden">
          <div
            className="font-['Playfair_Display',serif] text-2xl font-black tracking-[-0.5px] text-[#f0ede6] cursor-pointer shrink-0 max-[768px]:text-[1.1rem]"
            onClick={() => go('/')}
          >
            Farm<span className="text-[#52b788]">Sync</span>
          </div>

          {/* Desktop links — hidden on mobile */}
          <ul className="flex items-center gap-1 list-none m-0 p-0 max-[768px]:hidden">
            <li>
              <button
                className="bg-transparent border-none text-[rgba(240,237,230,0.65)] text-[0.88rem] font-medium py-[0.4rem] px-[0.9rem] rounded-lg cursor-pointer transition-colors duration-200 block hover:text-[#f0ede6] hover:bg-[rgba(82,183,136,0.08)]"
                onClick={() => router.push('/')}
              >
                Home
              </button>
            </li>
            <li>
              <a 
                href="/#features"
                className="bg-transparent border-none text-[rgba(240,237,230,0.65)] text-[0.88rem] font-medium py-[0.4rem] px-[0.9rem] rounded-lg no-underline transition-colors duration-200 block hover:text-[#f0ede6] hover:bg-[rgba(82,183,136,0.08)]">
                Features
              </a>
            </li>
            <li>
              <button
                className="bg-transparent border-none text-[rgba(240,237,230,0.65)] text-[0.88rem] font-medium py-[0.4rem] px-[0.9rem] rounded-lg cursor-pointer transition-colors duration-200 block hover:text-[#f0ede6] hover:bg-[rgba(82,183,136,0.08)]"
                onClick={() => router.push('/marketplace')}
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
              <div className="w-[34px] h-[34px] rounded-full bg-white/[0.08] animate-[fs-shimmer_1.4s_ease-in-out_infinite]" />
            ) : isLoggedIn ? (
              <>
                {user?.role === 'FARMER' && (
                  <button
                    className="flex items-center gap-[0.4rem] bg-[rgba(82,183,136,0.1)] text-[#52b788] border border-[rgba(82,183,136,0.25)] py-[0.4rem] px-4 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.5)] hover:text-[#d8f3dc] hover:-translate-y-px before:content-['🌾'] before:text-[0.85rem] max-[768px]:hidden"
                    onClick={() => router.push('/dashboard')}
                  >
                    My Farm
                  </button>
                )}
                {user?.role === 'SUPER_ADMIN' && (
                  <button
                    className="flex items-center gap-[0.4rem] bg-[rgba(82,183,136,0.1)] text-[#52b788] border border-[rgba(82,183,136,0.25)] py-[0.4rem] px-4 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.5)] hover:text-[#d8f3dc] hover:-translate-y-px before:content-['🌾'] before:text-[0.85rem] max-[768px]:hidden"
                    onClick={() => router.push('/dashboard')}
                  >
                    MASTER DASHBOARD
                  </button>
                )}
                {user?.role === 'SUPPLIER' && (
                  <button
                    className="flex items-center gap-[0.4rem] bg-[rgba(82,183,136,0.1)] text-[#52b788] border border-[rgba(82,183,136,0.25)] py-[0.4rem] px-4 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.5)] hover:text-[#d8f3dc] hover:-translate-y-px before:content-['🌾'] before:text-[0.85rem] max-[768px]:hidden"
                    onClick={() => router.push('/dashboard')}
                  >
                    Dashboard
                  </button>
                )}
                {user?.role === 'AGRONOMIST' && (
                  <button
                    className="flex items-center gap-[0.4rem] bg-[rgba(82,183,136,0.1)] text-[#52b788] border border-[rgba(82,183,136,0.25)] py-[0.4rem] px-4 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(82,183,136,0.2)] hover:border-[rgba(82,183,136,0.5)] hover:text-[#d8f3dc] hover:-translate-y-px before:content-['🌾'] before:text-[0.85rem] max-[768px]:hidden"
                    onClick={() => router.push('/agronomist/dashboard')}
                  >
                    Agronomist Dashboard
                  </button>
                )}

                <div
                  className="flex items-center gap-[0.6rem] py-[0.3rem] pr-[0.7rem] pl-[0.3rem] rounded-full border border-[rgba(82,183,136,0.2)] bg-[rgba(82,183,136,0.06)] cursor-pointer transition-colors duration-200 hover:border-[rgba(82,183,136,0.45)] hover:bg-[rgba(82,183,136,0.12)] max-[768px]:hidden"
                  onClick={() => router.push('/profile')}
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="avatar"
                      className="w-7.5 h-7.5 rounded-full object-cover border-[1.5px] border-[rgba(82,183,136,0.4)]"
                    />
                  ) : (
                    <div className="w-7.5 h-7.5 rounded-full bg-[#2d6a4f] flex items-center justify-center text-[#d8f3dc] font-bold text-[0.85rem] border-[1.5px] border-[rgba(82,183,136,0.4)] shrink-0">
                      {firstLetter}
                    </div>
                  )}
                  <span className="text-[0.82rem] font-medium text-[rgba(240,237,230,0.85)] max-w-22.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user?.firstName}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-[fs-pulse_2s_infinite] shrink-0" />
                </div>
              </>
            ) : (
              <>
                <button
                  className="bg-transparent text-[rgba(240,237,230,0.75)] border border-[rgba(240,237,230,0.18)] py-[0.45rem] px-[1.1rem] rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:border-[rgba(240,237,230,0.45)] hover:text-[#f0ede6] hover:bg-white/[0.04] max-[768px]:hidden"
                  onClick={() => router.push('/login')}
                >
                  Login
                </button>
                <button
                  className="bg-[#2d6a4f] text-[#d8f3dc] border-none py-[0.45rem] px-[1.2rem] rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[#52b788] hover:text-white hover:-translate-y-px max-[768px]:hidden"
                  onClick={() => router.push('/signup')}
                >
                  Register →
                </button>
              </>
            )}
          </div>

          {/* Hamburger — only visible on mobile */}
          <button
            className="hidden max-[768px]:flex flex-col justify-center gap-1.25 w-8 h-8 bg-transparent border-none cursor-pointer p-0 z-[60]"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`block h-0.5 w-full bg-current rounded-sm transition-[transform,opacity] duration-200 ${menuOpen ? 'translate-y-1.75 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-full bg-current rounded-sm transition-[transform,opacity] duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-full bg-current rounded-sm transition-[transform,opacity] duration-200 ${menuOpen ? '-translate-y-1.75 -rotate-45' : ''}`} />
          </button>
        </nav>

        {/* Mobile drawer */}
        <div
          className={`sm:hidden fixed top-0 right-0 h-screen w-[min(80vw,320px)] bg-white border-l border-[#eaeaea] shadow-[-8px_0_32px_rgba(0,0,0,0.12)] flex flex-col gap-[0.4rem] pt-[5.5rem] px-5 pb-8 transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] z-[55] overflow-y-auto ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            className="flex items-center bg-transparent border-none rounded-[10px] text-left text-[0.95rem] font-medium text-[#16281d] py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:bg-[rgba(14,40,24,0.05)] hover:text-[#0e2818] active:scale-[0.98]"
            onClick={() => go('/')}
          >
            Home
          </button>
          <a 
            href="#features"
            className="flex items-center bg-transparent rounded-[10px] text-left text-[0.95rem] font-medium text-[#16281d] py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:bg-[rgba(14,40,24,0.05)] hover:text-[#0e2818] active:scale-[0.98]"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>
          <button
            className="flex items-center bg-transparent border-none rounded-[10px] text-left text-[0.95rem] font-medium text-[#16281d] py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:bg-[rgba(14,40,24,0.05)] hover:text-[#0e2818] active:scale-[0.98]"
            onClick={() => go('/marketplace')}
          >
            Marketplace
          </button>
          <a 
            href="#contact"
            className="flex items-center bg-transparent rounded-[10px] text-left text-[0.95rem] font-medium text-[#16281d] py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:bg-[rgba(14,40,24,0.05)] hover:text-[#0e2818] active:scale-[0.98]"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>

          <div className="h-px bg-[#eaeaea] my-[0.85rem] mx-1" />

          {isLoading ? (
            <div className="w-8.5 h-8.5 rounded-full bg-white/[0.08] animate-[fs-shimmer_1.4s_ease-in-out_infinite]" />
          ) : isLoggedIn ? (
            <>
              {user?.role === 'FARMER' && (
                <button
                  className="flex items-center rounded-[10px] font-semibold justify-center border border-[#d8ded9] bg-transparent py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:border-[#0e2818] hover:bg-[rgba(14,40,24,0.03)]"
                  onClick={() => go('/dashboard')}
                >
                  My Farm
                </button>
              )}
              {user?.role === 'SUPER_ADMIN' && (
                <button
                  className="flex items-center rounded-[10px] font-semibold justify-center border border-[#d8ded9] bg-transparent py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:border-[#0e2818] hover:bg-[rgba(14,40,24,0.03)]"
                  onClick={() => go('/dashboard')}
                >
                  MASTER DASHBOARD
                </button>
              )}
              {user?.role === 'SUPPLIER' && (
                <button
                  className="flex items-center rounded-[10px] font-semibold justify-center border border-[#d8ded9] bg-transparent py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:border-[#0e2818] hover:bg-[rgba(14,40,24,0.03)]"
                  onClick={() => go('/dashboard')}
                >
                  Dashboard
                </button>
              )}
              {user?.role === 'AGRONOMIST' && (
                <button
                  className="flex items-center rounded-[10px] font-semibold justify-center border border-[#d8ded9] bg-transparent py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:border-[#0e2818] hover:bg-[rgba(14,40,24,0.03)]"
                  onClick={() => go('/agronomist/dashboard')}
                >
                  Agronomist Dashboard
                </button>
              )}
              <button
                className="flex items-center rounded-[10px] font-semibold justify-center bg-[#d4f26a] text-[#0e2818] border-none py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:bg-[#e4fb8f]"
                onClick={() => go('/profile')}
              >
                {user?.firstName ? `Profile — ${user.firstName}` : 'Profile'}
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center rounded-[10px] font-semibold justify-center border border-[#d8ded9] bg-transparent py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:border-[#0e2818] hover:bg-[rgba(14,40,24,0.03)]"
                onClick={() => go('/login')}
              >
                Login
              </button>
              <button
                className="flex items-center rounded-[10px] font-semibold justify-center bg-[#d4f26a] text-[#0e2818] border-none py-[0.85rem] px-[0.9rem] w-full cursor-pointer transition-colors duration-[180ms] hover:bg-[#e4fb8f]"
                onClick={() => go('/signup')}
              >
                Register →
              </button>
            </>
          )}
        </div>

        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </>
    )
  }
}

export default Navbar
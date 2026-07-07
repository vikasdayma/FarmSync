'use client'

import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import './Navbar.css'
const Navbar = () => {
  const { user, isLoading, isAuthChecked, isLoggedIn } = useAuth()
  const router = useRouter()

  const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || ""

  if (isAuthChecked) {
    return (
      <>
       

        <nav className="fs-nav">

          {/* Logo → goes to / */}
          <div className="fs-logo" onClick={() => router.push('/')}>
            Farm<span>Sync</span>
          </div>

          {/* Links — Home goes to /, rest are anchors */}
          <ul className="fs-links">
            <li><button onClick={() => router.push('/')}>Home</button></li>
            <li><a href="#features">Features</a></li>
            <li><button onClick={()=>{router.push('/marketplace')}}> Marketplace</button></li>
            <li><a href="#features">Contact</a></li>
          </ul>

          {/* Right Side */}
          <div className="fs-right">
            {isLoading ? (
              <div className="fs-skeleton" />
            ) : isLoggedIn ? (
              <>
            {user?.role === 'FARMER' && (
  <button className="fs-myfarm-btn" onClick={() => router.push('/dashboard')}>
    My Farm
  </button>
)}


  {user?.role === 'SUPER_ADMIN' && (
  <button className="fs-myfarm-btn" onClick={() => router.push('/dashboard')}>
    MASTER DASHBOARD
  </button>
)}

  {user?.role === 'SUPPLIER' && (
  <button className="fs-myfarm-btn" onClick={() => router.push('/dashboard')}>
    Dashboard
  </button>
)}
{user?.role === 'AGRONOMIST' && (
  <button className="fs-myfarm-btn" onClick={() => router.push('/agronomist/dashboard')}>
    Agronomist Dashboard
  </button>
)}
             

                {/* Profile */}
                <div className="fs-avatar-wrap"
                             onClick={() => router.push('/profile')}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="fs-avatar-img" />
                  ) : (
                    <div className="fs-avatar-letter">{firstLetter}</div>
                  )}
                  <span className="fs-avatar-name">{user?.firstName}</span>
                  <div className="fs-dot" />
                </div>
              </>
            ) : (
              <>
                <button className="fs-btn-login" onClick={() => router.push('/login')}>
                  Login
                </button>
                <button className="fs-btn-signup" onClick={() => router.push('/signup')}>
                  Register →
                </button>
              </>
            )}
          </div>

        </nav>
      </>
    )
  }
}

export default Navbar
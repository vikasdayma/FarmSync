
'use client'
import Navbar from '@/components/Navbar'
import Sidebar from './Sidebar'
import React, { useState } from 'react'

import NavbarDash from '@/components/farmer/NavbarDash'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <>
   
    <div className="flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)} />

      <main
        className={`
         flex-1 h-screen overflow-y-auto
          transition-all duration-300
         
          ${collapsed ? "sm:ml-[72px]" : "sm:ml-64"}
        `}
      >
         <NavbarDash/>
        {children}
      </main>
    </div>
    </>
  )
}

export default Layout
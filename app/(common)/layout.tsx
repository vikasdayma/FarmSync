'use client'

import type { Metadata } from "next";


import Navbar from "@/components/Navbar";



export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
<>
      <Navbar/>
            <main className="flex flex-1 flex-col">
              {children}
            
            </main>
        
     </>
  );
}
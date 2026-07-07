'use client'

import type { Metadata } from "next";


import Navbar from "@/components/Navbar";
import { ToastContainer } from 'react-toastify';


export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className="flex flex-col h-screen bg-[#f7f3ec]">
      <Navbar/>
            <main className="flex flex-1 flex-col">
              {children}
            
            </main>
        
      </body>
    </html>
  );
}
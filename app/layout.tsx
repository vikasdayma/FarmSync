'use client'

import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/context/AuthProvider";
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="flex flex-col h-screen bg-[#f7f3ec]">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {/* <Navbar/> */}
            <main className="flex flex-1 flex-col">
              {children}
              <ToastContainer />
            </main>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
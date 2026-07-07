'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthProvider';

export const LogoutButton = (props:{className:string}) => {
    const router = useRouter();
    const {logout}=useAuth();
    
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", 
      });

      if (res.ok) {
        console.log("✅ Logged out successfully");
        logout();
        router.replace("/login"); 
      }
    } catch (err) {
      console.log("❌ Logout failed", err);
    } finally {
      setLoading(false);
    }
  };
   return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="outline"
      className={props.className}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;

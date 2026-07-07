'use client'
import { Authenticator } from "@/lib/api/auth";
import { refreshToken } from "@/lib/api/auth";
import { User, AuthState } from "@/types/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
 logout: () => {},
login: () => {},
isAuthChecked:true,
})


const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const logout = () => {
    setUser(null)
  }
const login = (userData: User) => {
  setUser(userData)
}

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const res = await Authenticator();

        if (res) {
          setUser(res.data)
          console.log(res)
        } else {
          const getRefresh = await refreshToken();

          if (!getRefresh) {
            setUser(null)
          } else {
            const data = await Authenticator();
            if (data) {
              setUser(data.data)
            } else {
              setUser(null)
            }
          }
        }
      } finally {
        setIsLoading(false)
        setIsAuthChecked(true) 
      }
    }

    fetchUser();
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
isLoggedIn: !!user && !isLoading,
      logout,
       login,
       isAuthChecked,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export function useAuth() {
  return useContext(AuthContext)
}
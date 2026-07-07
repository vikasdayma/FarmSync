import { boolean } from "zod"
export type Role = "FARMER" | "AGRONOMIST" | "SUPPLIER" | "WAREHOUSE_MANAGER"
 |"GOVERNMENT_OFFICER" |"SUPER_ADMIN"




  
  
  
  
  
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string | null  
  role: Role,
  emailVerified: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  logout: () => void
  login: (user: User) => void
    isAuthChecked:boolean,
}


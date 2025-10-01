import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  role: string
  subscriptionStatus: string
  watchlist?: any[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateWatchlist: (watchlist: any[]) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me', { withCredentials: true })
      setUser(response.data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true })
    setUser(response.data.user)
  }

  const register = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/register', { email, password }, { withCredentials: true })
    setUser(response.data.user)
  }

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true })
    setUser(null)
  }

  const updateWatchlist = async (watchlist: any[]) => {
    await axios.put('/api/auth/watchlist', { watchlist }, { withCredentials: true })
    setUser(prev => prev ? { ...prev, watchlist } : null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateWatchlist,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

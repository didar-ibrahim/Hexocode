import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AdminUser } from './api'
import { navigate } from './router'
import { supabase } from './supabase'

type AuthState = {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  const setUserFromSession = (session: { user: { id: string; email?: string; user_metadata?: { name?: string; role?: string } } } | null) => {
    setUser(
      session
        ? {
            id: session.user.id,
            email: session.user.email ?? '',
            name: session.user.user_metadata?.name ?? '',
            role: session.user.user_metadata?.role ?? 'admin',
          }
        : null
    )
  }

  const refresh = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    setUserFromSession(data.session)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserFromSession(session))
    return () => data.subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error('Admin authentication is not configured. Add the Supabase environment variables.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setUserFromSession(data.session)
  }

  const logout = async () => {
    try {
      if (!supabase) return
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } finally {
      setUser(null)
      navigate('/admin/login')
    }
  }

  return React.createElement(AuthContext.Provider, { value: { user, loading, login, logout, refresh } }, children)
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

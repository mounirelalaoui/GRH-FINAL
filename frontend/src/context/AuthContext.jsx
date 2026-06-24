import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '@/services/authService'
import toast from 'react-hot-toast'
const AuthContext = createContext(null)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token')
      const stored = authService.getStoredUser()
      if (token && stored) {
        setUser(stored); setIsAuthenticated(true)
        try { const u = await authService.getMe(); setUser(u); localStorage.setItem('user', JSON.stringify(u)) }
        catch { handleLogout(false) }
      }
      setLoading(false)
    }
    init()
  }, [])
  const login = useCallback(async (credentials) => {
    setLoading(true)
    try { const { user: u } = await authService.login(credentials); setUser(u); setIsAuthenticated(true); toast.success(`Bienvenue, ${u.username} !`); return u }
    finally { setLoading(false) }
  }, [])
  const handleLogout = useCallback(async (notify = true) => {
    try { await authService.logout() } finally { setUser(null); setIsAuthenticated(false); if (notify) toast.success('Déconnexion réussie.') }
  }, [])
  const value = { user, loading, isAuthenticated, login, logout: handleLogout,
    isDirecteur: user?.Role === 'directeurducomlex',
    isGestionnaire: user?.Role === 'gestionnairecfmr',
    hasRole: (r) => user?.Role === r }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx }
export default AuthContext

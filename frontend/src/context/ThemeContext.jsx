import { createContext, useContext, useState, useEffect } from 'react'
const ThemeContext = createContext(null)
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const s = localStorage.getItem('theme')
    return s ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    isDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])
  return <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(p => !p) }}>{children}</ThemeContext.Provider>
}
export const useTheme = () => { const ctx = useContext(ThemeContext); if (!ctx) throw new Error('useTheme must be used within ThemeProvider'); return ctx }

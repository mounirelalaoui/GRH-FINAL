import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Menu, Sun, Moon, LogOut, User, ChevronDown, Settings } from 'lucide-react'
import { useAuth }  from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { ROLE_LABELS } from '@/utils/constants'
const MAP = { dashboard:'Tableau de bord', personnels:'Personnels', conges:'Congés', absences:'Absences', etablissements:'Établissements', specialites:'Spécialités', diplomes:'Diplômes', utilisateurs:'Utilisateurs', nouveau:'Nouveau', edit:'Modifier', profil:'Profil' }
const buildBreadcrumb = (pathname) => { const seg=pathname.split('/').filter(Boolean); return seg.map((s,i)=>({label:MAP[s]||(isNaN(s)?s:`#${s}`),path:'/'+seg.slice(0,i+1).join('/'),isLast:i===seg.length-1})) }
const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth(); const { isDark, toggleTheme } = useTheme(); const navigate=useNavigate(); const location=useLocation()
  const [open,setOpen]=useState(false); const ref=useRef(null); const crumb=buildBreadcrumb(location.pathname)
  useEffect(()=>{ const h=(e)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false) }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h) },[])
  const handleLogout=async()=>{ setOpen(false); await logout(); navigate('/login') }
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 md:px-6 gap-4 shrink-0 sticky top-0 z-10 shadow-sm">
      <button onClick={onMenuClick} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><Menu size={20}/></button>
      <nav className="flex-1 hidden sm:flex items-center gap-1.5 min-w-0">
        <Link to="/dashboard" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 shrink-0">Accueil</Link>
        {crumb.map(c=><span key={c.path} className="flex items-center gap-1.5"><ChevronDown size={14} className="text-gray-300 dark:text-gray-600 rotate-[-90deg]"/>{c.isLast?<span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{c.label}</span>:<Link to={c.path} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 truncate">{c.label}</Link>}</span>)}
      </nav>
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">{isDark?<Sun size={18} className="text-amber-400"/>:<Moon size={18}/>}</button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"/>
        <div className="relative" ref={ref}>
          <button onClick={()=>setOpen(p=>!p)} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">{user?.username?.charAt(0).toUpperCase()}</div>
            <div className="hidden md:block text-left"><p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight truncate max-w-[120px]">{user?.username}</p><p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{ROLE_LABELS[user?.Role]}</p></div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open?'rotate-180':''}`}/>
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700"><p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.username}</p><p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p></div>
              <div className="py-1.5">
                <button onClick={()=>{setOpen(false);navigate('/profil')}} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"><User size={15}/>Mon profil</button>
                <button onClick={()=>setOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"><Settings size={15}/>Paramètres</button>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 py-1.5"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><LogOut size={15}/>Déconnexion</button></div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default Navbar

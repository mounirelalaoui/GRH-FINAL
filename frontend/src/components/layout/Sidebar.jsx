import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { SIDEBAR_ITEMS } from '@/utils/constants'
import { LayoutDashboard, Users, CalendarDays, UserX, Building2, GraduationCap, Award, ShieldCheck, X, ChevronRight, Building } from 'lucide-react'
const ICONS = { LayoutDashboard, Users, CalendarDays, UserX, Building2, GraduationCap, Award, ShieldCheck }
const Sidebar = ({ isOpen, isMobile, onClose }) => {
  const { user, isDirecteur } = useAuth()
  const visibleGroups = SIDEBAR_ITEMS.map(g=>({...g,items:g.items.filter(i=>i.roles.includes(user?.Role))})).filter(g=>g.items.length>0)
  return (
    <aside className={`fixed top-0 left-0 h-full z-30 flex flex-col bg-sidebar text-white select-none transition-all duration-300 ease-in-out ${isOpen?'w-64 translate-x-0':isMobile?'w-64 -translate-x-full':'w-20 translate-x-0'}`}>
      <div className={`flex items-center h-16 px-4 border-b border-white/10 ${!isOpen && !isMobile?'justify-center':'justify-between'}`}>
        {(isOpen||isMobile) ? (
          <>
            <div className="flex items-center gap-3"><div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shrink-0"><Building size={20} className="text-white"/></div><div className="min-w-0"><p className="font-bold text-sm text-white truncate">GestionRH</p><p className="text-xs text-slate-400">{isDirecteur?'Directeur':'Gestionnaire'}</p></div></div>
            {isMobile && <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10"><X size={18}/></button>}
          </>
        ) : <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg"><Building size={20} className="text-white"/></div>}
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 space-y-1 px-3">
        {visibleGroups.map((group,gi)=>(
          <div key={gi} className={gi>0?'pt-3':''}>
            {(isOpen||isMobile) ? <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">{group.group}</p> : gi>0 && <div className="border-t border-white/10 mx-2 mb-2"/>}
            {group.items.map(item=>{
              const Icon=ICONS[item.icon]
              return <NavLink key={item.path} to={item.path} onClick={isMobile?onClose:undefined} title={!isOpen && !isMobile?item.label:undefined} className={({isActive})=>`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group ${isActive?'bg-primary-600 text-white shadow-lg':'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                {Icon && <Icon size={19} className="shrink-0 transition-transform duration-200 group-hover:scale-110"/>}
                {(isOpen||isMobile) && <span className="truncate">{item.label}</span>}
              </NavLink>
            })}
          </div>
        ))}
      </nav>
      <div className={`border-t border-white/10 p-3 ${!isOpen && !isMobile?'flex justify-center':''}`}>
        {(isOpen||isMobile) ? <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5"><div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{user?.username?.charAt(0).toUpperCase()}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{user?.username}</p><p className="text-xs text-slate-400 truncate">{user?.email}</p></div><ChevronRight size={14} className="text-slate-600 shrink-0"/></div> : <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs font-bold">{user?.username?.charAt(0).toUpperCase()}</div>}
      </div>
    </aside>
  )
}
export default Sidebar

import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar  from './Navbar'
const MainLayout = () => {
  const [sidebarOpen,setSidebarOpen]=useState(true); const [mobileOpen,setMobileOpen]=useState(false); const [isMobile,setIsMobile]=useState(false)
  useEffect(()=>{ const check=()=>{ const m=window.innerWidth<1024; setIsMobile(m); setSidebarOpen(!m) }; check(); window.addEventListener('resize',check); return ()=>window.removeEventListener('resize',check) },[])
  const closeMobile=()=>setMobileOpen(false)
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {mobileOpen && <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden" onClick={closeMobile}/>}
      <Sidebar isOpen={isMobile?mobileOpen:sidebarOpen} isMobile={isMobile} onClose={closeMobile}/>
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${!isMobile && sidebarOpen?'lg:ml-64':'lg:ml-20'}`}>
        <Navbar onMenuClick={()=>isMobile?setMobileOpen(p=>!p):setSidebarOpen(p=>!p)}/>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"><div className="max-w-screen-xl mx-auto animate-fade-in"><Outlet/></div></main>
      </div>
    </div>
  )
}
export default MainLayout

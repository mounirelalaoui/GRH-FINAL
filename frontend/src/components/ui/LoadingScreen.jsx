import { Building2 } from 'lucide-react'
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse"><Building2 size={28} className="text-white"/></div>
      <div className="flex gap-1.5">{[0,1,2].map(i=><div key={i} className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Chargement en cours…</p>
    </div>
  </div>
)
export default LoadingScreen

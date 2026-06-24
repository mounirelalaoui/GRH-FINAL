import { useNavigate } from 'react-router-dom'
import { ShieldX, ArrowLeft } from 'lucide-react'
const AccessDenied = () => { const navigate=useNavigate(); return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
    <div className="text-center space-y-6 animate-fade-in">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto"><ShieldX size={40} className="text-red-500"/></div>
      <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Accès refusé</h1><p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Vous n'avez pas les permissions nécessaires.</p></div>
      <button onClick={()=>navigate('/dashboard')} className="btn-primary btn mx-auto flex items-center gap-2"><ArrowLeft size={16}/>Retour au tableau de bord</button>
    </div>
  </div>
)}
export default AccessDenied

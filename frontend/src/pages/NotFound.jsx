import { useNavigate } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'
const NotFound = () => { const navigate=useNavigate(); return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
    <div className="text-center space-y-6 animate-fade-in">
      <p className="text-8xl font-black text-gray-200 dark:text-gray-800">404</p>
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto -mt-4"><SearchX size={32} className="text-blue-500"/></div>
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page introuvable</h1><p className="text-gray-500 dark:text-gray-400">Cette page n'existe pas ou a été déplacée.</p></div>
      <button onClick={()=>navigate('/dashboard')} className="btn-primary btn mx-auto flex items-center gap-2"><Home size={16}/>Retour à l'accueil</button>
    </div>
  </div>
)}
export default NotFound

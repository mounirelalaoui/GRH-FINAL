import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LogIn, Building2, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { loginSchema } from '@/utils/validators'
const Login = () => {
  const { login, isAuthenticated } = useAuth(); const navigate=useNavigate(); const location=useLocation()
  const [showPwd,setShowPwd]=useState(false); const from=location.state?.from?.pathname||'/dashboard'
  useEffect(()=>{ if(isAuthenticated) navigate(from,{replace:true}) },[isAuthenticated])
  const { register, handleSubmit, formState:{errors,isSubmitting}, setError } = useForm({resolver:zodResolver(loginSchema)})
  const onSubmit = async (data) => { try{ await login(data); navigate(from,{replace:true}) } catch(err){ setError('root',{message:err.response?.data?.message||'Identifiants incorrects'}) } }
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center"><Building2 size={22} className="text-white"/></div><span className="text-white font-bold text-xl tracking-tight">GestionRH</span></div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">Système de gestion<br/><span className="text-blue-400">du personnel</span></h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">Plateforme centralisée pour la gestion des personnels, congés, absences, établissements et formations.</p>
          <div className="grid grid-cols-3 gap-4 pt-4">{[{label:'Personnels',value:'200+'},{label:'Établissements',value:'12'},{label:'Spécialités',value:'30+'}].map(s=><div key={s.label} className="bg-white/5 rounded-xl p-4 border border-white/10"><div className="text-2xl font-bold text-white">{s.value}</div><div className="text-slate-400 text-sm mt-1">{s.label}</div></div>)}</div>
        </div>
        <p className="text-slate-600 text-sm">© {new Date().getFullYear()} GestionRH — Tous droits réservés</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">
            <div className="mb-8"><h2 className="text-2xl font-bold text-white mb-2">Connexion</h2><p className="text-slate-400 text-sm">Entrez vos identifiants pour accéder à votre espace</p></div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Adresse email</label>
                <input {...register('email')} type="email" placeholder="admin@cfmr.ma" autoComplete="email" className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email?'border-red-500':'border-white/20'}`}/>
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                <div className="relative">
                  <input {...register('password')} type={showPwd?'text':'password'} placeholder="••••••••" autoComplete="current-password" className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password?'border-red-500':'border-white/20'}`}/>
                  <button type="button" onClick={()=>setShowPwd(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">{showPwd?<EyeOff size={18}/>:<Eye size={18}/>}</button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
              </div>
              {errors.root && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{errors.root.message}</div>}
              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] mt-2">{isSubmitting?<><Loader2 size={18} className="animate-spin"/> Connexion…</>:<><LogIn size={18}/> Se connecter</>}</button>
            </form>
            <div className="mt-6 pt-6 border-t border-white/10 flex gap-2">
              <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-center"><div className="text-xs font-medium text-blue-400">Directeur</div><div className="text-xs text-slate-500 mt-0.5">directeur@cfmr.ma</div></div>
              <div className="flex-1 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 text-center"><div className="text-xs font-medium text-purple-400">Gestionnaire</div><div className="text-xs text-slate-500 mt-0.5">gestionnaire@cfmr.ma</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login

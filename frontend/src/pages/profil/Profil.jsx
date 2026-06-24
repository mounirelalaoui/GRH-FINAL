import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Shield, Key, Save, Eye, EyeOff, CheckCircle } from 'lucide-react'
import PageHeader  from '@/components/shared/PageHeader'
import Button      from '@/components/ui/Button'
import Input       from '@/components/ui/Input'
import Alert       from '@/components/ui/Alert'
import Badge       from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import api         from '@/api/axiosInstance'
import toast       from 'react-hot-toast'
import { ROLE_LABELS } from '@/utils/constants'

const passwordSchema = z.object({ current_password:z.string().min(1,'Requis'), password:z.string().min(8,'8 caractères minimum'), password_confirmation:z.string().min(8,'Requis') }).refine(d=>d.password===d.password_confirmation,{message:'Les mots de passe ne correspondent pas',path:['password_confirmation']})

const Profil = () => {
  const { user } = useAuth()
  const [showPwd,setShowPwd]=useState({current:false,new:false,confirm:false})
  const [changed,setChanged]=useState(false)
  const { register, handleSubmit, reset, formState:{errors,isSubmitting}, setError } = useForm({resolver:zodResolver(passwordSchema)})
  const handleChange = async (data) => { try{ await api.post('/change-password',data); toast.success('Mot de passe modifié.'); setChanged(true); reset(); setTimeout(()=>setChanged(false),5000) } catch(err){ const msg=err.response?.data?.message; if(msg?.includes('actuel')) setError('current_password',{message:'Mot de passe actuel incorrect'}) } }
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Mon profil" subtitle="Informations du compte et sécurité" breadcrumb={[{label:'Profil'}]}/>
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="relative"><div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">{user?.username?.charAt(0).toUpperCase()}</div><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center"><CheckCircle size={10} className="text-white"/></div></div>
          <div className="flex-1 min-w-0"><h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.username}</h2><p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p><div className="flex items-center gap-2 mt-2"><Badge status={user?.Role}/><span className="text-xs text-gray-400 dark:text-gray-500">{ROLE_LABELS[user?.Role]}</span></div></div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
          {[{icon:<User size={14}/>,label:'Identifiant',value:user?.username},{icon:<Mail size={14}/>,label:'Email',value:user?.email},{icon:<Shield size={14}/>,label:'Rôle',value:ROLE_LABELS[user?.Role]},{icon:<Key size={14}/>,label:'ID compte',value:`#${user?.id}`}].map(item=>(
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50"><span className="text-gray-400 dark:text-gray-500">{item.icon}</span><div className="min-w-0"><p className="text-xs text-gray-400 dark:text-gray-500">{item.label}</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.value??'—'}</p></div></div>
          ))}
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"><h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Key size={15} className="text-primary-500"/>Changer le mot de passe</h3></div>
        <div className="p-6">
          {changed && <Alert variant="success" dismissible className="mb-5">Mot de passe modifié avec succès.</Alert>}
          <form onSubmit={handleSubmit(handleChange)} noValidate className="space-y-4">
            <Input label="Mot de passe actuel" type={showPwd.current?'text':'password'} required placeholder="••••••••" {...register('current_password')} error={errors.current_password?.message} iconRight={<button type="button" onClick={()=>setShowPwd(p=>({...p,current:!p.current}))}>{showPwd.current?<EyeOff size={15}/>:<Eye size={15}/>}</button>}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nouveau mot de passe" type={showPwd.new?'text':'password'} required placeholder="••••••••" helper="8 caractères minimum" {...register('password')} error={errors.password?.message} iconRight={<button type="button" onClick={()=>setShowPwd(p=>({...p,new:!p.new}))}>{showPwd.new?<EyeOff size={15}/>:<Eye size={15}/>}</button>}/>
              <Input label="Confirmer" type={showPwd.confirm?'text':'password'} required placeholder="••••••••" {...register('password_confirmation')} error={errors.password_confirmation?.message} iconRight={<button type="button" onClick={()=>setShowPwd(p=>({...p,confirm:!p.confirm}))}>{showPwd.confirm?<EyeOff size={15}/>:<Eye size={15}/>}</button>}/>
            </div>
            <div className="flex justify-end pt-2"><Button type="submit" loading={isSubmitting} icon={<Save size={15}/>}>Modifier le mot de passe</Button></div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Profil

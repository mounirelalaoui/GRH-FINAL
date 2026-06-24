import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, KeyRound, ToggleLeft } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'
import Modal  from '@/components/ui/Modal'
import Input  from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { confirmDelete, confirmAction } from '@/components/shared/ConfirmDialog'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import userService from '@/services/userService'
import personnelService from '@/services/personnelService'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/utils/validators'
import { formatDate } from '@/utils/helpers'
import { ROLE_LABELS } from '@/utils/constants'
import toast from 'react-hot-toast'

const UserModal = ({ open, item, mode, onClose, onSaved }) => {
  const [saving,setSaving]=useState(false); const [persons,setPersons]=useState([])
  const isEdit=mode==='edit', isPwd=mode==='password'
  const { register, handleSubmit, reset, formState:{errors} } = useForm({ resolver:zodResolver(userSchema) })
  useEffect(()=>{ if(open) reset(isPwd?{password:''}:(item??{username:'',email:'',password:'',Role:'',idPersonnel:''})) },[open,item,mode])
  useEffect(()=>{ personnelService.getAll({per_page:999}).then(res=>setPersons((res.data||res).map(p=>({value:p.idPersonnel,label:`${p.prenom} ${p.nom}`})))).catch(()=>{}) },[])
  const onSubmit = async (data) => { setSaving(true); try{
    if (mode==='create') await userService.create(data)
    else if (mode==='edit') await userService.update(item.id,data)
    else await userService.resetPassword(item.id,data)
    toast.success(mode==='create'?'Utilisateur créé.':mode==='edit'?'Mis à jour.':'Mot de passe réinitialisé.')
    onSaved(); onClose()
  } catch{} finally{ setSaving(false) } }
  const TITLES={create:'Nouvel utilisateur',edit:"Modifier l'utilisateur",password:'Réinitialiser le mot de passe'}
  return (
    <Modal isOpen={open} onClose={onClose} title={TITLES[mode]} size="sm" footer={<><Button variant="ghost" onClick={onClose}>Annuler</Button><Button form="user-form" type="submit" loading={saving}>{isPwd?'Réinitialiser':isEdit?'Enregistrer':'Créer'}</Button></>}>
      <form id="user-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {!isPwd && <>
          <Input label="Nom d'utilisateur" required {...register('username')} error={errors.username?.message}/>
          <Input label="Email" type="email" required {...register('email')} error={errors.email?.message}/>
          <Select label="Rôle" required {...register('Role')} error={errors.Role?.message} options={[{value:'directeurducomlex',label:'Directeur'},{value:'gestionnairecfmr',label:'Gestionnaire'}]}/>
          <Select label="Personnel lié (optionnel)" {...register('idPersonnel')} error={errors.idPersonnel?.message} options={persons}/>
        </>}
        {(mode==='create'||isPwd) && <Input label={isPwd?'Nouveau mot de passe':'Mot de passe'} type="password" required helper="8 caractères minimum" {...register('password')} error={errors.password?.message}/>}
      </form>
    </Modal>
  )
}

const UtilisateurList = () => {
  const [data,setData]=useState([]); const [loading,setLoading]=useState(true); const [modal,setModal]=useState({open:false,item:null,mode:'create'})
  const load = useCallback(async()=>{ setLoading(true); try{ const r=await userService.getAll(); setData(r.data||r) } finally{ setLoading(false) } },[])
  useEffect(()=>{ load() },[load])
  const handleDelete = async (item) => { const ok=await confirmDelete(item.username); if(!ok)return; try{ await userService.remove(item.id); toast.success('Utilisateur supprimé.'); load() } catch{} }
  const handleToggle = async (item) => { const ok=await confirmAction({title:item.active?'Désactiver le compte':'Activer le compte',text:`Compte de ${item.username}`,confirmText:item.active?'Désactiver':'Activer',confirmColor:item.active?'#dc2626':'#059669'}); if(!ok)return; try{ await userService.toggleActive(item.id); toast.success('Statut mis à jour.'); load() } catch{} }
  return (
    <div className="space-y-6">
      <PageHeader title="Utilisateurs" subtitle={`${data.length} compte${data.length>1?'s':''}`} breadcrumb={[{label:'Utilisateurs'}]} actions={<Button size="sm" icon={<Plus size={15}/>} onClick={()=>setModal({open:true,item:null,mode:'create'})}>Nouvel utilisateur</Button>}/>
      <div className="card overflow-hidden">
        <table className="table">
          <thead><tr><th>Utilisateur</th><th>Email</th><th>Rôle</th><th>Personnel lié</th><th className="text-center">Actions</th></tr></thead>
          <tbody>
            {loading ? Array.from({length:3}).map((_,i)=><TableRowSkeleton key={i} cols={5}/>) :
             data.length===0 ? <tr><td colSpan={5} className="p-0 border-t-0"><EmptyState title="Aucun utilisateur" message="Créez le premier compte." action={()=>setModal({open:true,item:null,mode:'create'})} actionLabel="Créer"/></td></tr> :
             data.map(item=>(
              <tr key={item.id}>
                <td><div className="flex items-center gap-3"><div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">{item.username?.charAt(0).toUpperCase()}</div><div><p className="font-medium text-gray-800 dark:text-gray-200">{item.username}</p><p className="text-xs text-gray-400 flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full inline-block ${item.active!==false?'bg-emerald-400':'bg-gray-300 dark:bg-gray-600'}`}/>{item.active!==false?'Actif':'Inactif'}</p></div></div></td>
                <td className="text-gray-500 dark:text-gray-400 text-sm">{item.email}</td>
                <td><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.Role==='directeurducomlex'?'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300':'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'}`}>{ROLE_LABELS[item.Role]}</span></td>
                <td className="text-gray-500 dark:text-gray-400 text-sm">{item.personnel?`${item.personnel.prenom} ${item.personnel.nom}`:<span className="text-gray-300 dark:text-gray-600 italic">Non lié</span>}</td>
                <td><div className="flex items-center justify-center gap-1">
                  <button title="Modifier" onClick={()=>setModal({open:true,item,mode:'edit'})} className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30"><Pencil size={13}/></button>
                  <button title="Réinitialiser MDP" onClick={()=>setModal({open:true,item,mode:'password'})} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"><KeyRound size={13}/></button>
                  <button title="Activer/Désactiver" onClick={()=>handleToggle(item)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><ToggleLeft size={13}/></button>
                  <button title="Supprimer" onClick={()=>handleDelete(item)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={13}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserModal open={modal.open} item={modal.item} mode={modal.mode} onClose={()=>setModal({open:false,item:null,mode:'create'})} onSaved={load}/>
    </div>
  )
}
export default UtilisateurList

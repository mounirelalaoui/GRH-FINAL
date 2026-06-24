import { useEffect, useState, useCallback } from 'react'
import { GraduationCap, Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'
import Modal  from '@/components/ui/Modal'
import Input  from '@/components/ui/Input'
import { confirmDelete } from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import specialiteService from '@/services/specialiteService'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { specialiteSchema } from '@/utils/validators'
import toast from 'react-hot-toast'

const SpecModal = ({ open, item, onClose, onSaved }) => {
  const isEdit=!!item; const [saving,setSaving]=useState(false)
  const { register, handleSubmit, reset, formState:{errors} } = useForm({ resolver:zodResolver(specialiteSchema) })
  useEffect(()=>{ if(open) reset(item??{nom_specialite:''}) },[open,item])
  const onSubmit=async(data)=>{ setSaving(true); try{ isEdit?await specialiteService.update(item.idSpecialite,data):await specialiteService.create(data); toast.success(isEdit?'Mise à jour.':'Créée.'); onSaved(); onClose() } catch{} finally{ setSaving(false) } }
  return <Modal isOpen={open} onClose={onClose} title={isEdit?'Modifier la spécialité':'Nouvelle spécialité'} size="sm" footer={<><Button variant="ghost" onClick={onClose}>Annuler</Button><Button form="spec-form" type="submit" loading={saving}>{isEdit?'Enregistrer':'Créer'}</Button></>}><form id="spec-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4"><Input label="Nom de la spécialité" required placeholder="Informatique" {...register('nom_specialite')} error={errors.nom_specialite?.message}/></form></Modal>
}

const SpecialiteList = () => {
  const [data,setData]=useState([]); const [loading,setLoading]=useState(true); const [modal,setModal]=useState({open:false,item:null})
  const load = useCallback(async()=>{ setLoading(true); try{ const r=await specialiteService.getAll(); setData(r.data||r) } finally{ setLoading(false) } },[])
  useEffect(()=>{ load() },[load])
  const handleDelete = async (item) => { const ok=await confirmDelete(item.nom_specialite); if(!ok)return; try{ await specialiteService.remove(item.idSpecialite); toast.success('Spécialité supprimée.'); load() } catch{} }
  return (
    <div className="space-y-6">
      <PageHeader title="Spécialités" subtitle={`${data.length} spécialité${data.length>1?'s':''}`} breadcrumb={[{label:'Spécialités'}]} actions={<Button size="sm" icon={<Plus size={15}/>} onClick={()=>setModal({open:true,item:null})}>Nouvelle spécialité</Button>}/>
      {loading ? <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({length:8}).map((_,i)=><div key={i} className="card p-4 space-y-3"><div className="skeleton w-10 h-10 rounded-xl"/><div className="skeleton h-4 w-28"/></div>)}</div> :
       data.length===0 ? <EmptyState title="Aucune spécialité" message="Créez votre première spécialité." action={()=>setModal({open:true,item:null})} actionLabel="Créer"/> :
       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{data.map(item=>(
        <div key={item.idSpecialite} className="card p-4 hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3"><div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center"><GraduationCap size={18} className="text-blue-600 dark:text-blue-400"/></div><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>setModal({open:true,item})} className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30"><Pencil size={13}/></button><button onClick={()=>handleDelete(item)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={13}/></button></div></div>
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-snug">{item.nom_specialite}</p>
        </div>
       ))}</div>}
      <SpecModal open={modal.open} item={modal.item} onClose={()=>setModal({open:false,item:null})} onSaved={load}/>
    </div>
  )
}
export default SpecialiteList

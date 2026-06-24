import { useEffect, useState, useCallback } from 'react'
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'
import Modal  from '@/components/ui/Modal'
import Input  from '@/components/ui/Input'
import { confirmDelete } from '@/components/shared/ConfirmDialog'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import etablissementService from '@/services/etablissementService'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { etablissementSchema } from '@/utils/validators'
import toast from 'react-hot-toast'

const EtabModal = ({ open, item, onClose, onSaved }) => {
  const isEdit=!!item; const [saving,setSaving]=useState(false)
  const { register, handleSubmit, reset, formState:{errors} } = useForm({ resolver:zodResolver(etablissementSchema) })
  useEffect(()=>{ if(open) reset(item??{nom:'',ville:''}) },[open,item])
  const onSubmit=async(data)=>{ setSaving(true); try{ isEdit?await etablissementService.update(item.idEtab,data):await etablissementService.create(data); toast.success(isEdit?'Mis à jour.':'Créé.'); onSaved(); onClose() } catch{} finally{ setSaving(false) } }
  return <Modal isOpen={open} onClose={onClose} title={isEdit?"Modifier l'établissement":'Nouvel établissement'} size="sm" footer={<><Button variant="ghost" onClick={onClose}>Annuler</Button><Button form="etab-form" type="submit" loading={saving}>{isEdit?'Enregistrer':'Créer'}</Button></>}>
    <form id="etab-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input label="Nom de l'établissement" required placeholder="CFMR Casablanca" {...register('nom')} error={errors.nom?.message}/>
      <Input label="Ville" required placeholder="Casablanca" {...register('ville')} error={errors.ville?.message}/>
    </form>
  </Modal>
}

const EtablissementList = () => {
  const [data,setData]=useState([]); const [loading,setLoading]=useState(true); const [modal,setModal]=useState({open:false,item:null})
  const load = useCallback(async()=>{ setLoading(true); try{ const r=await etablissementService.getAll(); setData(r.data||r) } finally{ setLoading(false) } },[])
  useEffect(()=>{ load() },[load])
  const handleDelete = async (item) => { const ok=await confirmDelete(item.nom); if(!ok)return; try{ await etablissementService.remove(item.idEtab); toast.success('Établissement supprimé.'); load() } catch{} }
  return (
    <div className="space-y-6">
      <PageHeader title="Établissements" subtitle={`${data.length} établissement${data.length>1?'s':''}`} breadcrumb={[{label:'Établissements'}]} actions={<Button size="sm" icon={<Plus size={15}/>} onClick={()=>setModal({open:true,item:null})}>Nouvel établissement</Button>}/>
      <div className="card overflow-hidden">
        <table className="table">
          <thead><tr><th>Établissement</th><th>Ville</th><th className="text-center">Actions</th></tr></thead>
          <tbody>
            {loading ? Array.from({length:4}).map((_,i)=><TableRowSkeleton key={i} cols={3}/>) :
             data.length===0 ? <tr><td colSpan={3} className="p-0 border-t-0"><EmptyState title="Aucun établissement" message="Créez votre premier établissement." action={()=>setModal({open:true,item:null})} actionLabel="Créer"/></td></tr> :
             data.map(item=>(
              <tr key={item.idEtab}>
                <td><div className="flex items-center gap-3"><div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center"><Building2 size={16} className="text-amber-600 dark:text-amber-400"/></div><span className="font-medium text-gray-800 dark:text-gray-200">{item.nom}</span></div></td>
                <td className="text-gray-500 dark:text-gray-400">{item.ville}</td>
                <td><div className="flex items-center justify-center gap-2"><button onClick={()=>setModal({open:true,item})} className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30"><Pencil size={14}/></button><button onClick={()=>handleDelete(item)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={14}/></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EtabModal open={modal.open} item={modal.item} onClose={()=>setModal({open:false,item:null})} onSaved={load}/>
    </div>
  )
}
export default EtablissementList

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader       from '@/components/shared/PageHeader'
import PersonnelForm    from './PersonnelForm'
import { FormSkeleton } from '@/components/ui/Skeleton'
import personnelService from '@/services/personnelService'
import { useApi }       from '@/hooks/useApi'
import toast from 'react-hot-toast'
const PersonnelEdit = () => {
  const { id } = useParams(); const navigate=useNavigate()
  const [personnel,setPersonnel]=useState(null); const [loadingData,setLoadingData]=useState(true)
  const { execute, loading } = useApi((data)=>personnelService.update(id,data))
  useEffect(()=>{ personnelService.getById(id).then(setPersonnel).catch(()=>navigate('/personnels')).finally(()=>setLoadingData(false)) },[id])
  const handleSubmit=async(data)=>{ try{ await execute(data); toast.success('Personnel mis à jour.'); navigate(`/personnels/${id}`) } catch{} }
  return (
    <div className="space-y-6">
      <PageHeader title="Modifier le personnel" subtitle={personnel?`${personnel.prenom} ${personnel.nom}`:'Chargement…'} breadcrumb={[{label:'Personnels',path:'/personnels'},{label:'Modifier'}]}/>
      {loadingData ? <div className="card p-6"><FormSkeleton fields={8}/></div> : <PersonnelForm defaultValues={personnel} onSubmit={handleSubmit} loading={loading}/>}
    </div>
  )
}
export default PersonnelEdit

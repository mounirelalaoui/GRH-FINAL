import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import CongeForm  from './CongeForm'
import { FormSkeleton } from '@/components/ui/Skeleton'
import congeService from '@/services/congeService'
import { useApi } from '@/hooks/useApi'
import toast from 'react-hot-toast'
const CongeEdit = () => {
  const { id }=useParams(); const navigate=useNavigate()
  const [conge,setConge]=useState(null); const [loadingData,setLoadingData]=useState(true)
  const { execute, loading } = useApi((data)=>congeService.update(id,data))
  useEffect(()=>{ congeService.getById(id).then(setConge).catch(()=>navigate('/conges')).finally(()=>setLoadingData(false)) },[id])
  const handleSubmit=async(data)=>{ try{ await execute(data); toast.success('Congé mis à jour.'); navigate('/conges') } catch{} }
  return <div className="space-y-6"><PageHeader title="Modifier le congé" breadcrumb={[{label:'Congés',path:'/conges'},{label:'Modifier'}]}/>{loadingData?<div className="card p-6"><FormSkeleton fields={5}/></div>:<CongeForm defaultValues={conge} onSubmit={handleSubmit} loading={loading}/>}</div>
}
export default CongeEdit

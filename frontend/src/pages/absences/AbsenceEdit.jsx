import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import AbsenceForm from './AbsenceForm'
import { FormSkeleton } from '@/components/ui/Skeleton'
import absenceService from '@/services/absenceService'
import { useApi } from '@/hooks/useApi'
import toast from 'react-hot-toast'
const AbsenceEdit = () => {
  const { id }=useParams(); const navigate=useNavigate()
  const [absence,setAbsence]=useState(null); const [loadingData,setLoadingData]=useState(true)
  const { execute, loading } = useApi((data)=>absenceService.update(id,data))
  useEffect(()=>{ absenceService.getById(id).then(setAbsence).catch(()=>navigate('/absences')).finally(()=>setLoadingData(false)) },[id])
  const handleSubmit=async(data)=>{ try{ await execute(data); toast.success('Absence mise à jour.'); navigate('/absences') } catch{} }
  return <div className="space-y-6"><PageHeader title="Modifier l'absence" breadcrumb={[{label:'Absences',path:'/absences'},{label:'Modifier'}]}/>{loadingData?<div className="card p-6"><FormSkeleton fields={3}/></div>:<AbsenceForm defaultValues={absence} onSubmit={handleSubmit} loading={loading}/>}</div>
}
export default AbsenceEdit

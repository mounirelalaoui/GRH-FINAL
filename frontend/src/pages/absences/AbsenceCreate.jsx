import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import AbsenceForm from './AbsenceForm'
import absenceService from '@/services/absenceService'
import { useApi } from '@/hooks/useApi'
import toast from 'react-hot-toast'
const AbsenceCreate = () => {
  const navigate=useNavigate(); const { execute, loading } = useApi(absenceService.create)
  const handleSubmit=async(data)=>{ try{ await execute(data); toast.success('Absence enregistrée.'); navigate('/absences') } catch{} }
  return <div className="space-y-6"><PageHeader title="Nouvelle absence" breadcrumb={[{label:'Absences',path:'/absences'},{label:'Nouvelle'}]}/><AbsenceForm onSubmit={handleSubmit} loading={loading}/></div>
}
export default AbsenceCreate

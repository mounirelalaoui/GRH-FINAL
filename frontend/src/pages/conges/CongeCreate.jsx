import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import CongeForm  from './CongeForm'
import congeService from '@/services/congeService'
import { useApi } from '@/hooks/useApi'
import toast from 'react-hot-toast'
const CongeCreate = () => {
  const navigate=useNavigate(); const { execute, loading } = useApi(congeService.create)
  const handleSubmit=async(data)=>{ try{ await execute(data); toast.success('Congé créé.'); navigate('/conges') } catch{} }
  return <div className="space-y-6"><PageHeader title="Nouveau congé" breadcrumb={[{label:'Congés',path:'/conges'},{label:'Nouveau'}]}/><CongeForm onSubmit={handleSubmit} loading={loading}/></div>
}
export default CongeCreate

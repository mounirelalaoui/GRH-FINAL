import { useNavigate } from 'react-router-dom'
import PageHeader       from '@/components/shared/PageHeader'
import PersonnelForm    from './PersonnelForm'
import personnelService from '@/services/personnelService'
import { useApi }       from '@/hooks/useApi'
import toast from 'react-hot-toast'
const PersonnelCreate = () => {
  const navigate=useNavigate(); const { execute, loading } = useApi(personnelService.create)
  const handleSubmit=async(data)=>{ try{ await execute(data); toast.success('Personnel créé.'); navigate('/personnels') } catch{} }
  return <div className="space-y-6"><PageHeader title="Nouveau personnel" subtitle="Remplissez le formulaire pour ajouter un agent." breadcrumb={[{label:'Personnels',path:'/personnels'},{label:'Nouveau'}]}/><PersonnelForm onSubmit={handleSubmit} loading={loading}/></div>
}
export default PersonnelCreate

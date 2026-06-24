import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Plus, AlertTriangle } from 'lucide-react'
import PageHeader  from '@/components/shared/PageHeader'
import DataTable   from '@/components/shared/DataTable'
import SearchBar   from '@/components/shared/SearchBar'
import Button      from '@/components/ui/Button'
import Avatar      from '@/components/ui/Avatar'
import TableActions from '@/components/shared/TableActions'
import absenceService   from '@/services/absenceService'
import { confirmDelete } from '@/components/shared/ConfirmDialog'
import { useTableState } from '@/hooks/useTableState'
import { useAuth }       from '@/context/AuthContext'
import { formatDate }    from '@/utils/helpers'
import toast from 'react-hot-toast'

const AbsenceList = () => {
  const navigate=useNavigate(); const { isDirecteur } = useAuth()
  const table = useTableState({ initialFilters:{idPersonnel:''} })
  const { data:result, isLoading, refetch } = useQuery(['absences',table.apiParams], ()=>absenceService.getAll(table.apiParams), { keepPreviousData:true, select:r=>({data:r.data??[],total:r.meta?.total??r.total??0}) })
  const data=result?.data??[], total=result?.total??0
  const totalMois = data.filter(d=>{ const now=new Date(), d2=new Date(d.date_absence); return d2.getMonth()===now.getMonth()&&d2.getFullYear()===now.getFullYear() }).length

  const handleDelete = async (row) => { const ok=await confirmDelete(`l'absence du ${formatDate(row.date_absence)}`); if(!ok)return; try{ await absenceService.remove(row.idAbsence); toast.success('Absence supprimée.'); refetch() } catch{} }

  const columns = [
    { key:'personnel', label:'Personnel', render:(_,row)=><div className="flex items-center gap-3"><Avatar prenom={row.personnel?.prenom} nom={row.personnel?.nom} size="sm"/><span className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.personnel?.prenom} {row.personnel?.nom}</span></div> },
    { key:'date_absence', label:"Date", render:v=>formatDate(v) },
    { key:'motif', label:'Motif', render:v=>v||<span className="italic text-gray-300 dark:text-gray-600">Non renseigné</span> },
    { key:'actions', label:'Actions', align:'center', width:'100px', render:(_,row)=><TableActions onEdit={()=>navigate(`/absences/${row.idAbsence}/edit`)} onDelete={isDirecteur?()=>handleDelete(row):undefined} canDelete={isDirecteur}/> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion des absences" subtitle={`${total} absence${total>1?'s':''}`} breadcrumb={[{label:'Absences'}]} actions={<Button size="sm" icon={<Plus size={15}/>} onClick={()=>navigate('/absences/nouveau')}>Nouvelle absence</Button>}/>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4 bg-red-50 dark:bg-red-900/20"><AlertTriangle size={20} className="text-red-500 shrink-0"/><div><p className="text-xs text-gray-500 dark:text-gray-400">Ce mois-ci</p><p className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalMois}</p></div></div>
        <div className="card p-4 flex items-center gap-4"><span className="text-2xl">📊</span><div><p className="text-xs text-gray-500 dark:text-gray-400">Total général</p><p className="text-xl font-bold text-gray-900 dark:text-gray-100">{total}</p></div></div>
      </div>
      <div className="card p-4"><SearchBar onSearch={table.handleSearch} placeholder="Rechercher par nom de personnel…" className="max-w-sm"/></div>
      <div className="card overflow-hidden"><DataTable columns={columns} data={data} loading={isLoading} total={total} page={table.page} perPage={table.perPage} onPageChange={table.setPage} emptyTitle="Aucune absence" emptyMessage="Aucune absence ne correspond à vos critères."/></div>
    </div>
  )
}
export default AbsenceList

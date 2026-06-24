import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react'
import PageHeader  from '@/components/shared/PageHeader'
import DataTable   from '@/components/shared/DataTable'
import SearchBar   from '@/components/shared/SearchBar'
import FilterBar   from '@/components/shared/FilterBar'
import Button      from '@/components/ui/Button'
import Badge       from '@/components/ui/Badge'
import Avatar      from '@/components/ui/Avatar'
import TableActions from '@/components/shared/TableActions'
import { useConges } from '@/hooks/useConges'
import { useTableState } from '@/hooks/useTableState'
import { useAuth } from '@/context/AuthContext'
import { formatDate, diffDays } from '@/utils/helpers'
import { STATUT_CONGE_OPTIONS, TYPE_CONGE_OPTIONS } from '@/utils/constants'

const CongeList = () => {
  const navigate=useNavigate(); const { isDirecteur } = useAuth()
  const table = useTableState({ initialFilters:{statut:'',idPersonnel:'',type_conge:''} })
  const { data, total, isLoading, handleStatut, handleDelete } = useConges(table.apiParams)
  const stats = { en_attente:data.filter(d=>d.statut==='en_attente').length, approuve:data.filter(d=>d.statut==='approuve').length, refuse:data.filter(d=>d.statut==='refuse').length }

  const columns = [
    { key:'personnel', label:'Personnel', render:(_,row)=><div className="flex items-center gap-3"><Avatar prenom={row.personnel?.prenom} nom={row.personnel?.nom} size="sm"/><div><p className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.personnel?.prenom} {row.personnel?.nom}</p></div></div> },
    { key:'type_conge', label:'Type', render:v=><span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-lg">{v}</span> },
    { key:'date_debut', label:'Début', render:v=>formatDate(v) },
    { key:'date_fin', label:'Fin', render:v=>formatDate(v) },
    { key:'duree', label:'Durée', align:'center', render:(_,row)=><span className="text-sm font-semibold">{diffDays(row.date_debut,row.date_fin)} j</span> },
    { key:'statut', label:'Statut', render:v=><Badge status={v} dot/> },
    { key:'actions', label:'Actions', align:'center', width:'160px', render:(_,row)=>(
      <div className="flex items-center justify-center gap-1">
        {isDirecteur && row.statut==='en_attente' && <>
          <button title="Approuver" onClick={()=>handleStatut(row,'approuve')} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"><CheckCircle size={13}/></button>
          <button title="Refuser" onClick={()=>handleStatut(row,'refuse')} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><XCircle size={13}/></button>
        </>}
        <TableActions onEdit={()=>navigate(`/conges/${row.idConge}/edit`)} onDelete={isDirecteur?()=>handleDelete(row):undefined} canDelete={isDirecteur}/>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion des congés" subtitle={`${total} congé${total>1?'s':''}`} breadcrumb={[{label:'Congés'}]} actions={<Button size="sm" icon={<Plus size={15}/>} onClick={()=>navigate('/conges/nouveau')}>Nouveau congé</Button>}/>
      <div className="grid grid-cols-3 gap-4">
        {[{label:'En attente',count:stats.en_attente,icon:<Clock size={16}/>,bg:'bg-amber-50 dark:bg-amber-900/20',text:'text-amber-600 dark:text-amber-400'},{label:'Approuvés',count:stats.approuve,icon:<CheckCircle size={16}/>,bg:'bg-emerald-50 dark:bg-emerald-900/20',text:'text-emerald-600 dark:text-emerald-400'},{label:'Refusés',count:stats.refuse,icon:<XCircle size={16}/>,bg:'bg-red-50 dark:bg-red-900/20',text:'text-red-600 dark:text-red-400'}].map(s=>(
          <div key={s.label} className={`card p-4 flex items-center gap-4 ${s.bg}`}><div className={s.text}>{s.icon}</div><div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</p><p className="text-xl font-bold text-gray-900 dark:text-gray-100">{s.count}</p></div></div>
        ))}
      </div>
      <div className="card p-4 space-y-4">
        <SearchBar onSearch={table.handleSearch} placeholder="Rechercher par personnel…" className="max-w-sm"/>
        <FilterBar filters={[{key:'statut',label:'Statut',options:STATUT_CONGE_OPTIONS},{key:'type_conge',label:'Type de congé',options:TYPE_CONGE_OPTIONS}]} values={table.filters} onChange={table.handleFilter} onReset={table.handleReset}/>
      </div>
      <div className="card overflow-hidden"><DataTable columns={columns} data={data} loading={isLoading} total={total} page={table.page} perPage={table.perPage} onPageChange={table.setPage} emptyTitle="Aucun congé trouvé" emptyMessage="Aucun congé ne correspond à vos critères."/></div>
    </div>
  )
}
export default CongeList

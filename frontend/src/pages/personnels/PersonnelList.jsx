import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import PageHeader   from '@/components/shared/PageHeader'
import DataTable    from '@/components/shared/DataTable'
import SearchBar    from '@/components/shared/SearchBar'
import FilterBar    from '@/components/shared/FilterBar'
import Button       from '@/components/ui/Button'
import Badge        from '@/components/ui/Badge'
import Avatar       from '@/components/ui/Avatar'
import TableActions from '@/components/shared/TableActions'
import ExportButton from '@/components/shared/ExportButton'
import { usePersonnels }  from '@/hooks/usePersonnels'
import { useReferentiel } from '@/hooks/useReferentiel'
import { useTableState }  from '@/hooks/useTableState'
import { useAuth }        from '@/context/AuthContext'
import personnelService   from '@/services/personnelService'
import { TYPE_PERSONNEL_OPTIONS, STATUT_PERSONNEL_OPTIONS } from '@/utils/constants'

const PersonnelList = () => {
  const navigate = useNavigate(); const { isDirecteur } = useAuth()
  const table = useTableState({ initialFilters:{type_personnel:'',statut:'',idEtab:'',idSpecialite:''}, defaultSort:'nom' })
  const { data, total, isLoading, isFetching, handleDelete } = usePersonnels(table.apiParams)
  const { etablissements, specialites } = useReferentiel()

  const columns = [
    { key:'nom', label:'Personnel', sortable:true, render:(_,row)=>(
      <div className="flex items-center gap-3"><Avatar prenom={row.prenom} nom={row.nom} size="sm"/><div className="min-w-0"><p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{row.prenom} {row.nom}</p><p className="text-xs text-gray-400 font-mono">{row.CIN}</p></div></div>
    )},
    { key:'type_personnel', label:'Type', render:(v)=><Badge status={v}/> },
    { key:'statut', label:'Statut', render:(v)=><Badge status={v} dot/> },
    { key:'etablissement', label:'Établissement', render:(_,row)=><span className="text-sm text-gray-600 dark:text-gray-400">{row.etablissement?.nom??'—'}</span> },
    { key:'specialite', label:'Spécialité', render:(_,row)=><span className="text-sm text-gray-400 dark:text-gray-500">{row.specialite?.nom_specialite??'—'}</span> },
    { key:'actions', label:'Actions', align:'center', width:'120px', render:(_,row)=>(
      <TableActions onView={()=>navigate(`/personnels/${row.idPersonnel}`)} onEdit={isDirecteur?()=>navigate(`/personnels/${row.idPersonnel}/edit`):undefined} onDelete={isDirecteur?()=>handleDelete(row):undefined} canEdit={isDirecteur} canDelete={isDirecteur}/>
    )},
  ]

  const FILTERS_CONFIG = [
    { key:'type_personnel', label:'Type', options:TYPE_PERSONNEL_OPTIONS },
    { key:'statut', label:'Statut', options:STATUT_PERSONNEL_OPTIONS },
    { key:'idEtab', label:'Établissement', options:etablissements },
    { key:'idSpecialite', label:'Spécialité', options:specialites },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Personnels" subtitle={isLoading?'Chargement…':`${total} agent${total>1?'s':''}`} breadcrumb={[{label:'Personnels'}]}
        actions={<>
          {isFetching && !isLoading && <RefreshCw size={14} className="text-gray-400 animate-spin"/>}
          <ExportButton fetchAll={()=>personnelService.getAll({per_page:9999,...table.filters})} mapper={p=>({CIN:p.CIN,Nom:p.nom,Prénom:p.prenom,Type:p.type_personnel,Statut:p.statut,Établissement:p.etablissement?.nom??'',Spécialité:p.specialite?.nom_specialite??''})} filename="personnels"/>
          {isDirecteur && <Button size="sm" icon={<Plus size={15}/>} onClick={()=>navigate('/personnels/nouveau')}>Nouveau personnel</Button>}
        </>}
      />
      <div className="card p-4 space-y-4">
        <SearchBar onSearch={table.handleSearch} placeholder="Rechercher par nom, prénom ou CIN…" className="max-w-sm"/>
        <FilterBar filters={FILTERS_CONFIG} values={table.filters} onChange={table.handleFilter} onReset={table.handleReset}/>
      </div>
      <div className="card overflow-hidden">
        <DataTable columns={columns} data={data} loading={isLoading} total={total} page={table.page} perPage={table.perPage} onPageChange={table.setPage} onSort={table.handleSort} sortKey={table.sortKey} sortDir={table.sortDir} emptyTitle="Aucun personnel trouvé" emptyMessage="Essayez de modifier vos critères de recherche." emptyAction={table.handleReset} emptyActionLabel="Réinitialiser les filtres"/>
      </div>
    </div>
  )
}
export default PersonnelList

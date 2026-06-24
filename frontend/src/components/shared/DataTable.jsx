import { ChevronUp, ChevronDown } from 'lucide-react'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from './Pagination'
import PerPageSelector from './PerPageSelector'
const DataTable = ({ columns, data=[], loading=false, total=0, page=1, perPage=10, onPageChange, onPerPageChange, onSort, sortKey, sortDir='asc', emptyTitle='Aucun résultat', emptyMessage='Aucune donnée à afficher.', emptyAction, emptyActionLabel, className='' }) => {
  const SortIndicator = ({active,dir}) => { if(!active) return <span className="opacity-0 group-hover:opacity-40 flex flex-col"><ChevronUp size={10} className="-mb-1"/><ChevronDown size={10}/></span>; return <span className="text-primary-600 dark:text-primary-400">{dir==='asc'?<ChevronUp size={13}/>:<ChevronDown size={13}/>}</span> }
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead><tr>{columns.map(col=><th key={col.key} style={{width:col.width}} className={`${col.align==='right'?'text-right':''} ${col.align==='center'?'text-center':''} ${col.sortable?'cursor-pointer select-none group hover:bg-gray-100 dark:hover:bg-gray-800/50':''}`} onClick={()=>col.sortable && onSort?.(col.key)}><span className="inline-flex items-center gap-1.5">{col.label}{col.sortable && <SortIndicator active={sortKey===col.key} dir={sortDir}/>}</span></th>)}</tr></thead>
          <tbody>
            {loading ? Array.from({length:perPage>10?10:perPage}).map((_,i)=><TableRowSkeleton key={i} cols={columns.length}/>) :
             data.length===0 ? <tr><td colSpan={columns.length} className="p-0 border-t-0"><EmptyState type="search" title={emptyTitle} message={emptyMessage} action={emptyAction} actionLabel={emptyActionLabel}/></td></tr> :
             data.map((row,idx)=><tr key={row.id??row.idPersonnel??row.idConge??row.idAbsence??idx} className="animate-fade-in">{columns.map(col=><td key={col.key} className={`${col.align==='right'?'text-right':''} ${col.align==='center'?'text-center':''}`}>{col.render?col.render(row[col.key],row):(row[col.key]??'—')}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      {!loading && total>0 && <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">{onPerPageChange && <PerPageSelector value={perPage} onChange={onPerPageChange}/>}<Pagination total={total} page={page} perPage={perPage} onChange={onPageChange}/></div>}
    </div>
  )
}
export default DataTable

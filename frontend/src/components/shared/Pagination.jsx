import { ChevronLeft, ChevronRight } from 'lucide-react'
const Pagination = ({ total, page, perPage, onChange, className='' }) => {
  const lastPage=Math.ceil(total/perPage); const from=(page-1)*perPage+1; const to=Math.min(page*perPage,total)
  if (total<=perPage) return null
  const getPages=()=>{ const delta=2,range=[]; for(let i=Math.max(2,page-delta);i<=Math.min(lastPage-1,page+delta);i++)range.push(i); if(page-delta>2)range.unshift('...'); if(page+delta<lastPage-1)range.push('...'); range.unshift(1); if(lastPage>1)range.push(lastPage); return range }
  const Btn = ({children,active,disabled,...p}) => <button disabled={disabled} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${active?'bg-primary-600 text-white shadow-sm':'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`} {...p}>{children}</button>
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <p className="text-sm text-gray-500 dark:text-gray-400">Affichage de <span className="font-medium text-gray-700 dark:text-gray-300">{from}–{to}</span> sur <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span></p>
      <div className="flex items-center gap-1">
        <Btn onClick={()=>onChange(page-1)} disabled={page===1}><ChevronLeft size={16}/></Btn>
        {getPages().map((p,i)=>p==='...'?<span key={`d${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>:<Btn key={p} onClick={()=>onChange(p)} active={p===page}>{p}</Btn>)}
        <Btn onClick={()=>onChange(page+1)} disabled={page===lastPage}><ChevronRight size={16}/></Btn>
      </div>
    </div>
  )
}
export default Pagination

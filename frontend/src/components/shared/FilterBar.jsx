import { SlidersHorizontal, X } from 'lucide-react'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
const FilterBar = ({ filters=[], values={}, onChange, onReset, className='' }) => {
  const hasActive = filters.some(f=>values[f.key] && values[f.key]!=='')
  return (
    <div className={`flex flex-wrap items-end gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 self-center shrink-0"><SlidersHorizontal size={16}/><span className="text-sm font-medium hidden sm:block">Filtres</span></div>
      {filters.map(f=><Select key={f.key} value={values[f.key]||''} onChange={(e)=>onChange(f.key,e.target.value)} options={f.options} placeholder={f.label} containerClass="min-w-[160px]" className="text-sm"/>)}
      {hasActive && <Button variant="ghost" size="sm" icon={<X size={14}/>} onClick={onReset}>Réinitialiser</Button>}
    </div>
  )
}
export default FilterBar

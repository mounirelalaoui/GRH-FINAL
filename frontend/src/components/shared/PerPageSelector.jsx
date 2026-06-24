import Select from '@/components/ui/Select'
const PerPageSelector = ({ value, onChange }) => (
  <div className="flex items-center gap-2"><span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Par page :</span><Select value={value} onChange={(e)=>onChange(Number(e.target.value))} options={[{value:10,label:'10'},{value:25,label:'25'},{value:50,label:'50'}]} className="text-xs py-1.5 w-20"/></div>
)
export default PerPageSelector

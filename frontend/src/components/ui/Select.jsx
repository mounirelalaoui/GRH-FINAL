import { forwardRef } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'
const Select = forwardRef(({ label, error, required, options=[], placeholder='Sélectionner…', className='', containerClass='', ...props }, ref) => (
  <div className={`space-y-1.5 ${containerClass}`}>
    {label && <label className="form-label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <div className="relative">
      <select ref={ref} className={`form-input appearance-none pr-10 cursor-pointer ${error?'border-red-400 dark:border-red-500':''} ${className}`} {...props}>
        <option value="">{placeholder}</option>
        {options.map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
    </div>
    {error && <p className="form-error"><AlertCircle size={12} className="shrink-0"/>{error}</p>}
  </div>
))
Select.displayName='Select'
export default Select

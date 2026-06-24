import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'
const Input = forwardRef(({ label, error, helper, icon, iconRight, required, className='', containerClass='', ...props }, ref) => (
  <div className={`space-y-1.5 ${containerClass}`}>
    {label && <label className="form-label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</div>}
      <input ref={ref} className={`form-input ${icon?'pl-10':''} ${iconRight?'pr-10':''} ${error?'border-red-400 dark:border-red-500':''} ${className}`} {...props} />
      {iconRight && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{iconRight}</div>}
    </div>
    {error && <p className="form-error"><AlertCircle size={12} className="shrink-0"/>{error}</p>}
    {helper && !error && <p className="text-xs text-gray-400 dark:text-gray-500">{helper}</p>}
  </div>
))
Input.displayName='Input'
export default Input

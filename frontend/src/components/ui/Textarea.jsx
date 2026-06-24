import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'
const Textarea = forwardRef(({ label, error, required, rows=3, className='', containerClass='', ...props }, ref) => (
  <div className={`space-y-1.5 ${containerClass}`}>
    {label && <label className="form-label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <textarea ref={ref} rows={rows} className={`form-input resize-none ${error?'border-red-400 dark:border-red-500':''} ${className}`} {...props} />
    {error && <p className="form-error"><AlertCircle size={12} className="shrink-0"/>{error}</p>}
  </div>
))
Textarea.displayName='Textarea'
export default Textarea

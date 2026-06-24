import { Loader2 } from 'lucide-react'
const VARIANTS = { primary:'bg-primary-600 text-white hover:bg-primary-700 shadow-sm', danger:'bg-red-600 text-white hover:bg-red-700 shadow-sm', ghost:'bg-transparent text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800', success:'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm', outline:'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20' }
const SIZES = { xs:'px-2.5 py-1.5 text-xs gap-1.5 rounded-lg', sm:'px-3 py-2 text-sm gap-2 rounded-lg', md:'px-4 py-2.5 text-sm gap-2 rounded-xl', lg:'px-6 py-3 text-base gap-2.5 rounded-xl' }
const Button = ({ children, variant='primary', size='md', loading=false, fullWidth=false, icon, iconRight, disabled, className='', ...props }) => (
  <button disabled={disabled||loading} className={`inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth?'w-full':''} ${className}`} {...props}>
    {loading ? <Loader2 size={size==='lg'?18:16} className="animate-spin shrink-0"/> : icon && <span className="shrink-0">{icon}</span>}
    {children}
    {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
  </button>
)
export default Button

import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
const PageHeader = ({ title, subtitle, breadcrumb=[], actions, className='' }) => (
  <div className={`mb-6 ${className}`}>
    {breadcrumb.length>0 && <nav className="flex items-center gap-1.5 mb-3 flex-wrap">
      <Link to="/dashboard" className="text-gray-400 dark:text-gray-500 hover:text-gray-600"><Home size={13}/></Link>
      {breadcrumb.map((c,i)=><span key={i} className="flex items-center gap-1.5"><ChevronRight size={13} className="text-gray-300 dark:text-gray-600"/>{c.path && i<breadcrumb.length-1?<Link to={c.path} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 font-medium">{c.label}</Link>:<span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{c.label}</span>}</span>)}
    </nav>}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div><h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>{subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}</div>
      {actions && <div className="flex items-center gap-3 shrink-0 flex-wrap">{actions}</div>}
    </div>
  </div>
)
export default PageHeader

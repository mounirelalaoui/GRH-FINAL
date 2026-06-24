import { SearchX, FolderOpen, AlertCircle } from 'lucide-react'
import Button from './Button'
const PRESETS = { search:{icon:<SearchX size={40}/>,color:'text-gray-400'}, empty:{icon:<FolderOpen size={40}/>,color:'text-gray-400'}, error:{icon:<AlertCircle size={40}/>,color:'text-red-400'} }
const EmptyState = ({ type='empty', title='Aucun résultat', message='Aucune donnée à afficher.', action, actionLabel, icon, className='' }) => {
  const preset=PRESETS[type]||PRESETS.empty
  return <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}><div className={`mb-4 ${preset.color} opacity-60`}>{icon??preset.icon}</div><h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3><p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed mb-6">{message}</p>{action && actionLabel && <Button onClick={action} size="sm">{actionLabel}</Button>}</div>
}
export default EmptyState

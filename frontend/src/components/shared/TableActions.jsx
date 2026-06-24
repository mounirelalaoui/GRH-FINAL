import { Eye, Pencil, Trash2 } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
const TableActions = ({ onView, onEdit, onDelete, canEdit=true, canDelete=true }) => (
  <div className="flex items-center justify-center gap-1">
    {onView && <Tooltip content="Voir"><button onClick={onView} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"><Eye size={14}/></button></Tooltip>}
    {onEdit && canEdit && <Tooltip content="Modifier"><button onClick={onEdit} className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30"><Pencil size={14}/></button></Tooltip>}
    {onDelete && canDelete && <Tooltip content="Supprimer"><button onClick={onDelete} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={14}/></button></Tooltip>}
  </div>
)
export default TableActions

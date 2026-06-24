import { Download } from 'lucide-react'
import Button from '@/components/ui/Button'
import { exportCSV } from '@/utils/helpers'
import toast from 'react-hot-toast'
import { useState } from 'react'
const ExportButton = ({ fetchAll, mapper, filename='export', size='sm', className='' }) => {
  const [loading,setLoading]=useState(false)
  const handleExport = async () => { setLoading(true); try{ const data=await fetchAll(); exportCSV(data.map(mapper),`${filename}.csv`); toast.success('Export CSV généré.') } catch{ toast.error("Erreur lors de l'export.") } finally{ setLoading(false) } }
  return <Button variant="ghost" size={size} icon={<Download size={15}/>} onClick={handleExport} loading={loading} className={className}>Export CSV</Button>
}
export default ExportButton

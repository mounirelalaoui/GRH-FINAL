import { useQuery, useMutation, useQueryClient } from 'react-query'
import personnelService from '@/services/personnelService'
import { QK } from '@/utils/queryKeys'
import { confirmDelete } from '@/components/shared/ConfirmDialog'
import toast from 'react-hot-toast'
export const usePersonnels = (params={}) => {
  const qc=useQueryClient()
  const query=useQuery(QK.personnels(params),()=>personnelService.getAll(params),{keepPreviousData:true,staleTime:2*60*1000,select:(res)=>({data:res.data??[],total:res.meta?.total??res.total??0})})
  const deleteMutation=useMutation((id)=>personnelService.remove(id),{onSuccess:()=>{toast.success('Personnel supprimé.');qc.invalidateQueries(['personnels'])}})
  const handleDelete=async(row)=>{ const ok=await confirmDelete(`${row.prenom} ${row.nom}`); if(!ok)return; deleteMutation.mutate(row.idPersonnel) }
  return {data:query.data?.data??[],total:query.data?.total??0,isLoading:query.isLoading,isFetching:query.isFetching,isError:query.isError,refetch:query.refetch,handleDelete,isDeleting:deleteMutation.isLoading}
}
export const usePersonnel = (id) => { const q=useQuery(QK.personnel(id),()=>personnelService.getById(id),{enabled:!!id,staleTime:5*60*1000}); return {personnel:q.data,isLoading:q.isLoading,isError:q.isError,refetch:q.refetch} }

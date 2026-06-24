import { useQuery, useMutation, useQueryClient } from 'react-query'
import congeService from '@/services/congeService'
import { QK } from '@/utils/queryKeys'
import { confirmDelete, confirmAction } from '@/components/shared/ConfirmDialog'
import toast from 'react-hot-toast'
export const useConges = (params={}) => {
  const qc=useQueryClient()
  const query=useQuery(QK.conges(params),()=>congeService.getAll(params),{keepPreviousData:true,staleTime:2*60*1000,select:(res)=>({data:res.data??[],total:res.meta?.total??res.total??0})})
  const statutMutation=useMutation(({id,statut})=>congeService.updateStatut(id,statut),{onSuccess:(_,{statut})=>{toast.success(statut==='approuve'?'Congé approuvé.':'Congé refusé.');qc.invalidateQueries(['conges'])}})
  const deleteMutation=useMutation((id)=>congeService.remove(id),{onSuccess:()=>{toast.success('Congé supprimé.');qc.invalidateQueries(['conges'])}})
  const handleStatut=async(row,statut)=>{ const ok=await confirmAction({title:'Confirmer',text:`Voulez-vous ${statut==='approuve'?'approuver':'refuser'} ce congé ?`,confirmText:statut==='approuve'?'Approuver':'Refuser',confirmColor:statut==='approuve'?'#059669':'#dc2626'}); if(!ok)return; statutMutation.mutate({id:row.idConge,statut}) }
  const handleDelete=async(row)=>{ const ok=await confirmDelete(`le congé`); if(!ok)return; deleteMutation.mutate(row.idConge) }
  return {data:query.data?.data??[],total:query.data?.total??0,isLoading:query.isLoading,isFetching:query.isFetching,refetch:query.refetch,handleStatut,handleDelete}
}

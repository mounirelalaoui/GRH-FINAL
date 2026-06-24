import { useQuery } from 'react-query'
import etablissementService from '@/services/etablissementService'
import specialiteService    from '@/services/specialiteService'
import diplomeService       from '@/services/diplomeService'
import { QK } from '@/utils/queryKeys'
export const useReferentiel = () => {
  const opts={staleTime:30*60*1000}
  const etabQ=useQuery(QK.etablissements(),()=>etablissementService.getAll(),{...opts,select:(r)=>(r.data||r).map(e=>({value:e.idEtab,label:e.nom,raw:e}))})
  const specQ=useQuery(QK.specialites(),   ()=>specialiteService.getAll(),   {...opts,select:(r)=>(r.data||r).map(s=>({value:s.idSpecialite,label:s.nom_specialite,raw:s}))})
  const dipQ =useQuery(QK.diplomes(),      ()=>diplomeService.getAll(),      {...opts,select:(r)=>(r.data||r).map(d=>({value:d.idDiplome,label:d.nom_diplome,raw:d}))})
  return {etablissements:etabQ.data??[],specialites:specQ.data??[],diplomes:dipQ.data??[],isLoading:etabQ.isLoading||specQ.isLoading||dipQ.isLoading}
}

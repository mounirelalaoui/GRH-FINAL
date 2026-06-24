import { useQueries } from 'react-query'
import dashboardService from '@/services/dashboardService'
import { QK } from '@/utils/queryKeys'
export const useDashboard = () => {
  const results=useQueries([
    {queryKey:QK.dashboard.stats,  queryFn:dashboardService.getStats,       staleTime:5*60*1000},
    {queryKey:QK.dashboard.charts, queryFn:dashboardService.getCharts,      staleTime:10*60*1000},
    {queryKey:QK.dashboard.recent, queryFn:dashboardService.getRecent,      staleTime:2*60*1000},
    {queryKey:QK.dashboard.topAbs, queryFn:dashboardService.getTopAbsences, staleTime:5*60*1000},
  ])
  const [sQ,cQ,rQ,tQ]=results
  return {stats:sQ.data,charts:cQ.data,recent:rQ.data,topAbsences:tQ.data,isLoading:results.some(r=>r.isLoading),isError:results.some(r=>r.isError),refetchAll:()=>results.forEach(r=>r.refetch())}
}

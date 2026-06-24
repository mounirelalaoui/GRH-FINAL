import api from '@/api/axiosInstance'
import { ENDPOINTS } from '@/api/endpoints'
import { buildParams } from '@/utils/helpers'
const congeService = {
  getAll:       async (p={}) => { const {data}=await api.get(ENDPOINTS.CONGES.BASE,{params:buildParams(p)}); return data },
  getById:      async (id)   => { const {data}=await api.get(ENDPOINTS.CONGES.BY_ID(id)); return data },
  create:       async (p)    => { const {data}=await api.post(ENDPOINTS.CONGES.BASE,p); return data },
  update:       async (id,p) => { const {data}=await api.put(ENDPOINTS.CONGES.BY_ID(id),p); return data },
  updateStatut: async (id,s) => { const {data}=await api.patch(ENDPOINTS.CONGES.STATUT(id),{statut:s}); return data },
  remove:       async (id)   => { const {data}=await api.delete(ENDPOINTS.CONGES.BY_ID(id)); return data },
}
export default congeService

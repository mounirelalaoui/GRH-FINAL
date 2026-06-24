import api from '@/api/axiosInstance'
import { ENDPOINTS } from '@/api/endpoints'
import { buildParams } from '@/utils/helpers'
const service = {
  getAll:  async (p={}) => { const {data}=await api.get(ENDPOINTS.USERS.BASE,{params:buildParams(p)}); return data },
  getById: async (id)    => { const {data}=await api.get(ENDPOINTS.USERS.BY_ID?.(id)??ENDPOINTS.USERS.BASE+'/'+id); return data },
  create:  async (p)     => { const {data}=await api.post(ENDPOINTS.USERS.BASE,p); return data },
  update:  async (id,p)  => { const {data}=await api.put((ENDPOINTS.USERS.BY_ID?.(id)??ENDPOINTS.USERS.BASE+'/'+id),p); return data },
  remove:  async (id)    => { const {data}=await api.delete(ENDPOINTS.USERS.BY_ID?.(id)??ENDPOINTS.USERS.BASE+'/'+id); return data },
}
export default service

import api from '@/api/axiosInstance'
import { ENDPOINTS } from '@/api/endpoints'
import { buildParams } from '@/utils/helpers'
const service = {
  getAll:  async (p={}) => { const {data}=await api.get(ENDPOINTS.DIPLOMES.BASE,{params:buildParams(p)}); return data },
  getById: async (id)    => { const {data}=await api.get(ENDPOINTS.DIPLOMES.BY_ID?.(id)??ENDPOINTS.DIPLOMES.BASE+'/'+id); return data },
  create:  async (p)     => { const {data}=await api.post(ENDPOINTS.DIPLOMES.BASE,p); return data },
  update:  async (id,p)  => { const {data}=await api.put((ENDPOINTS.DIPLOMES.BY_ID?.(id)??ENDPOINTS.DIPLOMES.BASE+'/'+id),p); return data },
  remove:  async (id)    => { const {data}=await api.delete(ENDPOINTS.DIPLOMES.BY_ID?.(id)??ENDPOINTS.DIPLOMES.BASE+'/'+id); return data },
}
export default service

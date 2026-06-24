import api from '@/api/axiosInstance'
import { ENDPOINTS } from '@/api/endpoints'
import { buildParams } from '@/utils/helpers'
const buildFD = (p) => { const fd=new FormData(); Object.entries(p).forEach(([k,v])=>{ if(v==null)return; if(Array.isArray(v)) v.forEach(x=>fd.append(`${k}[]`,x)); else fd.append(k,v) }); return fd }
const personnelService = {
  getAll:       async (p={}) => { const {data}=await api.get(ENDPOINTS.PERSONNELS.BASE,{params:buildParams(p)}); return data },
  getById:      async (id)   => { const {data}=await api.get(ENDPOINTS.PERSONNELS.BY_ID(id)); return data },
  create:       async (p)    => { const fd=buildFD(p); const {data}=await api.post(ENDPOINTS.PERSONNELS.BASE,fd,{headers:{'Content-Type':'multipart/form-data'}}); return data },
  update:       async (id,p) => { const fd=buildFD(p); fd.append('_method','PUT'); const {data}=await api.post(ENDPOINTS.PERSONNELS.BY_ID(id),fd,{headers:{'Content-Type':'multipart/form-data'}}); return data },
  remove:       async (id)   => { const {data}=await api.delete(ENDPOINTS.PERSONNELS.BY_ID(id)); return data },
  getConges:    async (id,p={}) => { const {data}=await api.get(ENDPOINTS.PERSONNELS.CONGES(id),{params:p}); return data },
  getAbsences:  async (id,p={}) => { const {data}=await api.get(ENDPOINTS.PERSONNELS.ABSENCES(id),{params:p}); return data },
  getDiplomes:  async (id)   => { const {data}=await api.get(ENDPOINTS.PERSONNELS.DIPLOMES(id)); return data },
  getSpecialites: async (id) => { const {data}=await api.get(ENDPOINTS.PERSONNELS.SPECIALITES(id)); return data },
}
export default personnelService

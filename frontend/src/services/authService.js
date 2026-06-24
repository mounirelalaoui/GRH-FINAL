import api from '@/api/axiosInstance'
import { ENDPOINTS } from '@/api/endpoints'
import { storage } from '@/utils/storage'
const authService = {
  login: async (c) => { const {data}=await api.post(ENDPOINTS.AUTH.LOGIN,c); storage.set(storage.KEYS.TOKEN,data.token); storage.set(storage.KEYS.USER,data.user); return data },
  logout: async () => { try{await api.post(ENDPOINTS.AUTH.LOGOUT)}finally{storage.remove(storage.KEYS.TOKEN);storage.remove(storage.KEYS.USER)} },
  getMe: async () => { const {data}=await api.get(ENDPOINTS.AUTH.ME); return data },
  isAuthenticated: () => !!storage.get(storage.KEYS.TOKEN),
  getStoredUser:   () => storage.get(storage.KEYS.USER),
}
export default authService

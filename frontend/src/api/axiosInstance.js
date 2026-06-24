import axios from 'axios'
import toast  from 'react-hot-toast'
import { API_BASE_URL, ERROR_MESSAGES } from '@/utils/constants'
import { storage } from '@/utils/storage'

const api = axios.create({ baseURL:API_BASE_URL, timeout:20000, headers:{'Content-Type':'application/json','Accept':'application/json','X-Requested-With':'XMLHttpRequest'} })
let isRedirecting = false

api.interceptors.request.use((config) => {
  const token = storage.get(storage.KEYS.TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => Promise.reject(error))

api.interceptors.response.use((response) => response, (error) => {
  const status = error.response?.status
  const data   = error.response?.data
  switch (status) {
    case 401:
      if (!isRedirecting) {
        isRedirecting = true
        storage.remove(storage.KEYS.TOKEN); storage.remove(storage.KEYS.USER)
        toast.error(ERROR_MESSAGES.SESSION, {id:'session-expired'})
        setTimeout(()=>{ window.location.href='/login'; isRedirecting=false }, 500)
      }
      break
    case 403:  toast.error(ERROR_MESSAGES.FORBIDDEN, {id:'forbidden'}); break
    case 404:  toast.error(ERROR_MESSAGES.NOT_FOUND, {id:'not-found'}); break
    case 422: {
      const errors = data?.errors
      if (errors) Object.values(errors).flat().slice(0,3).forEach(m=>toast.error(m,{duration:5000}))
      else toast.error(data?.message??'Données invalides.')
      break
    }
    case 500: case 502: case 503: toast.error(ERROR_MESSAGES.SERVER,{id:'server-error'}); break
    default: if (!error.response) toast.error(ERROR_MESSAGES.NETWORK,{id:'network-error'})
  }
  return Promise.reject(error)
})
export default api

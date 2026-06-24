import { useState } from 'react'
export const usePagination = (ip=1,ipp=10) => { const [page,setPage]=useState(ip); const [perPage,setPerPage]=useState(ipp); return {page,perPage,setPage,setPerPage,reset:()=>setPage(1)} }

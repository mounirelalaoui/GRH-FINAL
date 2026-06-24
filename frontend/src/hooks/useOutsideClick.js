import { useEffect } from 'react'
export const useOutsideClick = (ref,handler) => { useEffect(()=>{ const l=(e)=>{ if(!ref.current||ref.current.contains(e.target))return; handler(e) }; document.addEventListener('mousedown',l); return ()=>document.removeEventListener('mousedown',l) },[ref,handler]) }

import { useState } from 'react'
const POS = { top:'bottom-full left-1/2 -translate-x-1/2 mb-2', bottom:'top-full left-1/2 -translate-x-1/2 mt-2' }
const Tooltip = ({ children, content, position='top', className='' }) => {
  const [v,setV]=useState(false)
  return <div className={`relative inline-flex ${className}`} onMouseEnter={()=>setV(true)} onMouseLeave={()=>setV(false)}>{children}{v && content && <div className={`absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-xl whitespace-nowrap pointer-events-none animate-fade-in ${POS[position]}`}>{content}</div>}</div>
}
export default Tooltip

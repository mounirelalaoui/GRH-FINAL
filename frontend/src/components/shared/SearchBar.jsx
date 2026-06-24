import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
const SearchBar = ({ onSearch, placeholder='Rechercher…', debounce=300, className='', defaultValue='' }) => {
  const [value,setValue]=useState(defaultValue); const debounced=useDebounce(value,debounce)
  useEffect(()=>{ onSearch(debounced) },[debounced])
  return (
    <div className={`relative ${className}`}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
      <input value={value} onChange={e=>setValue(e.target.value)} placeholder={placeholder} className="form-input pl-9 pr-10 w-full"/>
      {value && <button onClick={()=>setValue('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-gray-600"><X size={14}/></button>}
    </div>
  )
}
export default SearchBar

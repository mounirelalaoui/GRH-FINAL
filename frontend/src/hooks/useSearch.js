import { useState, useCallback } from 'react'
import { useDebounce } from './useDebounce'
export const useSearch = (delay=300) => { const [searchValue,setSearchValue]=useState(''); const debouncedSearch=useDebounce(searchValue,delay); const handleSearch=useCallback((v)=>setSearchValue(v),[]); const clearSearch=useCallback(()=>setSearchValue(''),[]); return {searchValue,debouncedSearch,handleSearch,clearSearch,hasSearch:searchValue.length>0} }

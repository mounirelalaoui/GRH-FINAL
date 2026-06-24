import { useCallback } from 'react'
import { usePagination } from './usePagination'
import { useFilter }     from './useFilter'
import { useSort }       from './useSort'
import { useSearch }     from './useSearch'
export const useTableState = ({initialFilters={},defaultSort='id',defaultDir='asc',debounce=300}={}) => {
  const pagination=usePagination(); const filter=useFilter(initialFilters); const sort=useSort(defaultSort,defaultDir); const search=useSearch(debounce)
  const handleFilter=useCallback((k,v)=>{filter.setFilter(k,v);pagination.reset()},[filter,pagination])
  const handleSearch=useCallback((v)=>{search.handleSearch(v);pagination.reset()},[search,pagination])
  const handleSort=useCallback((k)=>{sort.handleSort(k);pagination.reset()},[sort,pagination])
  const handleReset=useCallback(()=>{filter.resetFilters();search.clearSearch();pagination.reset()},[filter,search,pagination])
  const apiParams={page:pagination.page,per_page:pagination.perPage,search:search.debouncedSearch,...filter.filters,...sort.sortParams}
  return {page:pagination.page,perPage:pagination.perPage,setPage:pagination.setPage,setPerPage:pagination.setPerPage,filters:filter.filters,activeFilters:filter.activeCount,handleFilter,sortKey:sort.sortKey,sortDir:sort.sortDir,handleSort,searchValue:search.searchValue,handleSearch,handleReset,apiParams}
}

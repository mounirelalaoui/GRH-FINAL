export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})
}
export const getInitials = (prenom,nom) => {
  const p=prenom?.charAt(0)?.toUpperCase()||''; const n=nom?.charAt(0)?.toUpperCase()||''; return `${p}${n}`
}
export const diffDays = (debut,fin) => {
  if (!debut||!fin) return 0
  return Math.ceil((new Date(fin)-new Date(debut))/(1000*60*60*24))+1
}
export const truncate = (str,n=30) => str?.length>n?`${str.slice(0,n)}…`:str||'—'
export const buildParams = (obj) => {
  const p=new URLSearchParams()
  Object.entries(obj).forEach(([k,v])=>{ if(v!==undefined&&v!==null&&v!=='') p.append(k,v) })
  return p
}
export const exportCSV = (data,filename='export.csv') => {
  if (!data?.length) return
  const headers=Object.keys(data[0]).join(',')
  const rows=data.map(r=>Object.values(r).map(v=>typeof v==='string'?`"${v.replace(/"/g,'""')}"`??v:v).join(','))
  const csv=[headers,...rows].join('\n')
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'})
  const url=URL.createObjectURL(blob)
  const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url)
}

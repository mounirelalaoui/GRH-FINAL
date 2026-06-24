import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Pencil, ArrowLeft, Award } from 'lucide-react'
import PageHeader   from '@/components/shared/PageHeader'
import Button       from '@/components/ui/Button'
import Badge        from '@/components/ui/Badge'
import Avatar       from '@/components/ui/Avatar'
import DataTable    from '@/components/shared/DataTable'
import { Skeleton } from '@/components/ui/Skeleton'
import personnelService from '@/services/personnelService'
import { useAuth }  from '@/context/AuthContext'
import { formatDate, diffDays } from '@/utils/helpers'

const PersonnelDetail = () => {
  const { id } = useParams(); const navigate=useNavigate(); const { isDirecteur } = useAuth()
  const [tab,setTab]=useState('infos'); const [data,setData]=useState(null)
  const [conges,setConges]=useState([]); const [absences,setAbsences]=useState([]); const [diplomes,setDiplomes]=useState([]); const [loading,setLoading]=useState(true)

  useEffect(()=>{ const load=async()=>{ setLoading(true); try{
      const [p,c,a,d]=await Promise.all([personnelService.getById(id),personnelService.getConges(id),personnelService.getAbsences(id),personnelService.getDiplomes(id)])
      setData(p); setConges(c.data||c); setAbsences(a.data||a); setDiplomes(d.data||d)
    } catch{ navigate('/personnels') } finally{ setLoading(false) } }; load() },[id])

  if (loading) return <div className="space-y-6"><div className="card p-6"><div className="flex gap-6"><Skeleton className="w-20 h-20 rounded-2xl"/><div className="flex-1 space-y-3"><Skeleton className="h-6 w-48"/><Skeleton className="h-4 w-32"/></div></div></div></div>

  const TABS=[{key:'infos',label:'Informations'},{key:'conges',label:`Congés (${conges.length})`},{key:'absences',label:`Absences (${absences.length})`},{key:'diplomes',label:`Diplômes (${diplomes.length})`}]

  return (
    <div className="space-y-6">
      <PageHeader title={`${data?.prenom} ${data?.nom}`} subtitle={`CIN : ${data?.CIN}`} breadcrumb={[{label:'Personnels',path:'/personnels'},{label:`${data?.prenom} ${data?.nom}`}]}
        actions={<><Button variant="ghost" size="sm" icon={<ArrowLeft size={15}/>} onClick={()=>navigate('/personnels')}>Retour</Button>{isDirecteur && <Button size="sm" icon={<Pencil size={15}/>} onClick={()=>navigate(`/personnels/${id}/edit`)}>Modifier</Button>}</>}/>
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Avatar prenom={data?.prenom} nom={data?.nom} size="xl"/>
          <div className="flex-1 space-y-4">
            <div><h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{data?.prenom} {data?.nom}</h2><p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{data?.grade??'Grade non renseigné'}</p></div>
            <div className="flex flex-wrap gap-2"><Badge status={data?.type_personnel}/><Badge status={data?.statut} dot/>{data?.etablissement && <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full font-medium">🏢 {data.etablissement.nom}</span>}</div>
          </div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">{TABS.map(t=><button key={t.key} onClick={()=>setTab(t.key)} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${tab===t.key?'border-primary-500 text-primary-600 dark:text-primary-400':'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>{t.label}</button>)}</div>
        <div className="p-6">
          {tab==='infos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[{title:'Identité',rows:[['Nom complet',`${data?.prenom} ${data?.nom}`],['CIN',data?.CIN],['Date naissance',formatDate(data?.date_naissance)],['Situation fam.',data?.situation_familiale]]},
                {title:'Poste',rows:[['Fonction',data?.fonction],['Grade',data?.grade],['Établissement',data?.etablissement?.nom],['Spécialité',data?.specialite?.nom_specialite]]},
                {title:'Contact',rows:[['Téléphone',data?.telephone],['Adresse',data?.adresse_actuelle]]}].map(group=>(
                <div key={group.title} className="space-y-3"><h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-700">{group.title}</h3>{group.rows.map(([label,value])=><div key={label} className="flex items-start justify-between gap-4"><span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-32">{label}</span><span className="text-sm text-gray-700 dark:text-gray-300 font-medium text-right">{value??'—'}</span></div>)}</div>
              ))}
            </div>
          )}
          {tab==='conges' && <DataTable columns={[{key:'type_conge',label:'Type'},{key:'date_debut',label:'Début',render:v=>formatDate(v)},{key:'date_fin',label:'Fin',render:v=>formatDate(v)},{key:'duree',label:'Durée',render:(_,row)=>`${diffDays(row.date_debut,row.date_fin)} j`},{key:'statut',label:'Statut',render:v=><Badge status={v} dot/>}]} data={conges} emptyTitle="Aucun congé" emptyMessage="Aucun congé enregistré."/>}
          {tab==='absences' && <DataTable columns={[{key:'date_absence',label:'Date',render:v=>formatDate(v)},{key:'motif',label:'Motif',render:v=>v??'—'}]} data={absences} emptyTitle="Aucune absence" emptyMessage="Aucune absence enregistrée."/>}
          {tab==='diplomes' && (diplomes.length===0 ? <p className="text-sm text-gray-400 italic text-center py-8">Aucun diplôme enregistré.</p> : <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{diplomes.map(d=><div key={d.idDiplome} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"><div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0"><Award size={16}/></div><span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{d.nom_diplome}</span></div>)}</div>)}
        </div>
      </div>
    </div>
  )
}
export default PersonnelDetail

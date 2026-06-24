import { Users, CalendarDays, UserX, Building2, GraduationCap, Award, TrendingUp, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import StatCard   from '@/components/shared/StatCard'
import Avatar     from '@/components/ui/Avatar'
import Badge      from '@/components/ui/Badge'
import { StatCardSkeleton } from '@/components/ui/Skeleton'
import { useDashboard } from '@/hooks/useDashboard'
import { formatDate }   from '@/utils/helpers'
import { useAuth }      from '@/context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const { stats, charts, recent, topAbsences, isLoading } = useDashboard()
  const safeStats = stats ?? {}
  const absencesChart = charts?.absences_chart ?? []
  const typeChart      = charts?.type_chart ?? []
  const recentList     = recent ?? []
  const topList        = topAbsences ?? []

  const greeting = () => { const h=new Date().getHours(); return h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir' }

  return (
    <div className="space-y-8">
      <PageHeader title={`${greeting()}, ${user?.username} 👋`} subtitle={new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}/>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({length:8}).map((_,i)=><StatCardSkeleton key={i}/>) : (
          <>
            <StatCard title="Total personnels" value={safeStats.total_personnels??0} icon={<Users size={22}/>} iconBg="bg-blue-100 dark:bg-blue-900/40" iconColor="text-blue-600 dark:text-blue-400"/>
            <StatCard title="Formateurs" value={safeStats.formateurs??0} icon={<GraduationCap size={22}/>} iconBg="bg-indigo-100 dark:bg-indigo-900/40" iconColor="text-indigo-600 dark:text-indigo-400"/>
            <StatCard title="Absences / mois" value={safeStats.absences_mois??0} icon={<UserX size={22}/>} iconBg="bg-red-100 dark:bg-red-900/40" iconColor="text-red-600 dark:text-red-400"/>
            <StatCard title="Congés en cours" value={safeStats.conges_en_cours??0} icon={<CalendarDays size={22}/>} iconBg="bg-emerald-100 dark:bg-emerald-900/40" iconColor="text-emerald-600 dark:text-emerald-400"/>
            <StatCard title="Établissements" value={safeStats.etablissements??0} icon={<Building2 size={22}/>} iconBg="bg-amber-100 dark:bg-amber-900/40" iconColor="text-amber-600 dark:text-amber-400"/>
            <StatCard title="Spécialités" value={safeStats.specialites??0} icon={<Award size={22}/>} iconBg="bg-purple-100 dark:bg-purple-900/40" iconColor="text-purple-600 dark:text-purple-400"/>
            <StatCard title="Diplômes" value={safeStats.diplomes??0} icon={<TrendingUp size={22}/>} iconBg="bg-cyan-100 dark:bg-cyan-900/40" iconColor="text-cyan-600 dark:text-cyan-400"/>
            <StatCard title="En attente" value={safeStats.conges_en_attente??0} icon={<Clock size={22}/>} iconBg="bg-orange-100 dark:bg-orange-900/40" iconColor="text-orange-600 dark:text-orange-400"/>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6"><div><h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Absences par mois</h2><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Année {new Date().getFullYear()}</p></div></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={absencesChart} margin={{top:0,right:0,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false}/>
              <XAxis dataKey="mois" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip contentStyle={{background:'#1e293b',border:'none',borderRadius:'10px',fontSize:'12px',color:'#f1f5f9'}}/>
              <Bar dataKey="absences" fill="#3b82f6" radius={[6,6,0,0]} maxBarSize={36}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6 flex flex-col">
          <div className="mb-6"><h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Répartition du personnel</h2></div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={typeChart} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">{typeChart.map((e,i)=><Cell key={i} fill={e.color} strokeWidth={0}/>)}</Pie><Tooltip contentStyle={{background:'#1e293b',border:'none',borderRadius:'10px',fontSize:'12px',color:'#f1f5f9'}}/></PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-2">{typeChart.map(e=><div key={e.name} className="flex items-center justify-between text-sm px-1"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0" style={{background:e.color}}/><span className="text-gray-600 dark:text-gray-400 text-xs">{e.name}</span></div><span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">{e.value}</span></div>)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700"><h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Top 5 — Absences</h2></div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {topList.map((p,i)=>(
              <div key={p.idPersonnel} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <span className={`w-6 text-center text-xs font-bold shrink-0 ${i===0?'text-amber-500':i===1?'text-gray-400':i===2?'text-amber-700':'text-gray-300 dark:text-gray-600'}`}>#{i+1}</span>
                <Avatar prenom={p.prenom} nom={p.nom} size="sm"/>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{p.prenom} {p.nom}</p><p className="text-xs text-gray-400 dark:text-gray-500 truncate">{p.etablissement}</p></div>
                <div className="flex items-center gap-1.5 shrink-0"><span className="text-sm font-bold text-red-500">{p.total}</span><span className="text-xs text-gray-400">absences</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700"><h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Activité récente</h2></div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentList.map((item,i)=>(
              <div key={i} className="flex items-start gap-4 px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 ${item.type==='conge'?'bg-blue-100 dark:bg-blue-900/40':'bg-red-100 dark:bg-red-900/40'}`}>{item.type==='conge'?'📋':'⚠️'}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.nom} · {formatDate(item.date)}</p></div>
                {item.statut && <Badge status={item.statut} size="sm" dot/>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard

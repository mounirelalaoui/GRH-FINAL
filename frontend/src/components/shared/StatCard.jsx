import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
const TREND = { up:{icon:<TrendingUp size={13}/>,color:'text-emerald-600 dark:text-emerald-400'}, down:{icon:<TrendingDown size={13}/>,color:'text-red-500 dark:text-red-400'}, neutral:{icon:<Minus size={13}/>,color:'text-gray-400 dark:text-gray-500'} }
const StatCard = ({ title, value, icon, iconBg='bg-blue-100 dark:bg-blue-900/40', iconColor='text-blue-600 dark:text-blue-400', trend, trendLabel, onClick, loading=false, className='' }) => {
  const t = trend ? TREND[trend] : null
  return (
    <div onClick={onClick} className={`card p-5 flex flex-col gap-4 ${onClick?'cursor-pointer hover:shadow-md transition-all duration-200':''} ${className}`}>
      <div className="flex items-start justify-between"><div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}><span className={iconColor}>{icon}</span></div></div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{loading ? <span className="inline-block w-16 h-7 skeleton rounded-lg"/> : value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        {trendLabel && <p className={`text-xs mt-1.5 flex items-center gap-1 ${t?.color??'text-gray-400'}`}>{t?.icon}{trendLabel}</p>}
      </div>
    </div>
  )
}
export default StatCard

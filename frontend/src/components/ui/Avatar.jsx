import { getInitials } from '@/utils/helpers'
const COLORS=['bg-blue-500','bg-purple-500','bg-emerald-500','bg-rose-500','bg-amber-500','bg-cyan-500','bg-indigo-500']
const getColor=(s='')=>COLORS[s.charCodeAt(0)%COLORS.length]
const SIZES={xs:'w-6 h-6 text-[10px] rounded-lg',sm:'w-8 h-8 text-xs rounded-lg',md:'w-10 h-10 text-sm rounded-xl',lg:'w-14 h-14 text-lg rounded-2xl',xl:'w-20 h-20 text-2xl rounded-2xl'}
const Avatar = ({ prenom, nom, src, size='md', className='' }) => {
  if (src) return <img src={src} alt={`${prenom} ${nom}`} className={`object-cover shrink-0 ${SIZES[size]} ${className}`}/>
  return <div className={`${SIZES[size]} ${getColor(`${prenom}${nom}`)} flex items-center justify-center font-bold text-white shrink-0 ${className}`}>{getInitials(prenom,nom)}</div>
}
export default Avatar

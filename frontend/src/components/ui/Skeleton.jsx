export const Skeleton = ({ className='' }) => <div className={`skeleton ${className}`} />
export const TableRowSkeleton = ({ cols=5 }) => <tr>{Array.from({length:cols}).map((_,i)=><td key={i} className="px-4 py-3 border-t border-gray-100 dark:border-gray-700"><Skeleton className={`h-4 ${i===0?'w-32':'w-20'}`}/></td>)}</tr>
export const StatCardSkeleton = () => <div className="card p-5 space-y-3"><div className="flex justify-between"><Skeleton className="h-10 w-10 rounded-xl"/><Skeleton className="h-5 w-16 rounded-full"/></div><Skeleton className="h-8 w-20"/><Skeleton className="h-4 w-28"/></div>
export const FormSkeleton = ({ fields=4 }) => <div className="space-y-5">{Array.from({length:fields}).map((_,i)=><div key={i} className="space-y-2"><Skeleton className="h-4 w-24"/><Skeleton className="h-10 w-full rounded-lg"/></div>)}</div>
export default Skeleton

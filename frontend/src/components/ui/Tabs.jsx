import { useState } from 'react'
const Tabs = ({ tabs=[], defaultTab, onChange, className='' }) => {
  const [active,setActive]=useState(defaultTab??tabs[0]?.key)
  const handleChange=(k)=>{setActive(k);onChange?.(k)}
  const current=tabs.find(t=>t.key===active)
  return (
    <div className={className}>
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab=><button key={tab.key} onClick={()=>handleChange(tab.key)} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${tab.key===active?'border-primary-500 text-primary-600 dark:text-primary-400':'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>{tab.icon}{tab.label}{tab.count!==undefined && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab.key===active?'bg-primary-100 dark:bg-primary-900/40 text-primary-600':'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{tab.count}</span>}</button>)}
      </div>
      {current?.content && <div className="animate-fade-in">{current.content}</div>}
    </div>
  )
}
export default Tabs

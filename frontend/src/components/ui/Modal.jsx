import { useEffect, useRef } from 'react'
import { createPortal }   from 'react-dom'
import { X }               from 'lucide-react'
const SIZES = { sm:'max-w-sm', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl' }
const Modal = ({ isOpen, onClose, title, children, footer, size='md', hideClose=false }) => {
  const overlayRef = useRef(null)
  useEffect(() => { if(!isOpen)return; const h=(e)=>{if(e.key==='Escape')onClose()}; document.addEventListener('keydown',h); return ()=>document.removeEventListener('keydown',h) }, [isOpen,onClose])
  useEffect(() => { document.body.style.overflow=isOpen?'hidden':''; return ()=>{document.body.style.overflow=''} }, [isOpen])
  if (!isOpen) return null
  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onMouseDown={(e)=>{if(e.target===overlayRef.current)onClose()}}>
      <div className={`w-full ${SIZES[size]} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh] animate-scale-in`}>
        {(title || !hideClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>}
            {!hideClose && <button onClick={onClose} className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"><X size={18}/></button>}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 shrink-0 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">{footer}</div>}
      </div>
    </div>, document.body
  )
}
export default Modal

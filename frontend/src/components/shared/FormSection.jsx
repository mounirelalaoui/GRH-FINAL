const FormSection = ({ title, icon, children, className='' }) => (
  <div className={`card overflow-hidden ${className}`}>
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">{icon && <span className="text-primary-600 dark:text-primary-400 shrink-0">{icon}</span>}<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3></div>
    <div className="p-6">{children}</div>
  </div>
)
export default FormSection

const SIZES={sm:'w-4 h-4 border-2',md:'w-6 h-6 border-2',lg:'w-10 h-10 border-[3px]'}
const Spinner = ({ size='md', className='' }) => <div className={`${SIZES[size]} rounded-full border-gray-200 dark:border-gray-700 border-t-primary-600 animate-spin ${className}`} />
export default Spinner

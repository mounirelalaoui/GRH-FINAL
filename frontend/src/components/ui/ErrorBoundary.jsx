import { Component } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state={hasError:false,error:null} }
  static getDerivedStateFromError(error){ return {hasError:true,error} }
  componentDidCatch(error,info){ console.error('[ErrorBoundary]',error,info) }
  render(){
    if (!this.state.hasError) return this.props.children
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <div className="card p-8 max-w-md w-full text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto"><AlertCircle size={32} className="text-red-500"/></div>
          <div><h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Une erreur s'est produite</h2><p className="text-sm text-gray-500 dark:text-gray-400">Un problème inattendu est survenu.</p></div>
          <div className="flex gap-3 justify-center">
            <button onClick={()=>this.setState({hasError:false,error:null})} className="btn-ghost btn text-sm">Réessayer</button>
            <button onClick={()=>window.location.reload()} className="btn-primary btn text-sm flex items-center gap-2"><RefreshCw size={15}/>Recharger</button>
          </div>
        </div>
      </div>
    )
  }
}
export default ErrorBoundary

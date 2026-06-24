import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster }       from 'react-hot-toast'
import { AuthProvider }  from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import AppRouter         from '@/routes/AppRouter'
import ErrorBoundary     from '@/components/ui/ErrorBoundary'
const qc = new QueryClient({ defaultOptions:{ queries:{ retry:1, refetchOnWindowFocus:false, staleTime:5*60*1000 }, mutations:{retry:0} } })
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
            <Toaster position="top-right" toastOptions={{ duration:4000, style:{borderRadius:'12px',fontSize:'13px',fontWeight:'500'},
              success:{iconTheme:{primary:'#10b981',secondary:'#fff'}},
              error:{iconTheme:{primary:'#ef4444',secondary:'#fff'},duration:5000} }} />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
)
export default App

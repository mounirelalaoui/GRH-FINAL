import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
const RoleGuard = ({ children, roles, redirect = '/dashboard' }) => {
  const { user } = useAuth()
  const allowed = Array.isArray(roles) ? roles.includes(user?.Role) : user?.Role === roles
  if (!allowed) return <Navigate to={redirect} replace />
  return children
}
export default RoleGuard

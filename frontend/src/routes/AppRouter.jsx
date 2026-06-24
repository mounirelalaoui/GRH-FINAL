import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute   from './ProtectedRoute'
import RoleGuard        from './RoleGuard'
import LoadingScreen    from '@/components/ui/LoadingScreen'
import MainLayout       from '@/components/layout/MainLayout'

const lz = (fn) => lazy(() => fn().catch(() => new Promise(r => setTimeout(r, 300)).then(() => lz(fn)())))

const Login             = lz(() => import('@/pages/auth/Login'))
const Dashboard         = lz(() => import('@/pages/dashboard/Dashboard'))
const PersonnelList     = lz(() => import('@/pages/personnels/PersonnelList'))
const PersonnelCreate   = lz(() => import('@/pages/personnels/PersonnelCreate'))
const PersonnelEdit     = lz(() => import('@/pages/personnels/PersonnelEdit'))
const PersonnelDetail   = lz(() => import('@/pages/personnels/PersonnelDetail'))
const CongeList         = lz(() => import('@/pages/conges/CongeList'))
const CongeCreate       = lz(() => import('@/pages/conges/CongeCreate'))
const CongeEdit         = lz(() => import('@/pages/conges/CongeEdit'))
const AbsenceList       = lz(() => import('@/pages/absences/AbsenceList'))
const AbsenceCreate     = lz(() => import('@/pages/absences/AbsenceCreate'))
const AbsenceEdit       = lz(() => import('@/pages/absences/AbsenceEdit'))
const EtablissementList = lz(() => import('@/pages/etablissements/EtablissementList'))
const SpecialiteList    = lz(() => import('@/pages/specialites/SpecialiteList'))
const DiplomeList       = lz(() => import('@/pages/diplomes/DiplomeList'))
const UtilisateurList   = lz(() => import('@/pages/utilisateurs/UtilisateurList'))
const Profil            = lz(() => import('@/pages/profil/Profil'))
const NotFound          = lz(() => import('@/pages/NotFound'))
const AccessDenied      = lz(() => import('@/pages/AccessDenied'))

const AppRouter = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/403"   element={<AccessDenied />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"           element={<Dashboard />} />
        <Route path="/personnels"          element={<PersonnelList />} />
        <Route path="/personnels/nouveau"  element={<PersonnelCreate />} />
        <Route path="/personnels/:id"      element={<PersonnelDetail />} />
        <Route path="/personnels/:id/edit" element={<PersonnelEdit />} />
        <Route path="/conges"              element={<CongeList />} />
        <Route path="/conges/nouveau"      element={<CongeCreate />} />
        <Route path="/conges/:id/edit"     element={<CongeEdit />} />
        <Route path="/absences"            element={<AbsenceList />} />
        <Route path="/absences/nouveau"    element={<AbsenceCreate />} />
        <Route path="/absences/:id/edit"   element={<AbsenceEdit />} />
        <Route path="/profil"              element={<Profil />} />
        <Route path="/etablissements" element={<RoleGuard roles="directeurducomlex"><EtablissementList /></RoleGuard>} />
        <Route path="/specialites"    element={<RoleGuard roles="directeurducomlex"><SpecialiteList /></RoleGuard>} />
        <Route path="/diplomes"       element={<RoleGuard roles="directeurducomlex"><DiplomeList /></RoleGuard>} />
        <Route path="/utilisateurs"   element={<RoleGuard roles="directeurducomlex"><UtilisateurList /></RoleGuard>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
)
export default AppRouter

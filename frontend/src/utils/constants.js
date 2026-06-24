export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
export const ROLES = { DIRECTEUR:'directeurducomlex', GESTIONNAIRE:'gestionnairecfmr' }
export const ROLE_LABELS = { directeurducomlex:'Directeur du complexe', gestionnairecfmr:'Gestionnaire CFMR' }
export const TYPE_PERSONNEL_OPTIONS = [{value:'formateur',label:'Formateur'},{value:'administratif',label:'Administratif'}]
export const STATUT_PERSONNEL_OPTIONS = [{value:'permanent',label:'Permanent'},{value:'vacataire',label:'Vacataire'}]
export const STATUT_CONGE_OPTIONS = [{value:'en_attente',label:'En attente'},{value:'approuve',label:'Approuvé'},{value:'refuse',label:'Refusé'}]
export const TYPE_CONGE = ['Congé annuel','Congé maladie','Congé maternité','Congé paternité','Congé sans solde','Congé exceptionnel','Congé pour formation']
export const TYPE_CONGE_OPTIONS = TYPE_CONGE.map(t=>({value:t,label:t}))
export const SITUATION_FAMILIALE_OPTIONS = [{value:'Célibataire',label:'Célibataire'},{value:'Marié(e)',label:'Marié(e)'},{value:'Divorcé(e)',label:'Divorcé(e)'},{value:'Veuf/Veuve',label:'Veuf/Veuve'}]
export const ITEMS_PER_PAGE = 10
export const CHART_COLORS = {blue:'#3b82f6',purple:'#8b5cf6',green:'#10b981',amber:'#f59e0b',red:'#ef4444',cyan:'#06b6d4'}
export const ERROR_MESSAGES = {NETWORK:'Impossible de joindre le serveur.',SERVER:'Erreur serveur. Veuillez réessayer.',FORBIDDEN:"Vous n'avez pas les permissions nécessaires.",NOT_FOUND:'La ressource demandée est introuvable.',SESSION:'Votre session a expiré. Veuillez vous reconnecter.'}
export const SIDEBAR_ITEMS = [
  { group:'Principal', items:[
    {label:'Tableau de bord',icon:'LayoutDashboard',path:'/dashboard',roles:['directeurducomlex','gestionnairecfmr']},
    {label:'Personnels',icon:'Users',path:'/personnels',roles:['directeurducomlex','gestionnairecfmr']},
    {label:'Congés',icon:'CalendarDays',path:'/conges',roles:['directeurducomlex','gestionnairecfmr']},
    {label:'Absences',icon:'UserX',path:'/absences',roles:['directeurducomlex','gestionnairecfmr']},
  ]},
  { group:'Administration', items:[
    {label:'Établissements',icon:'Building2',path:'/etablissements',roles:['directeurducomlex']},
    {label:'Spécialités',icon:'GraduationCap',path:'/specialites',roles:['directeurducomlex']},
    {label:'Diplômes',icon:'Award',path:'/diplomes',roles:['directeurducomlex']},
    {label:'Utilisateurs',icon:'ShieldCheck',path:'/utilisateurs',roles:['directeurducomlex']},
  ]},
]

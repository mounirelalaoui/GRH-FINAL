export const ENDPOINTS = {
  AUTH: { LOGIN:'/login', LOGOUT:'/logout', ME:'/me' },
  PERSONNELS: { BASE:'/personnels', BY_ID:(id)=>`/personnels/${id}`, DIPLOMES:(id)=>`/personnels/${id}/diplomes`, SPECIALITES:(id)=>`/personnels/${id}/specialites`, CONGES:(id)=>`/personnels/${id}/conges`, ABSENCES:(id)=>`/personnels/${id}/absences` },
  CONGES:         { BASE:'/conges',         BY_ID:(id)=>`/conges/${id}`,         STATUT:(id)=>`/conges/${id}/statut` },
  ABSENCES:       { BASE:'/absences',       BY_ID:(id)=>`/absences/${id}`,       STATS:'/absences/stats' },
  ETABLISSEMENTS: { BASE:'/etablissements', BY_ID:(id)=>`/etablissements/${id}` },
  SPECIALITES:    { BASE:'/specialites',    BY_ID:(id)=>`/specialites/${id}`    },
  DIPLOMES:       { BASE:'/diplomes',       BY_ID:(id)=>`/diplomes/${id}`       },
  USERS:          { BASE:'/users',          BY_ID:(id)=>`/users/${id}`,          PASSWORD:(id)=>`/users/${id}/password`, TOGGLE:(id)=>`/users/${id}/toggle` },
  DASHBOARD:      { STATS:'/dashboard/stats', CHARTS:'/dashboard/charts', RECENT:'/dashboard/recent', TOP_ABS:'/dashboard/top-absences' },
}

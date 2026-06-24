export const QK = {
  personnels:     (params) => ['personnels', params],
  personnel:      (id)     => ['personnel', id],
  conges:         (params) => ['conges', params],
  absences:       (params) => ['absences', params],
  etablissements: ()       => ['etablissements'],
  specialites:    ()       => ['specialites'],
  diplomes:       ()       => ['diplomes'],
  users:          ()       => ['users'],
  dashboard: {
    stats:  ['dashboard','stats'],
    charts: ['dashboard','charts'],
    recent: ['dashboard','recent'],
    topAbs: ['dashboard','topAbs'],
  },
}

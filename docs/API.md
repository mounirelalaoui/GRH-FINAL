# Documentation API — GestionRH

## Base URL
`http://localhost:8000/api`

## Authentication
Toutes les routes (sauf `/login`) nécessitent :
```
Authorization: Bearer {token}
```

## Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /login | Connexion → {token, user} |
| POST | /logout | Révoque le token |
| GET  | /me | Profil connecté |
| POST | /change-password | Changer mot de passe |

### Personnels
| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | /personnels | Liste paginée + filtres |
| POST   | /personnels | Créer (multipart/form-data) |
| GET    | /personnels/{id} | Détail + relations |
| PUT    | /personnels/{id} | Modifier |
| DELETE | /personnels/{id} | Supprimer |
| GET    | /personnels/{id}/conges | Congés du personnel |
| GET    | /personnels/{id}/absences | Absences du personnel |
| GET    | /personnels/{id}/diplomes | Diplômes (pivot obtenir) |
| GET    | /personnels/{id}/specialites | Spécialités (pivot enseigner) |

### Congés
| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | /conges | Liste paginée |
| POST   | /conges | Créer |
| PUT    | /conges/{id} | Modifier |
| PATCH  | /conges/{id}/statut | Workflow approbation |
| DELETE | /conges/{id} | Supprimer |

### Absences
| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | /absences | Liste paginée |
| GET    | /absences/stats | Statistiques |
| POST   | /absences | Créer |
| PUT    | /absences/{id} | Modifier |
| DELETE | /absences/{id} | Supprimer |

### Référentiels (Établissements / Spécialités / Diplômes)
Format identique (CRUD complet) pour chaque ressource.

### Dashboard
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /dashboard/stats | KPIs globaux |
| GET | /dashboard/charts | Données graphiques |
| GET | /dashboard/recent | Activité récente |
| GET | /dashboard/top-absences | Top 5 absents |

### Utilisateurs (Directeur uniquement)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET    | /users | Liste |
| POST   | /users | Créer |
| PUT    | /users/{id} | Modifier |
| PATCH  | /users/{id}/password | Reset MDP |
| PATCH  | /users/{id}/toggle | Activer/Désactiver |
| DELETE | /users/{id} | Supprimer |

# GestionRH — Système de Gestion du Personnel CFMR

Application web complète de gestion RH pour les centres de formation marocains.

## Stack Technique

| Couche     | Technologies |
|------------|-------------|
| Frontend   | React 18 + Vite + Tailwind CSS + React Query |
| Backend    | Laravel 11 + Sanctum + MySQL |
| Auth       | JWT via Laravel Sanctum |
| UI         | Lucide React + SweetAlert2 + React Hot Toast |
| Graphiques | Recharts |
| Formulaires| React Hook Form + Zod |

## Démarrage Rapide (Windows)

```powershell
# 1. Installation complète
.\scripts\Install-GRH.ps1

# 2. Démarrer l'application
.\scripts\Start-GRH.ps1
```

## Comptes de Test

| Rôle         | Email                     | Mot de passe | Accès          |
|--------------|---------------------------|--------------|----------------|
| Directeur    | directeur@cfmr.ma         | password123  | Complet        |
| Gestionnaire | gestionnaire@cfmr.ma      | password123  | Limité         |

## Structure du Projet

```
GRH-FINAL/
├── frontend/          # React + Vite
│   └── src/
│       ├── api/            # Axios + endpoints
│       ├── components/     # UI + Shared + Layout
│       ├── context/        # Auth + Theme
│       ├── hooks/          # 18 hooks custom
│       ├── pages/          # 21 pages
│       ├── routes/         # Router + Guards
│       ├── services/       # 9 services API
│       └── utils/          # Helpers + validators
├── backend/           # Laravel 11 API
│   ├── app/Http/Controllers/Api/  (9 controllers)
│   ├── app/Models/                (7 models)
│   ├── database/seeders/          (7 seeders)
│   └── routes/api.php
├── database/          # gestion_rh.sql
├── scripts/           # PowerShell
│   ├── Install-GRH.ps1
│   └── Start-GRH.ps1
└── docs/              # Documentation
```

## Modules

| Module           | Rôle requis  | Fonctionnalités                     |
|------------------|--------------|--------------------------------------|
| Dashboard        | Tous         | Stats, graphiques, activité récente |
| Personnels       | Tous         | CRUD, photo, diplômes, spécialités  |
| Congés           | Tous         | CRUD, workflow approbation          |
| Absences         | Tous         | CRUD, statistiques                  |
| Établissements   | Directeur    | CRUD                                |
| Spécialités      | Directeur    | CRUD                                |
| Diplômes         | Directeur    | CRUD                                |
| Utilisateurs     | Directeur    | CRUD, rôles, reset MDP              |

## Prérequis

- Windows 10/11
- Node.js >= 18
- PHP >= 8.2
- Composer
- MySQL >= 8.0 (XAMPP / Laragon / MySQL Server)

## Variables d'Environnement

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=GestionRH
```

### Backend (.env)
```env
DB_DATABASE=gestion_rh
DB_USERNAME=root
DB_PASSWORD=
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
```

## Relations Many-to-Many

- `obtenir` : personnel ↔ diplôme
- `enseigner` : personnel ↔ spécialité

## Licence

© 2026 GestionRH CFMR — Tous droits réservés

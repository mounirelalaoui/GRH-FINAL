# Guide d'Installation — GestionRH

## Méthode Rapide (PowerShell Windows)

### Prérequis
1. **Node.js 18+** : https://nodejs.org
2. **XAMPP** (PHP + MySQL) : https://www.apachefriends.org
3. **Composer** : https://getcomposer.org

### Installation en 2 commandes

```powershell
# Ouvrir PowerShell en Administrateur
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Lancer l'installation
.\scripts\Install-GRH.ps1 -DBUser root -DBPassword ""

# Démarrer l'application
.\scripts\Start-GRH.ps1
```

## Installation Manuelle

### 1. Base de données MySQL
```sql
CREATE DATABASE gestion_rh CHARACTER SET utf8mb4;
```
Ou importer directement :
```bash
mysql -u root -p gestion_rh < database/gestion_rh.sql
```

### 2. Backend Laravel
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Modifier .env : DB_DATABASE, DB_USERNAME, DB_PASSWORD
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

### 3. Frontend React
```bash
cd frontend
npm install
# Vérifier .env : VITE_API_URL=http://localhost:8000/api
npm run dev
```

### 4. Ouvrir l'application
```
http://localhost:5173
```

## Comptes de Test (créés automatiquement)

| Rôle | Email | MDP | Permissions |
|------|-------|-----|-------------|
| Directeur | directeur@cfmr.ma | password123 | Tout |
| Gestionnaire | gestionnaire@cfmr.ma | password123 | Personnel/Congés/Absences |

## Résolution de Problèmes

### Erreur CORS
Vérifier `backend/config/cors.php` :
```php
'allowed_origins' => ['http://localhost:5173'],
```

### Erreur 401 après login
Vérifier `backend/.env` :
```
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### Port déjà utilisé
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Photos non affichées
```bash
php artisan storage:link
```

## Format API

Réponses paginées :
```json
{ "data": [...], "current_page": 1, "last_page": 5, "per_page": 10, "total": 48 }
```

Erreurs de validation :
```json
{ "message": "The given data was invalid.", "errors": { "field": ["Message"] } }
```

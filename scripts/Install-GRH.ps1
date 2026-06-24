#Requires -Version 5.1
<#
.SYNOPSIS
    Script d'installation automatique — GestionRH
.DESCRIPTION
    Installe et configure l'application GestionRH (Frontend React + Backend Laravel) sur Windows 10/11
.NOTES
    Version : 2.0
#>

[CmdletBinding()]
param(
    [string]$DBHost     = "127.0.0.1",
    [string]$DBPort     = "3306",
    [string]$DBName     = "gestion_rh",
    [string]$DBUser     = "root",
    [SecureString]$DBPassword = "",
    [switch]$SkipPrerequisites,
    [switch]$SkipSeed
)

$ErrorActionPreference = "Stop"
$Script:Errors    = @()
$Script:Warnings  = @()
$Script:StartTime = Get-Date

function Write-Header($msg) { Write-Host "`n$('='*65)" -ForegroundColor Cyan; Write-Host "  $msg" -ForegroundColor Cyan; Write-Host "$('='*65)" -ForegroundColor Cyan }
function Write-Step($msg)   { Write-Host "  > $msg" -ForegroundColor White }
function Write-OK($msg)     { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg)   { Write-Host "  [!] $msg" -ForegroundColor Yellow; $Script:Warnings += $msg }
function Write-Fail($msg)   { Write-Host "  [X] $msg" -ForegroundColor Red; $Script:Errors += $msg }
function Write-Info($msg)   { Write-Host "  [i] $msg" -ForegroundColor Cyan }

$RootDir     = Split-Path -Parent $PSScriptRoot
$FrontendDir = Join-Path $RootDir "frontend"
$BackendDir  = Join-Path $RootDir "backend"
$DBScript    = Join-Path $RootDir "database\gestion_rh.sql"
$LogDir      = Join-Path $RootDir "logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$LogFile = Join-Path $LogDir "install_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

function Write-Log($msg) { "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | $msg" | Add-Content -Path $LogFile }

Clear-Host
Write-Host @"
 ================================================================
           GestionRH - Script d'Installation v2.0
      Systeme de Gestion du Personnel CFMR
 ================================================================
"@ -ForegroundColor Cyan
Write-Host "  Demarre le : $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray
Write-Host "  Repertoire : $RootDir`n" -ForegroundColor Gray
Write-Log "Installation demarree"

# ── ÉTAPE 1 : Prérequis ──
if (-not $SkipPrerequisites) {
    Write-Header "ETAPE 1 - Verification des prerequis"
    try {
        $nodeVersion = (node --version 2>&1).ToString().Trim()
        $nodeMajor   = [int]($nodeVersion -replace 'v','').Split('.')[0]
        if ($nodeMajor -ge 18) { Write-OK "Node.js $nodeVersion (>= 18 requis)" }
        else { Write-Warn "Node.js $nodeVersion detecte - version >= 18 recommandee" }
    } catch {
        Write-Fail "Node.js non trouve. Installer depuis https://nodejs.org"
        Start-Process "https://nodejs.org/en/download"
        Write-Host "  Relancez le script apres installation." -ForegroundColor Yellow
        exit 1
    }
    try { $npmVersion = (npm --version 2>&1).ToString().Trim(); Write-OK "npm v$npmVersion" } catch { Write-Fail "npm non trouve"; exit 1 }
    try { $phpVersion = (php --version 2>&1)[0].ToString(); Write-OK "PHP detecte : $($phpVersion.Split([Environment]::NewLine)[0])" } catch { Write-Warn "PHP non trouve. Installez XAMPP/Laragon." }
    try { $composerVersion = (composer --version 2>&1).ToString().Split([Environment]::NewLine)[0]; Write-OK $composerVersion } catch { Write-Warn "Composer non trouve. https://getcomposer.org" }
    Write-OK "Verification des prerequis terminee"
}

# ── ÉTAPE 2 : Frontend ──
Write-Header "ETAPE 2 - Installation Frontend React"
if (-not (Test-Path $FrontendDir)) { Write-Fail "Dossier frontend introuvable : $FrontendDir"; exit 1 }
Set-Location $FrontendDir
Write-Step "Configuration .env Frontend..."
if (-not (Test-Path ".env")) {
    "VITE_API_URL=http://localhost:8000/api`nVITE_APP_NAME=GestionRH" | Set-Content ".env" -Encoding UTF8
    Write-OK ".env Frontend cree"
} else { Write-Info ".env Frontend deja existant" }
Write-Step "Installation des dependances npm (peut prendre 2-5 min)..."
try { npm install --loglevel=error 2>&1 | Out-Null; Write-OK "Dependances npm installees" }
catch { Write-Fail "Erreur npm install : $_"; Write-Log "ERREUR npm install: $_" }

# ── ÉTAPE 3 : Backend ──
Write-Header "ETAPE 3 - Installation Backend Laravel"
if (-not (Test-Path $BackendDir)) {
    Write-Warn "Dossier backend introuvable. Creation d'un projet Laravel..."
    Set-Location $RootDir
    try {
        composer create-project laravel/laravel backend --prefer-dist --quiet
        composer require laravel/sanctum --working-dir="$BackendDir" --quiet
        Write-OK "Projet Laravel + Sanctum installes"
    } catch { Write-Fail "Erreur creation projet Laravel : $_" }
}
Set-Location $BackendDir
Write-Step "Configuration .env Backend..."
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") { Copy-Item ".env.example" ".env" }
    $envContent = Get-Content ".env" -Raw
    $envContent = $envContent -replace 'DB_DATABASE=.*', "DB_DATABASE=$DBName"
    $envContent = $envContent -replace 'DB_USERNAME=.*', "DB_USERNAME=$DBUser"
    $envContent = $envContent -replace 'DB_PASSWORD=.*', "DB_PASSWORD=$DBPassword"
    $envContent = $envContent -replace 'DB_HOST=.*',     "DB_HOST=$DBHost"
    $envContent = $envContent -replace 'DB_PORT=.*',     "DB_PORT=$DBPort"
    $envContent | Set-Content ".env" -Encoding UTF8
    Write-OK ".env Backend configure"
} else { Write-Info ".env Backend deja existant" }
Write-Step "Installation des dependances PHP Composer..."
try { composer install --no-interaction --prefer-dist --optimize-autoloader --quiet; Write-OK "Dependances PHP installees" } catch { Write-Warn "Erreur composer install : $_" }
Write-Step "Generation de la cle d'application..."
try { php artisan key:generate --force --quiet; Write-OK "APP_KEY generee" } catch { Write-Warn "Erreur key:generate : $_" }

# ── ÉTAPE 4 : Base de données ──
Write-Header "ETAPE 4 - Configuration de la base de donnees"
Write-Step "Creation de la base de donnees '$DBName'..."
if (Test-Path $DBScript) {
    try {
        $mysqlCmd = "mysql -h $DBHost -P $DBPort -u $DBUser"
        if ($DBPassword) { $mysqlCmd += " -p$DBPassword" }
        $mysqlCmd += " < `"$DBScript`""
        Invoke-Expression $mysqlCmd 2>&1 | Out-Null
        Write-OK "Base de donnees importee depuis SQL"
    } catch {
        Write-Warn "Import SQL direct echoue, tentative via artisan..."
        try { php artisan migrate --force --quiet; Write-OK "Migrations executees" } catch { Write-Warn "Migrations echouees : $_" }
    }
} else {
    try { php artisan migrate --force --quiet; Write-OK "Migrations executees" } catch { Write-Warn "Migrations echouees - verifiez la connexion MySQL" }
}
if (-not $SkipSeed) {
    Write-Step "Execution des seeders..."
    try { php artisan db:seed --force --quiet; Write-OK "Seeders executes - donnees de test creees" } catch { Write-Warn "Seeders echoues : $_" }
}
Write-Step "Creation du lien symbolique storage..."
try { php artisan storage:link --quiet; Write-OK "Lien storage cree" } catch { Write-Warn "Lien storage : $_" }

# ── ÉTAPE 5 : Vérification ──
Write-Header "ETAPE 5 - Verification finale"
$checks = @(
    @{ Name="Frontend node_modules"; Path=Join-Path $FrontendDir "node_modules" },
    @{ Name="Frontend .env";         Path=Join-Path $FrontendDir ".env" },
    @{ Name="Backend .env";          Path=Join-Path $BackendDir  ".env" },
    @{ Name="Backend vendor/";       Path=Join-Path $BackendDir  "vendor" },
    @{ Name="SQL Database script";   Path=$DBScript }
)
foreach ($check in $checks) {
    if (Test-Path $check.Path) { Write-OK $check.Name } else { Write-Warn "$($check.Name) - manquant" }
}

# ── RAPPORT ──
$duration = (Get-Date) - $Script:StartTime
Write-Header "RAPPORT D'INSTALLATION"
Write-Host "  Duree totale    : $($duration.Minutes)m $($duration.Seconds)s" -ForegroundColor White
Write-Host "  Avertissements  : $($Script:Warnings.Count)" -ForegroundColor Yellow
Write-Host "  Erreurs         : $($Script:Errors.Count)" -ForegroundColor $(if($Script:Errors.Count -eq 0){'Green'}else{'Red'})
Write-Host "  Journal         : $LogFile" -ForegroundColor Gray

if ($Script:Errors.Count -eq 0) {
    Write-Host @"

 ================================================================
          INSTALLATION REUSSIE !

  Lancez maintenant : .\scripts\Start-GRH.ps1

  Comptes de test :
  - directeur@cfmr.ma / password123 (Directeur)
  - gestionnaire@cfmr.ma / password123 (Gestionnaire)
 ================================================================
"@ -ForegroundColor Green
} else {
    Write-Host "`n  Certaines etapes ont echoue. Consultez le journal." -ForegroundColor Red
    foreach ($err in $Script:Errors) { Write-Host "  - $err" -ForegroundColor Red }
}
Write-Log "Installation terminee. Erreurs: $($Script:Errors.Count), Warnings: $($Script:Warnings.Count)"

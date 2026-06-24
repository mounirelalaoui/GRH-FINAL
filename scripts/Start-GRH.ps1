#Requires -Version 5.1
<#
.SYNOPSIS
    Script de demarrage - GestionRH
.DESCRIPTION
    Demarre le Backend Laravel et le Frontend React en parallele,
    verifie l'environnement et ouvre l'application dans le navigateur.
.NOTES
    Version : 2.0
#>

[CmdletBinding()]
param(
    [int]    $BackendPort  = 8000,
    [int]    $FrontendPort = 5173,
    [switch] $NoBrowser,
    [switch] $ProductionBuild
)

$ErrorActionPreference = "SilentlyContinue"

function Write-Banner {
    Clear-Host
    Write-Host @"
 ================================================================
             GestionRH - Demarrage de l'Application
                    React + Laravel API
 ================================================================
"@ -ForegroundColor Cyan
    Write-Host "  $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Gray
    Write-Host ""
}
function Write-Section($msg) { Write-Host "`n  -- $msg" -ForegroundColor Cyan }
function Write-OK($msg)      { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg)    { Write-Host "  [!] $msg" -ForegroundColor Yellow }
function Write-Fail($msg)    { Write-Host "  [X] $msg" -ForegroundColor Red }
function Write-Step($msg)    { Write-Host "  > $msg" -ForegroundColor White }
function Write-Info($msg)    { Write-Host "  [i] $msg" -ForegroundColor Gray }

$RootDir     = Split-Path -Parent $PSScriptRoot
$FrontendDir = Join-Path $RootDir "frontend"
$BackendDir  = Join-Path $RootDir "backend"
$LogDir      = Join-Path $RootDir "logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$BackendLog  = Join-Path $LogDir "backend.log"
$FrontendLog = Join-Path $LogDir "frontend.log"

Write-Banner

# ── Vérification environnement ──
Write-Section "Verification de l'environnement"
try { $nodeVer = (node --version 2>&1).ToString().Trim(); Write-OK "Node.js $nodeVer" }
catch { Write-Fail "Node.js non trouve. Lancez Install-GRH.ps1 d'abord."; exit 1 }
try { $phpVer = (php --version 2>&1)[0].ToString().Split(' ')[1]; Write-OK "PHP v$phpVer" }
catch { Write-Warn "PHP non trouve dans le PATH" }

if (Test-Path (Join-Path $FrontendDir "node_modules")) { Write-OK "node_modules Frontend present" }
else {
    Write-Warn "node_modules manquant - installation..."
    Set-Location $FrontendDir; npm install --loglevel=error --silent
    Write-OK "Dependances installees"
}
if (Test-Path (Join-Path $BackendDir "vendor")) { Write-OK "vendor Backend present" }
else {
    Write-Warn "vendor manquant - installation..."
    Set-Location $BackendDir; composer install --no-interaction --prefer-dist --quiet
    Write-OK "Dependances PHP installees"
}
if (-not (Test-Path (Join-Path $BackendDir ".env"))) {
    Write-Warn ".env Backend manquant - copie depuis .env.example"
    Copy-Item (Join-Path $BackendDir ".env.example") (Join-Path $BackendDir ".env")
    Set-Location $BackendDir; php artisan key:generate --force --quiet
}

# ── Vérification des ports ──
Write-Section "Verification des ports"
foreach ($port in @($BackendPort, $FrontendPort)) {
    $inUse = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($inUse) {
        Write-Warn "Port $port deja utilise - arret du processus..."
        $procId = (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1).OwningProcess
        if ($procId) {
            $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
            if ($proc) {
                Write-Info "Arret de : $($proc.ProcessName) (PID: $($proc.Id))"
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                Start-Sleep -Milliseconds 500
            }
        }
    } else { Write-OK "Port $port disponible" }
}

# ── Démarrage Backend ──
Write-Section "Demarrage Backend Laravel (port $BackendPort)"
$backendScript = {
    param($dir, $port, $log)
    Set-Location $dir
    "=== Backend Laravel - $(Get-Date) ===" | Set-Content $log
    php artisan serve --host=0.0.0.0 --port=$port 2>&1 | Tee-Object -FilePath $log -Append
}
$backendJob = Start-Job -ScriptBlock $backendScript -ArgumentList $BackendDir, $BackendPort, $BackendLog

Write-Step "Attente du demarrage backend..."
$waited = 0; $backendOK = $false
while ($waited -lt 15) {
    Start-Sleep -Seconds 1; $waited++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$BackendPort/api/me" -TimeoutSec 2 -ErrorAction SilentlyContinue
        $backendOK = $true; break
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -in @(401,403,404,405,422)) { $backendOK = $true; break }
    }
    Write-Host "." -NoNewline -ForegroundColor Gray
}
Write-Host ""
if ($backendOK) { Write-OK "Backend Laravel demarre sur http://localhost:$BackendPort" }
else { Write-Warn "Backend: timeout - verifiez les logs ($BackendLog)" }

# ── Démarrage Frontend ──
Write-Section "Demarrage Frontend React (port $FrontendPort)"
if ($ProductionBuild) {
    Write-Step "Build production..."
    Set-Location $FrontendDir
    npm run build 2>&1 | Out-File $FrontendLog
    Write-OK "Build production genere dans dist/"
    $frontendScript = {
        param($dir, $port, $log)
        Set-Location $dir
        "=== Frontend Preview - $(Get-Date) ===" | Set-Content $log
        npm run preview -- --port $port --host 2>&1 | Tee-Object -FilePath $log -Append
    }
} else {
    $frontendScript = {
        param($dir, $port, $log)
        Set-Location $dir
        "=== Frontend Dev - $(Get-Date) ===" | Set-Content $log
        npm run dev -- --port $port --host 2>&1 | Tee-Object -FilePath $log -Append
    }
}
$frontendJob = Start-Job -ScriptBlock $frontendScript -ArgumentList $FrontendDir, $FrontendPort, $FrontendLog

Write-Step "Attente du demarrage frontend..."
$waited = 0; $frontendOK = $false
while ($waited -lt 20) {
    Start-Sleep -Seconds 1; $waited++
    try { $null = Invoke-WebRequest -Uri "http://localhost:$FrontendPort" -TimeoutSec 2 -ErrorAction Stop; $frontendOK = $true; break } catch { }
    Write-Host "." -NoNewline -ForegroundColor Gray
}
Write-Host ""
if ($frontendOK) { Write-OK "Frontend React demarre sur http://localhost:$FrontendPort" }
else { Write-Warn "Frontend: delai depasse - verifiez les logs ($FrontendLog)" }

# ── Ouverture navigateur ──
if (-not $NoBrowser -and $frontendOK) {
    Write-Section "Ouverture du navigateur"
    Start-Sleep -Seconds 1
    Start-Process "http://localhost:$FrontendPort"
    Write-OK "Navigateur ouvert sur http://localhost:$FrontendPort"
}

# ── Résumé ──
Write-Host @"

 ================================================================
                   APPLICATION DEMARREE
 ----------------------------------------------------------------
  Frontend  : http://localhost:$FrontendPort
  Backend   : http://localhost:$BackendPort/api
 ----------------------------------------------------------------
  COMPTES DE TEST :
  directeur@cfmr.ma    / password123  (Directeur)
  gestionnaire@cfmr.ma / password123  (Gestionnaire)
 ----------------------------------------------------------------
  Logs Backend  : logs\backend.log
  Logs Frontend : logs\frontend.log
 ----------------------------------------------------------------
  Ctrl+C pour arreter les serveurs
 ================================================================
"@ -ForegroundColor Cyan

Write-Host "`n  Surveillance en cours (Ctrl+C pour arreter)...`n" -ForegroundColor Gray

try {
    while ($true) {
        Start-Sleep -Seconds 10
        $bState = (Get-Job -Id $backendJob.Id -ErrorAction SilentlyContinue).State
        if ($bState -eq 'Failed' -or $bState -eq 'Completed') {
            Write-Warn "Backend arrete (etat: $bState) - redemarrage..."
            $backendJob = Start-Job -ScriptBlock $backendScript -ArgumentList $BackendDir, $BackendPort, $BackendLog
        }
        $fState = (Get-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue).State
        if ($fState -eq 'Failed' -or $fState -eq 'Completed') {
            Write-Warn "Frontend arrete (etat: $fState) - redemarrage..."
            $frontendJob = Start-Job -ScriptBlock $frontendScript -ArgumentList $FrontendDir, $FrontendPort, $FrontendLog
        }
        Write-Host "." -NoNewline -ForegroundColor DarkGray
    }
} finally {
    Write-Host "`n`n  Arret en cours..." -ForegroundColor Yellow
    Stop-Job -Id $backendJob.Id  -ErrorAction SilentlyContinue
    Stop-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $backendJob.Id  -Force -ErrorAction SilentlyContinue
    Remove-Job -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
    Write-OK "Serveurs arretes proprement"
}

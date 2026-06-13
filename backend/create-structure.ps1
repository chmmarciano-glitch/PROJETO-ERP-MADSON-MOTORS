# ============================================================
# MADSON MOTORS ERP - Criador de Estrutura de Pastas Backend
# Uso: powershell -ExecutionPolicy Bypass -File create-structure.ps1
# ============================================================

$dirs = @(
  "src\controllers",
  "src\routes",
  "src\middlewares",
  "src\services",
  "src\utils",
  "src\models",
  "src\config",
  "src\types",
  "tests",
  "logs"
)

Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "   MADSON MOTORS ERP - Criando Estrutura Backend" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

foreach ($dir in $dirs) {
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    New-Item -ItemType File -Path "$dir\.gitkeep" -Force | Out-Null
    Write-Host "  CRIADO  : $dir" -ForegroundColor Green
  } else {
    Write-Host "  EXISTIA : $dir" -ForegroundColor DarkGray
  }
}

Write-Host "`n============================================================" -ForegroundColor Magenta
Write-Host "Verificando pastas..." -ForegroundColor Cyan

$all_ok = $true
foreach ($dir in $dirs) {
  if (Test-Path $dir) {
    Write-Host "  OK  $dir" -ForegroundColor Green
  } else {
    Write-Host "  FALTA $dir" -ForegroundColor Red
    $all_ok = $false
  }
}

Write-Host "`n=== Arvore src/ ===" -ForegroundColor Cyan
tree src /A

if ($all_ok) {
  Write-Host "`n ESTRUTURA DE PASTAS CRIADA COM SUCESSO" -ForegroundColor Green
  Write-Host "============================================================`n" -ForegroundColor Magenta
} else {
  Write-Host "`n ALGUMAS PASTAS FALHARAM - VERIFIQUE ACIMA" -ForegroundColor Red
  exit 1
}

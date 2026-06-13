# ============================================================
# MADSON MOTORS ERP — Instalador de Dependencias Backend
# ============================================================

$ErrorActionPreference = "Stop"
$failed = @()

function Step {
    param([int]$num, [string]$desc)
    Write-Host "`n[$num/6] $desc" -ForegroundColor Cyan
    Write-Host ("-" * 55) -ForegroundColor DarkGray
}

function Run {
    param([string]$cmd)
    Write-Host ">> $cmd" -ForegroundColor DarkYellow
    Invoke-Expression $cmd
    if ($LASTEXITCODE -ne 0) {
        $script:failed += $cmd
        Write-Host "ERRO no comando acima!" -ForegroundColor Red
    }
}

Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "   MADSON MOTORS ERP — Instalando Dependencias Backend" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "Pasta: $(Get-Location)"
Write-Host "Node : $(node --version)"
Write-Host "npm  : $(npm --version)"

Step 1 "Express + TypeScript + CORS + Helmet + dotenv"
Run "npm install express typescript ts-node @types/express @types/node dotenv cors helmet"

Step 2 "Supabase + Zod + bcryptjs + jsonwebtoken"
Run "npm install @supabase/supabase-js zod bcryptjs jsonwebtoken @types/jsonwebtoken"

Step 3 "Loggers: winston + pino + pino-pretty"
Run "npm install winston pino pino-pretty"

Step 4 "IA: Anthropic (Claude) + Google Generative AI (Gemini)"
Run "npm install @anthropic-ai/sdk @google/generative-ai"

Step 5 "DevDependencies: nodemon + @types/bcryptjs"
Run "npm install --save-dev nodemon @types/bcryptjs"

Step 6 "Listando dependencias instaladas"
Write-Host "`n[6/6] npm list --depth=0" -ForegroundColor Cyan
Write-Host ("-" * 55) -ForegroundColor DarkGray
npm list --depth=0

# Resultado final
Write-Host "`n============================================================" -ForegroundColor Magenta
if ($failed.Count -eq 0) {
    Write-Host "  TODAS AS DEPENDENCIAS INSTALADAS COM SUCESSO" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Magenta
    Write-Host "`nProximos passos:" -ForegroundColor White
    Write-Host "  1. Copie backend/.env.example para backend/.env" -ForegroundColor Gray
    Write-Host "  2. Preencha as credenciais do Supabase no .env" -ForegroundColor Gray
    Write-Host "  3. Execute: npm run dev" -ForegroundColor Gray
} else {
    Write-Host "  ATENCAO: $($failed.Count) COMANDO(S) FALHARAM:" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Magenta
    $failed | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

@echo off
REM ================================================================
REM SERVIDOR HTTP LOCAL - NomadWear Frontend
REM ================================================================
REM
REM Este script inicia um servidor HTTP local para servir a
REM aplicação NomadWear.
REM
REM Requisitos:
REM - Python 3.10+ instalado
REM - Backend Java rodando.
REM
REM ================================================================

echo.
echo.
echo   ╔═══════════════════════════════════════╗
echo   ║  🧳 NOMADWEAR - SERVIDOR HTTP LOCAL  ║
echo   ╚═══════════════════════════════════════╝
echo.

REM Verificar se está no diretório correto
if not exist "index.html" (
    echo ❌ ERRO: arquivo index.html não encontrado!
    echo    Certifique-se de estar no diretório: nomad-wear\
    echo.
    pause
    exit /b 1
)

echo ✅ Arquivos encontrados:
echo   - index.html
echo   - style.css
echo   - app.js
echo   - modules/api.js, client.js, admin.js
echo.

REM Tentar com Python 3
echo 🚀 Iniciando servidor em http://localhost:8000...
echo.

python -m http.server 8000

if %errorlevel% neq 0 (
    echo ❌ ERRO ao iniciar servidor!
    echo.
    echo Soluções possíveis:
    echo 1. Python não está instalado
    echo 2. Python não está no PATH
    echo 3. Porta 8000 já está em uso
    echo.
    echo Alternativas:
    echo - Use Node.js: npx http-server .
    echo - Use PHP: php -S localhost:8000
    echo - Abra diretamente: file:///[path]/nomad-wear/index.html
    echo.
    pause
    exit /b 1
)

pause

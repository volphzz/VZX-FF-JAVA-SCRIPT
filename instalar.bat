@echo off
setlocal
cd /d "%~dp0"
if /I "%~1"=="--verificar" goto verificar

echo.
echo === VZX - Instalacao e configuracao ===
echo Instala Node.js se necessario, Electron e Koffi.
echo BlueStacks e o jogo precisam estar instalados separadamente.
echo.
where node.exe >nul 2>&1
if not errorlevel 1 goto node_pronto
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node.exe >nul 2>&1
if not errorlevel 1 goto node_pronto
where winget.exe >nul 2>&1
if errorlevel 1 goto sem_winget
echo Instalando Node.js LTS x64 pelo Windows Package Manager...
winget install --id OpenJS.NodeJS.LTS --exact --source winget --architecture x64 --accept-source-agreements --accept-package-agreements --disable-interactivity
if errorlevel 1 goto falha
set "PATH=%ProgramFiles%\nodejs;%LocalAppData%\Programs\nodejs;%PATH%"
where node.exe >nul 2>&1
if errorlevel 1 goto reabrir

:node_pronto
node -e "if(process.platform!=='win32'||process.arch!=='x64'||Number(process.versions.node.split('.')[0])<24){console.error('Requer Windows e Node.js 24 ou superior, x64.');process.exit(1)}"
if errorlevel 1 goto falha
if not exist package.json goto pacote_ausente
if not exist package-lock.json goto pacote_ausente
if not exist configurar.js goto pacote_ausente
if not exist bin\vzx_ff_reader_x86_64 goto pacote_ausente
echo.
echo [1/3] Instalando dependencias do package-lock.json...
call npm.cmd ci --no-audit --no-fund
if errorlevel 1 goto falha
echo.
echo [2/3] Preparando Electron e verificando Koffi...
node node_modules\electron\install.js
if errorlevel 1 goto falha
node -e "require('koffi');if(!require('fs').existsSync('node_modules/electron/dist/electron.exe'))process.exit(1);console.log('Electron e Koffi prontos.')"
if errorlevel 1 goto falha
echo.
echo [3/3] Configurando conexao e verificando o ambiente...
node configurar.js
if errorlevel 1 goto falha
echo.
echo Instalacao concluida. Confira os avisos acima sobre ADB/root/jogo.
echo Para abrir, use iniciar.ps1 nesta mesma pasta.
pause
exit /b 0

:verificar
where node.exe >nul 2>&1
if errorlevel 1 exit /b 1
node configurar.js --verificar
exit /b %errorlevel%

:sem_winget
echo Node.js nao encontrado e winget indisponivel.
echo Instale Node.js LTS x64 em https://nodejs.org/en/download
echo Depois abra este BAT novamente.
pause
exit /b 1
:reabrir
echo Node.js instalado. Feche este terminal e execute instalar.bat novamente.
pause
exit /b 1
:pacote_ausente
echo Pasta incompleta. Copie todo o projeto, incluindo bin, configurar.js e package-lock.json.
pause
exit /b 1
:falha
echo.
echo A instalacao nao foi concluida. Confira o erro acima e tente novamente.
pause
exit /b 1


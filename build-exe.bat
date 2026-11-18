@echo off
echo ========================================================
echo  Cleaning old build and dist folders...
echo ========================================================
if exist dist rmdir /s /q dist
if exist .next rmdir /s /q .next

echo ========================================================
echo  Building Next.js production bundle...
echo ========================================================
call npm run build

echo ========================================================
echo  Packaging fresh Windows executable (.exe)...
echo ========================================================
call npx electron-builder --win

echo ========================================================
echo  Copying .env file next to .exe...
echo ========================================================
if exist dist copy /y .env dist\.env
if exist dist\win-unpacked copy /y .env dist\win-unpacked\.env

echo ========================================================
echo  Build complete! Executable is in: dist\
echo ========================================================
